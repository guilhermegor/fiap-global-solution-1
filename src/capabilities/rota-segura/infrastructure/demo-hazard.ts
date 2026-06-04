import type { Hazard, Region } from '../domain/entities';
import { RiskSeverity, RiskType } from '../domain/enums';

import { circlePolygon } from './geo-math';

/** Offset (degrees) east of the region centre where the demo zone sits. */
const DEMO_OFFSET_DEG = 0.022; // ~2.4 km — clear of a centre-clicked origin
const DEMO_RADIUS_KM = 1.2;

/**
 * A clearly-labelled synthetic hazard placed near a region's centre, so the
 * "safe route avoids risk" behaviour is always demonstrable — even when NASA
 * EONET has no active event in that bounding box. It is real avoid-geometry
 * fed to the router; only the data is simulated, and the title says so.
 */
export function buildDemoHazard(region: Region): Hazard {
  const center = {
    lat: region.center.lat,
    lng: region.center.lng + DEMO_OFFSET_DEG,
  };
  return {
    id: 'demo-hazard',
    type: RiskType.Flood,
    severity: RiskSeverity.High,
    title: 'Enchente (cenário de simulação)',
    date: new Date(),
    source: 'Sentinela · simulação',
    center,
    polygon: circlePolygon(center, DEMO_RADIUS_KM),
  };
}
