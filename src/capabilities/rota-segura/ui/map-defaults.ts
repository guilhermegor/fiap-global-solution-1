import type { GeoPoint } from '../domain/entities';

/** Fallback map view when no region is selected yet (centred on Brazil). */
export const DEFAULT_CENTER: GeoPoint = { lat: -14.235, lng: -51.925 };
export const DEFAULT_ZOOM = 4;
export const REGION_ZOOM = 12;
