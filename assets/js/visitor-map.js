import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { feature } from "https://cdn.jsdelivr.net/npm/topojson-client@3/+esm";

const WIDTH = 900;
const HEIGHT = 440;
const RANKING_LIMIT = 6;

const card = document.querySelector("[data-visitor-map]");

if (card) {
  initializeVisitorMap(card);
}

async function initializeVisitorMap(root) {
  const canvas = root.querySelector("[data-visitor-map-canvas]");
  const totalElement = root.querySelector("[data-visitor-total]");
  const rankingElement = root.querySelector("[data-visitor-ranking]");
  const endpoint = root.dataset.endpoint?.trim();

  try {
    const world = await fetchJson(root.dataset.worldUrl);
    const countries = feature(world, world.objects.countries).features;
    const countryCollection = { type: "FeatureCollection", features: countries };
    const projection = d3.geoNaturalEarth1().fitExtent([[3, 3], [WIDTH - 3, HEIGHT - 3]], countryCollection);
    projection.scale(projection.scale() * 1.15);
    const path = d3.geoPath(projection);

    const svg = d3
      .select(canvas)
      .append("svg")
      .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`)
      .attr("role", "img")
      .attr("aria-label", "World map showing visitor activity by country");

    const countryPaths = svg
      .append("g")
      .selectAll("path")
      .data(countries)
      .join("path")
      .attr("class", "visitor-map-country")
      .attr("data-country", (country) => String(country.id).padStart(3, "0"))
      .attr("d", path);

    countryPaths.append("title").text((country) => country.properties.name);
    root.dataset.state = "ready";

    if (!endpoint) return;

    const [stats, countryMetadata] = await Promise.all([
      fetchJson(endpoint),
      fetchJson(root.dataset.countryUrl),
    ]);
    const normalizedStats = normalizeStats(stats);
    const metadataByCode = new Map(
      countryMetadata
        .filter((country) => country.cca2 && country.ccn3)
        .map((country) => [
          country.cca2.toUpperCase(),
          { numericCode: country.ccn3, name: country.name.common },
        ])
    );
    const mappedCountries = normalizedStats.countries
      .map((country) => ({ ...country, ...metadataByCode.get(country.code) }))
      .filter((country) => country.numericCode);

    renderCountryData(countryPaths, mappedCountries);
    renderRanking(rankingElement, mappedCountries);
    totalElement.textContent = new Intl.NumberFormat("en").format(normalizedStats.totalVisitors);
    root.dataset.state = "loaded";
  } catch (error) {
    root.dataset.state = "error";
    totalElement.textContent = "—";
    const message = document.createElement("li");
    message.className = "visitor-map-error";
    message.textContent = "Visitor data unavailable.";
    rankingElement.replaceChildren(message);
  }
}

function renderCountryData(countryPaths, countries) {
  const visitsByNumericCode = new Map(countries.map((country) => [country.numericCode, country]));
  const maxVisitors = Math.max(0, ...countries.map((country) => country.visitors));

  countryPaths
    .attr("data-level", (featureData) => {
      const country = visitsByNumericCode.get(String(featureData.id).padStart(3, "0"));
      if (!country || maxVisitors === 0) return null;
      const ratio = Math.log1p(country.visitors) / Math.log1p(maxVisitors);
      return Math.max(1, Math.min(5, Math.ceil(ratio * 5)));
    })
    .attr("data-visitors", (featureData) => {
      const country = visitsByNumericCode.get(String(featureData.id).padStart(3, "0"));
      return country?.visitors || null;
    })
    .select("title")
    .text((featureData) => {
      const country = visitsByNumericCode.get(String(featureData.id).padStart(3, "0"));
      return country ? `${country.name}: ${country.visitors} visitors` : featureData.properties.name;
    });
}

function renderRanking(container, countries) {
  const numberFormat = new Intl.NumberFormat("en");
  const sortedCountries = [...countries]
    .sort((left, right) => right.visitors - left.visitors || left.code.localeCompare(right.code))
    .slice(0, RANKING_LIMIT);

  const rows = sortedCountries.map((country) => {
    const item = document.createElement("li");
    const identity = document.createElement("span");
    identity.className = "visitor-country-name";

    const flag = document.createElement("img");
    flag.src = `https://flagcdn.com/${country.code.toLowerCase()}.svg`;
    flag.alt = "";
    flag.loading = "lazy";
    flag.width = 20;
    flag.height = 14;

    const name = document.createElement("span");
    name.textContent = country.name;
    identity.append(flag, name);

    const value = document.createElement("strong");
    value.textContent = numberFormat.format(country.visitors);
    item.append(identity, value);
    return item;
  });

  container.replaceChildren(...rows);
}

function normalizeStats(data) {
  if (!data || !Array.isArray(data.countries)) {
    throw new Error("Invalid visitor statistics response");
  }

  const countries = data.countries
    .map((country) => ({
      code: String(country.code || "").toUpperCase(),
      visitors: Number(country.visitors),
    }))
    .filter(
      (country) =>
        /^[A-Z]{2}$/.test(country.code) && Number.isFinite(country.visitors) && country.visitors > 0
    );
  const reportedTotal = Number(data.totalVisitors);
  const totalVisitors = Number.isFinite(reportedTotal)
    ? reportedTotal
    : countries.reduce((total, country) => total + country.visitors, 0);

  return { countries, totalVisitors };
}

async function fetchJson(url) {
  if (!url) throw new Error("Missing visitor map data URL");
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Visitor map request failed with ${response.status}`);
  return response.json();
}
