import type { GridCoordinate, GridRiskZone } from '../domain/entities';
import { RiskSeverity, RiskType } from '../domain/enums';

/**
 * Cost a route pays to ENTER a cell carrying risk, by severity. Base
 * step cost is 1 (see pathfinding.ts), so these penalties make the
 * search strongly prefer going around a hazard — but still cross a
 * Moderate/High cell when that is the only way out. `Critical` is not
 * here: critical cells are impassable.
 *
 * This is the main tunable knob of the simulation. Raise a value to make
 * routes hug the hazard edges more tightly; lower it to let routes cut
 * through risk more readily.
 */
export const RISK_PENALTY: Readonly<Record<RiskSeverity, number | null>> = {
  [RiskSeverity.Moderate]: 8,
  [RiskSeverity.High]: 25,
  [RiskSeverity.Critical]: null, // impassable
};

/** Stable string key for a grid cell — used in cost maps and visited sets. */
export function cellKey(c: GridCoordinate): string {
  return `${c.col},${c.row}`;
}

/**
 * A per-cell verdict for the pathfinder: `null` means impassable
 * (critical hazard), a number is the extra cost to enter the cell.
 */
export type RiskCostMap = Map<string, number | null>;

/**
 * Fold the active risk zones into a per-cell cost map. Only zones whose
 * type is currently active are considered, so toggling a layer off lets
 * routes pass through it again. When cells overlap, an impassable verdict
 * wins; otherwise the highest penalty wins (worst hazard dominates).
 */
export function buildRiskCostMap(
  zones: readonly GridRiskZone[],
  activeTypes: ReadonlySet<RiskType>,
): RiskCostMap {
  const costMap: RiskCostMap = new Map();

  for (const zone of zones) {
    if (!activeTypes.has(zone.type)) continue;
    const penalty = RISK_PENALTY[zone.severity];

    for (const cell of zone.cells) {
      const key = cellKey(cell);
      const existing = costMap.get(key);

      // Impassable always wins; it can never be downgraded to a penalty.
      if (existing === null || penalty === null) {
        costMap.set(key, null);
        continue;
      }
      costMap.set(key, Math.max(existing ?? 0, penalty));
    }
  }

  return costMap;
}
