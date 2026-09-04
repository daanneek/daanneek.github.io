import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "./App.css";

const parkDataModules = import.meta.glob("./data/national_parks/*.json", {
  eager: true,
  import: "default",
});
const parks = Object.values(parkDataModules).flat();
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
const countriesAtWar = new Set(["BY", "RU", "UA"]);

const getCountryName = (code) =>
  code ? (countryNames.of(code) ?? code) : "Unknown country";
const isCountryAtWar = (park) => countriesAtWar.has(park.code);

const countries = [
  "All countries",
  ...new Set(parks.map((park) => getCountryName(park.country))),
];

const EUROPE_BOUNDS = [
  [34, -25],
  [72, 60],
];

const MAP_STYLES = {
  osm: {
    label: "OpenStreetMap",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  opentopo: {
    label: "OpenTopoMap",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://viewfinderpanoramas.org/">SRTM</a> | map style &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  },
};

function MapZoomButtons() {
  const map = useMap();

  return (
    <div className="zoom-controls">
      <button onClick={() => map.zoomIn()} aria-label="Zoom in">
        +
      </button>
      <span>{map.getZoom()}×</span>
      <button onClick={() => map.zoomOut()} aria-label="Zoom out">
        −
      </button>
    </div>
  );
}

function MapSizeFix() {
  const map = useMap();

  useEffect(() => {
    const fitMapToEurope = () => {
      map.invalidateSize();
      map.fitBounds(EUROPE_BOUNDS, {
        padding: [24, 24],
        maxZoom: 4.5,
      });
    };
    const frame = requestAnimationFrame(fitMapToEurope);
    const resizeObserver = new ResizeObserver(fitMapToEurope);
    resizeObserver.observe(map.getContainer());

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [map]);

  return null;
}

function MapStyleLayer({ mapStyle }) {
  const style = MAP_STYLES[mapStyle] ?? MAP_STYLES.osm;
  return <TileLayer attribution={style.attribution} noWrap url={style.url} />;
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [country, setCountry] = useState("All countries");
  const [excludeWar, setExcludeWar] = useState(false);
  const [selectedId, setSelectedId] = useState("triglav");
  const [mapStyle, setMapStyle] = useState("osm");

  const visibleParks = useMemo(
    () =>
      parks.filter((park) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const searchableText = [
          park.name,
          getCountryName(park.country),
          park.code,
        ]
          .join(" ")
          .toLowerCase();

        return (
          (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
          (country === "All countries" ||
            getCountryName(park.country) === country) &&
          (!excludeWar || !isCountryAtWar(park))
        );
      }),
    [country, excludeWar, searchTerm],
  );
  const selectedPark =
    visibleParks.find((park) => park.id === selectedId) ?? visibleParks[0];

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Green Atlas home">
          <span>✳</span> Green Atlas
        </a>
      </header>
      <section className="workspace">
        <aside className="sidebar">
          <div className="sidebar-heading">
            <div>
              <p className="eyebrow">DISCOVER</p>
            </div>
            <span className="result-count">
              {visibleParks.length.toString().padStart(2, "0")}
            </span>
          </div>
          <label className="search-label">
            Search places
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Try a park or country"
            />
          </label>
          <label className="select-label">
            Country
            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
            >
              {countries.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <div className="filter-block">
            <p className="filter-title">Quick filters</p>
            <button
              className={`filter-chip ${excludeWar ? "selected" : ""}`}
              onClick={() => setExcludeWar(!excludeWar)}
            >
              <span>◌</span> Exclude countries at war{" "}
              <b>{excludeWar ? "ON" : "OFF"}</b>
            </button>
          </div>
          <div className="legend">
            <p className="filter-title">Map legend</p>
            <p>
              <i className="legend-dot open" /> Open to visitors
            </p>
            <p>
              <i className="legend-dot caution" /> Check before travel
            </p>
          </div>
        </aside>
        <div className="map-column">
          <div className="map-toolbar">
            <span>
              <strong>{visibleParks.length}</strong> parks in view
            </span>
            <label className="map-style-control">
              Map style
              <select
                aria-label="Map style"
                value={mapStyle}
                onChange={(event) => setMapStyle(event.target.value)}
              >
                <option value="osm">OpenStreetMap</option>
                <option value="opentopo">OpenTopoMap</option>
              </select>
            </label>
          </div>
          <div className="map-body">
            <div className="map-stage">
              <MapContainer
                center={[54, 15]}
                zoom={4.5}
                minZoom={4.5}
                maxZoom={12}
                maxBounds={EUROPE_BOUNDS}
                maxBoundsViscosity={1}
                worldCopyJump={false}
                scrollWheelZoom
                className="leaflet-map"
              >
                <MapSizeFix />
                <MapZoomButtons />
                <MapStyleLayer mapStyle={mapStyle} />
                {visibleParks.map((park) => (
                  <CircleMarker
                    key={park.id}
                    center={[park.latitude, park.longitude]}
                    pathOptions={{
                      color:
                        selectedPark?.id === park.id
                          ? "#17231d"
                          : isCountryAtWar(park)
                            ? "#dc754b"
                            : "#2e6d52",
                      fillColor: isCountryAtWar(park) ? "#dc754b" : "#2e6d52",
                      fillOpacity: 1,
                      weight: selectedPark?.id === park.id ? 4 : 2,
                    }}
                    radius={selectedPark?.id === park.id ? 9 : 6}
                    eventHandlers={{ click: () => setSelectedId(park.id) }}
                  >
                    <Popup>
                      <strong>{park.name}</strong>
                      <br />
                      {getCountryName(park.country)}
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
            {selectedPark && (
              <article className="park-card">
                <div className="card-status">
                  <span
                    className={isCountryAtWar(selectedPark) ? "caution" : ""}
                  />{" "}
                  {isCountryAtWar(selectedPark)
                    ? "Check before travel"
                    : "Open"}
                </div>
                <h2>{selectedPark.name}</h2>
                <p className="card-location">
                  {getCountryName(selectedPark.country)} ·{" "}
                  {selectedPark.terrain || "National park"}
                </p>
                <div className="park-facts">
                  <div>
                    <span>Coordinates</span>
                    <strong>
                      {selectedPark.latitude}° N,{" "}
                      {Math.abs(selectedPark.longitude)}°{" "}
                      {selectedPark.longitude < 0 ? "W" : "E"}
                    </strong>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;

