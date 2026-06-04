import type { GeoPoint } from '../domain/entities';

const EARTH_RADIUS_M = 6_371_000;
const KM_PER_DEGREE_LAT = 111.32;

/** Great-circle distance between two geo points, in metres. */
export function haversineMeters(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/**
 * Approximate a circle of `radiusKm` around `center` as a closed polygon
 * ring. Used to turn a point hazard into an avoid-area for routing and a
 * drawable zone on the map. Good enough at city scale.
 */
export function circlePolygon(center: GeoPoint, radiusKm: number, segments = 16): GeoPoint[] {
  const dLat = radiusKm / KM_PER_DEGREE_LAT;
  const dLng = radiusKm / (KM_PER_DEGREE_LAT * Math.cos(toRad(center.lat)) || 1);
  const ring: GeoPoint[] = [];
  for (let i = 0; i < segments; i += 1) {
    const theta = (i / segments) * 2 * Math.PI;
    ring.push({
      lat: center.lat + dLat * Math.sin(theta),
      lng: center.lng + dLng * Math.cos(theta),
    });
  }
  ring.push({ ...ring[0] }); // close the ring
  return ring;
}

/**
 * Ray-casting point-in-polygon test. Used to drop avoid-polygons that
 * contain the route's start point — ORS cannot begin a route inside an
 * avoided area and returns a 404 if asked to.
 */
export function pointInPolygon(point: GeoPoint, polygon: readonly GeoPoint[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    const intersects =
      a.lat > point.lat !== b.lat > point.lat &&
      point.lng < ((b.lng - a.lng) * (point.lat - a.lat)) / (b.lat - a.lat) + a.lng;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** Centroid (average) of a set of points — cheap centre for a polygon. */
export function centroid(points: readonly GeoPoint[]): GeoPoint {
  const sum = points.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 },
  );
  return { lat: sum.lat / points.length, lng: sum.lng / points.length };
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
