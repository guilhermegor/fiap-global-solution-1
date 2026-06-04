import type { Region } from '../domain/entities';
import type { GeocodingService } from '../domain/ports';

import { ENDPOINTS } from './config';
import { fetchJson } from './http';

/** Raw Nominatim search result (only the fields we use). */
interface NominatimItem {
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  /** [south, north, west, east] as strings. */
  boundingbox: [string, string, string, string];
}

/** Geocoding via OpenStreetMap Nominatim (open, key-less). */
export class NominatimGeocodingService implements GeocodingService {
  async search(query: string): Promise<Region[]> {
    const url =
      `${ENDPOINTS.nominatim}?q=${encodeURIComponent(query)}` +
      '&format=jsonv2&limit=5&addressdetails=0&accept-language=pt-BR';
    const items = await fetchJson<NominatimItem[]>(url, {
      headers: { Accept: 'application/json' },
    });
    return items.map(toRegion);
  }
}

function toRegion(item: NominatimItem): Region {
  const [south, north, west, east] = item.boundingbox.map(Number) as [
    number,
    number,
    number,
    number,
  ];
  return {
    name: item.name?.trim() || item.display_name.split(',')[0].trim(),
    displayName: item.display_name,
    center: { lat: Number(item.lat), lng: Number(item.lon) },
    boundingBox: [south, north, west, east],
  };
}
