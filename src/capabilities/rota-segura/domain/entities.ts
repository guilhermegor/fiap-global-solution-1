import type { RequestStatus, RiskSeverity, RiskType, SituationType } from './enums';

/* ==========================================================================
   GEO WORLD — real coordinates (online mode: Leaflet + real APIs)
   ========================================================================== */

/** A real-world coordinate (WGS84 latitude/longitude). */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/** A geocoded region the user searched for (from Nominatim). */
export interface Region {
  name: string;
  displayName: string;
  center: GeoPoint;
  /** [south, north, west, east] degrees — the region's bounding box. */
  boundingBox: [number, number, number, number];
}

/** Kind of real point-of-interest used as a shelter (from Overpass). */
export type ShelterKind = 'hospital' | 'school' | 'community' | 'shelter';

/** A real safe destination (real POI from Overpass). */
export interface Shelter {
  id: string;
  name: string;
  kind: ShelterKind;
  position: GeoPoint;
}

/**
 * A real hazard footprint (derived from a NASA EONET event). `polygon` is
 * a closed ring of geo points used both to draw the zone and to feed the
 * router's `avoid_polygons`.
 */
export interface Hazard {
  id: string;
  type: RiskType;
  severity: RiskSeverity;
  title: string;
  date: Date;
  source: string;
  center: GeoPoint;
  polygon: GeoPoint[];
}

/** A real-roads evacuation route (from OpenRouteService). */
export interface RouteResult {
  geometry: GeoPoint[];
  distanceMeters: number;
  durationSeconds: number;
  shelterId: string;
  /** How many active hazards this route was routed around. */
  avoidedHazards: number;
}

/** A citizen's request for rescue, with its resolved real route and status. */
export interface HelpRequest {
  id: string;
  citizenName: string;
  /** Optional ID document, stored unmasked (digits only); null when omitted. */
  document: string | null;
  situation: SituationType;
  origin: GeoPoint;
  status: RequestStatus;
  shelterId: string | null;
  shelterName: string | null;
  route: RouteResult | null;
  createdAt: Date;
}

/* ==========================================================================
   GRID WORLD — schematic grid (offline fallback mode: canvas + pathfinding)
   These types are used ONLY by the offline simulation and never mix with
   the geo types above.
   ========================================================================== */

/** A cell position on the fallback grid (integer column/row indices). */
export interface GridCoordinate {
  col: number;
  row: number;
}

/** Fallback grid dimensions in cells. */
export interface GridSize {
  cols: number;
  rows: number;
}

/** A contiguous risk area on the fallback grid. */
export interface GridRiskZone {
  id: string;
  type: RiskType;
  severity: RiskSeverity;
  cells: GridCoordinate[];
}

/** A safe destination on the fallback grid. */
export interface GridShelter {
  id: string;
  name: string;
  position: GridCoordinate;
  capacity: number;
}

/** A computed evacuation path on the fallback grid. */
export interface GridRoute {
  cells: GridCoordinate[];
  steps: number;
  riskCrossed: number;
}

/** The full fallback operating picture (grid + zones + shelters). */
export interface GridScenario {
  gridSize: GridSize;
  zones: GridRiskZone[];
  shelters: GridShelter[];
  lastSatellitePassAt: Date;
}
