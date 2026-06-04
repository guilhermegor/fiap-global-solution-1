import type {
  GeoPoint,
  GridScenario,
  Hazard,
  HelpRequest,
  Region,
  RouteResult,
  Shelter,
} from './entities';
import type { RequestStatus } from './enums';

/* ---- Geo mainline (online, real APIs) ---- */

/** Turn a place name into geocoded regions (e.g. OpenStreetMap Nominatim). */
export interface GeocodingService {
  search(query: string): Promise<Region[]>;
}

/** Real natural-event hazards (e.g. NASA EONET). */
export interface HazardService {
  /** Hazards intersecting/near a region's bounding box. */
  near(region: Region): Promise<Hazard[]>;
  /** Most recent open events worldwide — feeds the "Alertas Globais" screen. */
  global(): Promise<Hazard[]>;
}

/** Real shelter candidates — points of interest near a region (e.g. Overpass). */
export interface ShelterService {
  near(region: Region): Promise<Shelter[]>;
}

/**
 * Real-roads routing that avoids hazard footprints (e.g. OpenRouteService
 * with avoid_polygons). Returns the safest reachable shelter route, or
 * null when no shelter can be routed to.
 */
export interface RoutingService {
  safeRoute(
    origin: GeoPoint,
    shelters: readonly Shelter[],
    hazards: readonly Hazard[],
  ): Promise<RouteResult | null>;
}

/** Persistence for citizen rescue requests (in-memory in this prototype). */
export interface RequestRepository {
  add(request: HelpRequest): Promise<HelpRequest>;
  list(): Promise<HelpRequest[]>;
  updateStatus(id: string, status: RequestStatus): Promise<HelpRequest>;
}

/* ---- Grid fallback (offline simulation) ---- */

/** Source of the schematic fallback scenario used when offline. */
export interface GridScenarioRepository {
  load(): Promise<GridScenario>;
}

/* ---- Shared ---- */

/**
 * Port for emitting transient UI messages from use-cases. Concrete
 * adapters live in `infrastructure/` (e.g. a react-toastify wrapper).
 * Use-cases accept this port as a parameter; the composition root wires
 * the implementation.
 */
export interface INotifier {
  success(message: string): void;
  error(message: string): void;
  warning(message: string): void;
  info(message: string): void;
  dismiss(): void;
}
