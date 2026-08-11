// Visitor map for the about page. Reads country-level statistics from the
// Cloudflare Worker configured via data-visitor-endpoint (see
// _workers/visitor-stats.js) and colors assets/img/world-map.svg.
// Append ?visitor-demo to the URL to preview the map with sample data.

(() => {
  const section = document.querySelector("[data-visitor-section]");
  if (!section) return;

  const endpoint = (section.dataset.visitorEndpoint || "").trim();
  const trackingStart = section.dataset.trackingStart || "";
  const mapContainer = section.querySelector("[data-visitor-map]");
  const totalElement = section.querySelector("[data-visitor-total]");
  const countriesElement = section.querySelector("[data-visitor-countries]");
  const rankingElement = section.querySelector("[data-visitor-ranking]");
  const statusElement = section.querySelector("[data-visitor-status]");
  const tooltip = section.querySelector("[data-visitor-tooltip]");
  const isDemo = new URLSearchParams(window.location.search).has("visitor-demo");

  const numberFormat = new Intl.NumberFormat("en");
  const countryNames =
    typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["en"], { type: "region" }) : null;

  const getCountryName = (code) => {
    try {
      return countryNames?.of(code) || code;
    } catch (error) {
      return code;
    }
  };

  const getCountryFlag = (code) => {
    if (!/^[A-Z]{2}$/.test(code)) return "";
    return String.fromCodePoint(...[...code].map((character) => character.charCodeAt(0) + 127397));
  };

  const setStatus = (message) => {
    if (statusElement) statusElement.textContent = message;
  };

  const loadMap = async () => {
    try {
      const response = await fetch("/assets/img/world-map.svg");
      if (!response.ok) throw new Error(`Map request failed with ${response.status}`);
      const source = await response.text();
      const svg = new DOMParser().parseFromString(source, "image/svg+xml").documentElement;
      svg.setAttribute("aria-hidden", "true");
      svg.removeAttribute("role");
      mapContainer.replaceChildren(svg);
      paintCountries();
      return true;
    } catch (error) {
      mapContainer.innerHTML = '<p class="visitor-map-note">Map unavailable.</p>';
      return false;
    }
  };

  const bindTooltips = () => {
    if (!tooltip) return;
    mapContainer.querySelectorAll("[data-country]").forEach((country) => {
      const move = (event) => {
        if (!country.dataset.visits) return;
        const code = country.dataset.country;
        const visits = numberFormat.format(Number(country.dataset.visits));
        tooltip.textContent = `${getCountryFlag(code)} ${getCountryName(code)} · ${visits}`;
        const cardRect = section.getBoundingClientRect();
        tooltip.hidden = false;
        tooltip.style.left = `${event.clientX - cardRect.left + 14}px`;
        tooltip.style.top = `${event.clientY - cardRect.top - 14}px`;
      };
      country.addEventListener("pointermove", move);
      country.addEventListener("pointerleave", () => {
        tooltip.hidden = true;
      });
    });
  };

  // Fill colors are applied inline from the theme CSS variables (more robust
  // than styling SVG through attribute selectors), and re-applied whenever the
  // light/dark toggle flips data-theme on <html>.
  const themeColor = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#cccccc";

  const paintCountries = () => {
    const land = themeColor("--vmap-land");
    const ramp = [1, 2, 3, 4, 5].map((level) => themeColor(`--vmap-l${level}`));
    mapContainer.querySelectorAll("[data-country]").forEach((country) => {
      const level = Number(country.dataset.level || 0);
      country.style.fill = level >= 1 ? ramp[Math.min(level, 5) - 1] : land;
    });
  };

  new MutationObserver(paintCountries).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  const renderMap = (countries) => {
    mapContainer.querySelectorAll("[data-country]").forEach((country) => {
      country.removeAttribute("data-level");
      country.removeAttribute("data-visits");
    });
    const maxVisits = Math.max(0, ...countries.map((country) => country.visits));
    countries.forEach(({ code, visits }) => {
      const country = mapContainer.querySelector(`[data-country="${code}"]`);
      if (!country || visits <= 0) return;
      const ratio = maxVisits > 0 ? Math.log1p(visits) / Math.log1p(maxVisits) : 0;
      country.dataset.level = String(Math.max(1, Math.min(5, Math.ceil(ratio * 5))));
      country.dataset.visits = String(visits);
    });
    paintCountries();
  };

  const renderRanking = (countries) => {
    if (!rankingElement) return;
    const rows = countries.slice(0, 6).map(({ code, visits }) => {
      const item = document.createElement("li");
      item.innerHTML = `<span class="visitor-flag">${getCountryFlag(code)}</span> ${getCountryName(code)} <b>${numberFormat.format(visits)}</b>`;
      return item;
    });
    rankingElement.replaceChildren(...rows);
  };

  const getDemoData = () => ({
    total: 1287,
    countries: [
      { code: "JP", visits: 512 },
      { code: "US", visits: 236 },
      { code: "CN", visits: 198 },
      { code: "DE", visits: 84 },
      { code: "IN", visits: 66 },
      { code: "GB", visits: 48 },
      { code: "KR", visits: 39 },
      { code: "FR", visits: 30 },
      { code: "CA", visits: 24 },
      { code: "AU", visits: 16 },
      { code: "SG", visits: 12 },
      { code: "BR", visits: 8 },
      { code: "ZA", visits: 6 },
      { code: "KH", visits: 4 },
      { code: "CH", visits: 4 },
    ],
  });

  const fetchVisitorData = async () => {
    if (isDemo) return getDemoData();
    if (!endpoint) throw new Error("no-endpoint");
    const response = await fetch(`${endpoint.replace(/\/$/, "")}/stats`);
    if (!response.ok) throw new Error(`Visitor request failed with ${response.status}`);
    const data = await response.json();
    if (!data || !Array.isArray(data.countries)) throw new Error("Unexpected response shape");
    data.countries = data.countries
      .filter((entry) => entry && /^[A-Z]{2}$/.test(entry.code) && Number.isFinite(Number(entry.visits)))
      .map((entry) => ({ code: entry.code, visits: Number(entry.visits) }))
      .sort((a, b) => b.visits - a.visits);
    return data;
  };

  const sinceLabel = trackingStart
    ? ` since ${new Date(`${trackingStart}T00:00:00`).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}`
    : "";

  const init = async () => {
    const mapReady = await loadMap();
    if (!mapReady) return;
    bindTooltips();
    try {
      const data = await fetchVisitorData();
      renderMap(data.countries);
      renderRanking(data.countries);
      if (totalElement) totalElement.textContent = numberFormat.format(data.total ?? 0);
      if (countriesElement) countriesElement.textContent = numberFormat.format(data.countries.length);
      setStatus(isDemo ? "Demo data." : `Aggregate page views${sinceLabel}. No cookies, no personal data.`);
    } catch (error) {
      if (error.message === "no-endpoint") {
        setStatus("Visitor statistics are warming up.");
      } else {
        setStatus("Visitor statistics are unavailable right now.");
      }
    }
  };

  init();
})();
