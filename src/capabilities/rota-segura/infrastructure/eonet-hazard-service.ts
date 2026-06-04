import type { GeoPoint, Hazard, Region } from '../domain/entities';
import { RiskSeverity, RiskType } from '../domain/enums';
import type { HazardService } from '../domain/ports';

import { ENDPOINTS, SETTINGS } from './config';
import { centroid, circlePolygon } from './geo-math';
import { fetchJson } from './http';

/** Raw NASA EONET v3 event shapes (only the fields we use). */
interface EonetCategory {
  id: string;
  title: string;
}
interface EonetGeometry {
  date: string;
  type: 'Point' | 'Polygon';
  coordinates: number[] | number[][][];
}
interface EonetEvent {
  id: string;
  title: string;
  categories: EonetCategory[];
  geometry: EonetGeometry[];
}
interface EonetResponse {
  events: EonetEvent[];
}

/** Real natural-event hazards from NASA EONET (open, key-less, CORS `*`). */
export class EonetHazardService implements HazardService {
  async near(region: Region): Promise<Hazard[]> {
    const [south, north, west, east] = region.boundingBox;
    // EONET bbox order: min-lon, max-lat, max-lon, min-lat.
    const url = `${ENDPOINTS.eonet}?status=open&bbox=${west},${north},${east},${south}`;
    const data = await fetchJson<EonetResponse>(url);
    return mapEvents(data.events);
  }

  async global(): Promise<Hazard[]> {
    const url = `${ENDPOINTS.eonet}?status=open&limit=${SETTINGS.globalEventLimit}`;
    const data = await fetchJson<EonetResponse>(url);
    return mapEvents(data.events);
  }
}

function mapEvents(events: readonly EonetEvent[]): Hazard[] {
  return events.map(toHazard).filter((h): h is Hazard => h !== null);
}

function toHazard(event: EonetEvent): Hazard | null {
  const geometry = event.geometry.at(-1);
  if (!geometry) return null;

  const categoryId = event.categories[0]?.id ?? '';
  const type = categoryToRiskType(categoryId);
  const polygonRing = geometryToPolygon(geometry);
  if (polygonRing.length === 0) return null;

  return {
    id: event.id,
    type,
    severity: severityFor(categoryId),
    title: event.categories[0]?.title
      ? `${event.title} · ${event.categories[0].title}`
      : event.title,
    date: new Date(geometry.date),
    source: 'NASA EONET',
    center: centroid(polygonRing),
    polygon: polygonRing,
  };
}

function geometryToPolygon(geometry: EonetGeometry): GeoPoint[] {
  if (geometry.type === 'Point') {
    const [lng, lat] = geometry.coordinates as number[];
    if (typeof lng !== 'number' || typeof lat !== 'number') return [];
    return circlePolygon({ lat, lng }, SETTINGS.hazardBufferKm);
  }
  // Polygon: first (outer) ring, coordinates are [lng, lat] pairs.
  const ring = (geometry.coordinates as number[][][])[0] ?? [];
  return ring.map(([lng, lat]) => ({ lat, lng }));
}

/** Map an EONET category to one of our three risk colours. */
function categoryToRiskType(categoryId: string): RiskType {
  switch (categoryId) {
    case 'wildfires':
    case 'volcanoes':
      return RiskType.Fire;
    case 'landslides':
      return RiskType.Landslide;
    case 'floods':
    case 'severeStorms':
    default:
      return RiskType.Flood;
  }
}

function severityFor(categoryId: string): RiskSeverity {
  if (categoryId === 'wildfires' || categoryId === 'volcanoes') return RiskSeverity.Critical;
  return RiskSeverity.High;
}
