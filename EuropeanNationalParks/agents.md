# WILDatlas Agent Notes

## Project

WILDatlas is a single-page React/Vite prototype for exploring European national parks. The main experience is a filterable Leaflet map with clickable park markers and a selected-park detail panel.

## Run and validate

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build production bundle: `npm run build`
- Run lint: `npm run lint`
- Current local URL: `http://127.0.0.1:5173/`

## Structure

- `src/App.jsx`: application state, prototype park data, filters, Leaflet map, marker popups, and detail card.
- `src/App.css`: visual system and responsive layout, including Leaflet overrides.
- `src/index.css`: document-level typography and page defaults.
- `index.html`: document metadata and Vite entry point.

## Current map implementation

- Map library: `leaflet` with `react-leaflet`.
- Basemap: OpenStreetMap tiles via `TileLayer`; keep attribution visible.
- Map center: `[54, 15]`, initial zoom `4`, minimum zoom `3`, maximum zoom `12`.
- Park locations use WGS84 decimal degrees in `latitude` and `longitude` fields. Do not use percentage positions or SVG silhouettes for geographic placement.
- `MapZoomButtons` must remain rendered inside `MapContainer`, because it uses `useMap()`.
- Marker selection updates `selectedId`; filtered markers are rendered from `visibleParks`.

## Park data contract

Each park currently has:

```js
{
  (id,
    name,
    country,
    code,
    size,
    year,
    latitude,
    longitude,
    terrain,
    status,
    war);
}
```

The existing nine records are representative prototype data only. Before presenting the catalog as complete, replace them with a verified dataset of European national parks and document the source, retrieval date, country definitions, area units, establishment-year rules, visitor status, and travel-advisory source.

## Product state

Implemented:

- Country dropdown filter.
- Exclude-countries-at-war toggle.
- Clickable markers and Leaflet popups.
- Selected park card with area, establishment year, terrain, status, and both coordinates.
- Responsive mobile layout.

Known limitations:

- The search input is visual only and is not wired to filtering yet.
- The `View park profile` button has no destination.
- The `About the data` navigation target is not implemented.
- The visible park count is the filtered prototype count, not a complete European total.
- OpenStreetMap tiles require network access in the browser.
- Map zoom text is read from the Leaflet instance and is not currently subscribed to zoom events.

## Next recommended work

1. Add a source-backed park data file or API adapter using the existing data contract.
2. Implement search across park name, country, and code.
3. Replace the binary `war` flag with a dated, source-backed travel-advisory model.
4. Add marker clustering or viewport-based loading for the full catalog.
5. Add park profile routes or external official-park links.
6. Add tests for filtering, marker selection, coordinates, and empty-result states.
7. Consider a production tile provider and usage limits before deployment.

## Editing guidance

Keep the map logic coordinate-based, preserve OpenStreetMap attribution, avoid claiming the prototype dataset is complete, and run `npm run lint` plus `npm run build` after changes to the map or data model.
