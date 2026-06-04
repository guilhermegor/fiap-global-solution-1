import type { GeoPoint, Hazard, RouteResult, Shelter } from '../domain/entities';
import type { RoutingService } from '../domain/ports';

import { ENDPOINTS, getOrsApiKey } from './config';
import { haversineMeters, pointInPolygon } from './geo-math';
import { fetchJson } from './http';

/** How many of the nearest shelters to try before giving up. */
const MAX_ROUTE_CANDIDATES = 4;
/** Cap avoid-polygons sent to ORS (nearest hazards) to keep the request small. */
const MAX_AVOID_HAZARDS = 6;

/** [lng, lat] pairs — the order GeoJSON and ORS expect. */
type LngLat = [number, number];

interface OrsFeature {
  geometry: { coordinates: LngLat[] };
  properties: { summary?: { distance: number; duration: number } };
}
interface OrsResponse {
  features: OrsFeature[];
}

/**
 * Real-roads routing via OpenRouteService that routes AROUND the active
 * hazards using `avoid_polygons`. Tries the nearest shelters in order and
 * returns the first that yields a route; null if none are routable.
 */
export class OrsRoutingService implements RoutingService {
  async safeRoute(
    origin: GeoPoint,
    shelters: readonly Shelter[],
    hazards: readonly Hazard[],
  ): Promise<RouteResult | null> {
    const apiKey = getOrsApiKey();
    if (!apiKey) {
      throw new Error('Chave do OpenRouteService ausente — configure ORS_API_KEY no .env.');
    }

    const avoid = buildAvoidPolygons(origin, hazards);
    const candidates = nearestShelters(origin, shelters, MAX_ROUTE_CANDIDATES);

    // First pass: route while avoiding the active hazards.
    for (const shelter of candidates) {
      const route = await this.routeTo(origin, shelter, avoid, apiKey).catch(() => null);
      if (route) return route;
    }

    // Fallback: if avoidance made every shelter unreachable, route without it
    // so the citizen still gets a path (avoidedHazards = 0).
    if (avoid.count > 0) {
      const noAvoid = { coordinates: [] as LngLat[][][], count: 0 };
      for (const shelter of candidates) {
        const route = await this.routeTo(origin, shelter, noAvoid, apiKey).catch(() => null);
        if (route) return route;
      }
    }
    return null;
  }

  private async routeTo(
    origin: GeoPoint,
    shelter: Shelter,
    avoid: { coordinates: LngLat[][][]; count: number },
    apiKey: string,
  ): Promise<RouteResult | null> {
    const body: Record<string, unknown> = {
      coordinates: [
        [origin.lng, origin.lat],
        [shelter.position.lng, shelter.position.lat],
      ],
    };
    if (avoid.count > 0) {
      body.options = { avoid_polygons: { type: 'MultiPolygon', coordinates: avoid.coordinates } };
    }

    const data = await fetchJson<OrsResponse>(ENDPOINTS.orsDirections, {
      method: 'POST',
      headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const feature = data.features[0];
    if (!feature) return null;

    return {
      geometry: feature.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
      distanceMeters: feature.properties.summary?.distance ?? 0,
      durationSeconds: feature.properties.summary?.duration ?? 0,
      shelterId: shelter.id,
      avoidedHazards: avoid.count,
    };
  }
}

/** Nearest N shelters to the origin by great-circle distance. */
function nearestShelters(origin: GeoPoint, shelters: readonly Shelter[], n: number): Shelter[] {
  return [...shelters]
    .sort((a, b) => haversineMeters(origin, a.position) - haversineMeters(origin, b.position))
    .slice(0, n);
}

/** Build an ORS MultiPolygon avoid area from the nearest hazards. */
function buildAvoidPolygons(
  origin: GeoPoint,
  hazards: readonly Hazard[],
): { coordinates: LngLat[][][]; count: number } {
  const nearest = [...hazards]
    // Never avoid a zone the route starts inside — ORS 404s on that.
    .filter((hazard) => !pointInPolygon(origin, hazard.polygon))
    .sort((a, b) => haversineMeters(origin, a.center) - haversineMeters(origin, b.center))
    .slice(0, MAX_AVOID_HAZARDS);

  const coordinates: LngLat[][][] = nearest.map((hazard) => [
    hazard.polygon.map((p): LngLat => [p.lng, p.lat]),
  ]);

  return { coordinates, count: nearest.length };
}
