// Cloudflare Worker: proxies GoatCounter location statistics for the visitor
// map on https://shyyhs.github.io (the _workers/ directory is not built into
// the site; this file only lives in the repo for versioning).
//
// Deploy (one-time, ~3 minutes):
//   1. https://dash.cloudflare.com → Workers & Pages → Create → Worker
//      Name it e.g. `visitor-stats`, paste this whole file, Deploy.
//   2. Worker → Settings → Variables and Secrets:
//        GC_SITE  = shyyhs                     (plain text)
//        GC_TOKEN = <GoatCounter API token>    (Secret!)
//      Token comes from https://shyyhs.goatcounter.com/user/api
//      → "New API token", permission: "Read statistics" only.
//   3. Note the worker URL (https://visitor-stats.<account>.workers.dev) and
//      put it into `visitor_stats_endpoint` in _config.yml.
//
// The worker answers GET /stats with:
//   { "total": 123, "countries": [{"code": "JP", "visits": 45}, ...],
//     "updatedAt": "2026-08-11T00:00:00Z" }
// Responses are cached for 30 minutes to stay far below GoatCounter's rate
// limits. Only country-level aggregates ever pass through here.

const ALLOWED_ORIGINS = new Set([
  "https://shyyhs.github.io",
  "http://127.0.0.1:4000",
  "http://localhost:4000",
]);

const TRACKING_START = "2026-08-11";
const CACHE_SECONDS = 1800;

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://shyyhs.github.io",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Vary": "Origin",
});

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/stats") {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    const cache = caches.default;
    const cacheKey = new Request(`${url.origin}/stats`, { method: "GET" });
    const cached = await cache.match(cacheKey);
    if (cached) {
      const response = new Response(cached.body, cached);
      Object.entries(corsHeaders(origin)).forEach(([k, v]) => response.headers.set(k, v));
      return response;
    }

    const end = new Date().toISOString().slice(0, 10);
    const apiUrl =
      `https://${env.GC_SITE}.goatcounter.com/api/v0/stats/locations` +
      `?start=${TRACKING_START}&end=${end}&limit=100`;

    const upstream = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${env.GC_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: `GoatCounter responded ${upstream.status}` }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    const payload = await upstream.json();
    const rows = Array.isArray(payload.stats) ? payload.stats : [];
    const countries = rows
      .map((row) => ({ code: String(row.id || "").toUpperCase(), visits: Number(row.count) || 0 }))
      .filter((row) => /^[A-Z]{2}$/.test(row.code) && row.visits > 0)
      .sort((a, b) => b.visits - a.visits);
    const total = countries.reduce((sum, row) => sum + row.visits, 0);

    const body = JSON.stringify({ total, countries, updatedAt: new Date().toISOString() });
    const response = new Response(body, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
        ...corsHeaders(origin),
      },
    });
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  },
};
