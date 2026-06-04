/*
 * External-service configuration for the real-data adapters. All four
 * services use open APIs; only OpenRouteService needs a (free) key.
 *
 * The ORS key is NEVER hard-coded here. It is resolved at runtime from,
 * in order:
 *   1. `window.__SENTINELA_ORS_KEY__` — set by a git-ignored `env.js` in
 *      the vanilla `ship/` build (no bundler there to inline env vars).
 *   2. `process.env.ORS_API_KEY` — inlined by webpack's DefinePlugin from
 *      a git-ignored `.env` (see `.env.example`) for the React build.
 * Get a free key at https://openrouteservice.org/dev/#/signup (~2 min).
 * Without a key, routing falls back to the offline simulation.
 */

/** Resolve the ORS key from the runtime global first, then the build env. */
export function getOrsApiKey(): string {
  const runtimeKey = (globalThis as { __SENTINELA_ORS_KEY__?: string }).__SENTINELA_ORS_KEY__;
  // `process.env.ORS_API_KEY` is replaced with a string literal by webpack's
  // DefinePlugin in the browser build, and is a real lookup under jest/node.
  const buildKey = process.env.ORS_API_KEY;
  return (runtimeKey ?? buildKey ?? '').trim();
}

export function hasOrsKey(): boolean {
  return getOrsApiKey().length > 0;
}

/** Open API endpoints (key-less except ORS). */
export const ENDPOINTS = {
  nominatim: 'https://nominatim.openstreetmap.org/search',
  eonet: 'https://eonet.gsfc.nasa.gov/api/v3/events',
  /** Overpass mirrors, tried in order — the public servers rate-limit/timeout. */
  overpassMirrors: [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.openstreetmap.fr/api/interpreter',
  ],
  orsDirections: 'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
} as const;

/** Tunables shared by the adapters. */
export const SETTINGS = {
  /** Abort a request after this long so a dead API can't hang the UI. */
  requestTimeoutMs: 12_000,
  /** Radius (metres) around a region centre used to search for shelters. */
  shelterSearchRadiusM: 6_000,
  /** Max shelters considered as route destinations. */
  maxShelters: 8,
  /** Radius (km) of the avoid-polygon drawn around a point hazard. */
  hazardBufferKm: 1.2,
  /** Max EONET events fetched for the global feed. */
  globalEventLimit: 40,
} as const;
