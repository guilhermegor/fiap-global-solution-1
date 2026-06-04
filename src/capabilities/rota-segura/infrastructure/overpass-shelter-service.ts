import type { Region, Shelter, ShelterKind } from '../domain/entities';
import type { ShelterService } from '../domain/ports';

import { ENDPOINTS, SETTINGS } from './config';
import { fetchJson } from './http';

/** Raw Overpass element (node) shape (only the fields we use). */
interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
}
interface OverpassResponse {
  elements: OverpassElement[];
}

/** Real shelter candidates (hospitals/schools/community centres) via Overpass. */
export class OverpassShelterService implements ShelterService {
  async near(region: Region): Promise<Shelter[]> {
    const { lat, lng } = region.center;
    const r = SETTINGS.shelterSearchRadiusM;
    const query =
      '[out:json][timeout:25];(' +
      `node["amenity"="hospital"](around:${r},${lat},${lng});` +
      `node["amenity"="school"](around:${r},${lat},${lng});` +
      `node["amenity"="community_centre"](around:${r},${lat},${lng});` +
      `node["emergency"="assembly_point"](around:${r},${lat},${lng});` +
      `);out body ${SETTINGS.maxShelters * 4};`;

    const data = await fetchWithFallback(query);

    return data.elements
      .map(toShelter)
      .filter((s): s is Shelter => s !== null)
      .slice(0, SETTINGS.maxShelters);
  }
}

/** Try each Overpass mirror in order; the public servers rate-limit/time out. */
async function fetchWithFallback(query: string): Promise<OverpassResponse> {
  let lastError: unknown;
  for (const endpoint of ENDPOINTS.overpassMirrors) {
    try {
      return await fetchJson<OverpassResponse>(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Overpass indisponível.');
}

function toShelter(element: OverpassElement): Shelter | null {
  const name = element.tags?.name?.trim();
  if (!name || element.lat === undefined || element.lon === undefined) return null;
  return {
    id: `osm-${element.id}`,
    name,
    kind: kindOf(element.tags ?? {}),
    position: { lat: element.lat, lng: element.lon },
  };
}

function kindOf(tags: Record<string, string>): ShelterKind {
  if (tags.amenity === 'hospital') return 'hospital';
  if (tags.amenity === 'school') return 'school';
  if (tags.amenity === 'community_centre') return 'community';
  return 'shelter';
}
