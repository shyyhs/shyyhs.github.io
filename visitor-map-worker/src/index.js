const jsonResponse = (data, init = {}) => {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(JSON.stringify(data), { ...init, headers });
};

const withCors = (response, origin) => {
  const headers = new Headers(response.headers);
  if (origin) headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  headers.set("Vary", "Origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const normalizeLocationStats = (stats) => {
  const totals = new Map();

  for (const stat of stats) {
    const visitors = Number(stat.count);
    const code = String(stat.id || "")
      .toUpperCase()
      .match(/^[A-Z]{2}/)?.[0];
    if (!code || !Number.isFinite(visitors) || visitors <= 0) continue;
    totals.set(code, (totals.get(code) || 0) + visitors);
  }

  const countries = [...totals.entries()]
    .map(([code, visitors]) => ({ code, visitors }))
    .sort((left, right) => right.visitors - left.visitors || left.code.localeCompare(right.code));
  const totalVisitors = countries.reduce((total, country) => total + country.visitors, 0);
  return { totalVisitors, countries };
};

const fetchLocationStats = async (env) => {
  if (!env.GOATCOUNTER_TOKEN) throw new Error("GOATCOUNTER_TOKEN is not configured");
  if (!/^[a-z0-9-]+$/.test(env.GOATCOUNTER_CODE || "")) throw new Error("Invalid GOATCOUNTER_CODE");

  const stats = [];
  let offset = 0;
  const end = new Date().toISOString();

  for (let page = 0; page < 10; page += 1) {
    const url = new URL(`https://${env.GOATCOUNTER_CODE}.goatcounter.com/api/v0/stats/locations`);
    url.searchParams.set("start", `${env.TRACKING_START}T00:00:00Z`);
    url.searchParams.set("end", end);
    url.searchParams.set("limit", "100");
    url.searchParams.set("offset", String(offset));

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.GOATCOUNTER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(`GoatCounter returned ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data.stats)) throw new Error("GoatCounter returned invalid statistics");
    stats.push(...data.stats);
    if (!data.more || data.stats.length === 0) break;
    offset += data.stats.length;
  }

  return stats;
};

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    const requestOrigin = request.headers.get("Origin") || "";
    const allowedOrigin = requestOrigin === env.ALLOWED_ORIGIN ? requestOrigin : "";

    if (request.method === "OPTIONS") {
      if (!allowedOrigin) return jsonResponse({ error: "Origin not allowed" }, { status: 403 });
      return withCors(new Response(null, { status: 204 }), allowedOrigin);
    }

    if (request.method !== "GET") {
      return withCors(jsonResponse({ error: "Method not allowed" }, { status: 405 }), allowedOrigin);
    }

    if (url.pathname === "/health") {
      return withCors(jsonResponse({ ok: true }), allowedOrigin);
    }

    if (url.pathname !== "/stats") {
      return withCors(jsonResponse({ error: "Not found" }, { status: 404 }), allowedOrigin);
    }

    if (!allowedOrigin) {
      return jsonResponse({ error: "Origin not allowed" }, { status: 403 });
    }

    const cacheKey = new Request("https://visitor-stats-cache.invalid/stats", { method: "GET" });
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return withCors(cached, allowedOrigin);

    try {
      const stats = await fetchLocationStats(env);
      const response = jsonResponse(normalizeLocationStats(stats), {
        headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
      });
      context.waitUntil(cache.put(cacheKey, response.clone()));
      return withCors(response, allowedOrigin);
    } catch (error) {
      console.error("Visitor statistics request failed", error.message);
      return withCors(
        jsonResponse(
          { error: "Visitor statistics are temporarily unavailable" },
          { status: 502, headers: { "Cache-Control": "no-store" } }
        ),
        allowedOrigin
      );
    }
  },
};
