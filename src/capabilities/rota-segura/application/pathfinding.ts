import type { GridCoordinate, GridRoute, GridShelter, GridSize } from '../domain/entities';

import { cellKey, type RiskCostMap } from './risk-grid';

/** A resolved grid route plus the shelter it leads to. */
export interface SafeRouteResult {
  shelterId: string;
  route: GridRoute;
}

const STEP_COST = 1;
const NEIGHBOUR_OFFSETS: readonly GridCoordinate[] = [
  { col: 0, row: -1 },
  { col: 0, row: 1 },
  { col: -1, row: 0 },
  { col: 1, row: 0 },
];

/**
 * Find the least-risky evacuation route from `origin` to the nearest
 * reachable shelter, using Dijkstra over a 4-connected grid. Entering a
 * cell costs 1 plus its risk penalty (from `costMap`); cells flagged
 * impassable (critical hazard) are skipped entirely. Returns `null` when
 * every shelter is cut off by critical hazards.
 *
 * Pure: no React, no I/O. Same inputs → same route.
 */
export function findSafeRoute(
  origin: GridCoordinate,
  shelters: readonly GridShelter[],
  costMap: RiskCostMap,
  gridSize: GridSize,
): SafeRouteResult | null {
  const shelterByCell = new Map(shelters.map((s) => [cellKey(s.position), s.id]));
  const dist = new Map<string, number>();
  const cameFrom = new Map<string, GridCoordinate>();
  const frontier = new MinHeap();

  const originKey = cellKey(origin);
  dist.set(originKey, 0);
  frontier.push(origin, 0);

  while (!frontier.isEmpty()) {
    const current = frontier.pop();
    const currentKey = cellKey(current);

    const shelterId = shelterByCell.get(currentKey);
    if (shelterId) {
      return { shelterId, route: reconstruct(origin, current, cameFrom, costMap) };
    }

    const currentCost = dist.get(currentKey) ?? Infinity;

    for (const offset of NEIGHBOUR_OFFSETS) {
      const next: GridCoordinate = {
        col: current.col + offset.col,
        row: current.row + offset.row,
      };
      if (!inBounds(next, gridSize)) continue;

      const nextKey = cellKey(next);
      const penalty = costMap.get(nextKey);
      if (penalty === null) continue; // impassable critical hazard

      const tentative = currentCost + STEP_COST + (penalty ?? 0);
      if (tentative < (dist.get(nextKey) ?? Infinity)) {
        dist.set(nextKey, tentative);
        cameFrom.set(nextKey, current);
        frontier.push(next, tentative);
      }
    }
  }

  return null;
}

function inBounds(c: GridCoordinate, grid: GridSize): boolean {
  return c.col >= 0 && c.row >= 0 && c.col < grid.cols && c.row < grid.rows;
}

function reconstruct(
  origin: GridCoordinate,
  target: GridCoordinate,
  cameFrom: Map<string, GridCoordinate>,
  costMap: RiskCostMap,
): GridRoute {
  const cells: GridCoordinate[] = [];
  let cursor: GridCoordinate | undefined = target;
  const originKey = cellKey(origin);

  while (cursor && cellKey(cursor) !== originKey) {
    cells.push(cursor);
    cursor = cameFrom.get(cellKey(cursor));
  }
  cells.push(origin);
  cells.reverse();

  const riskCrossed = cells.filter((c) => {
    const penalty = costMap.get(cellKey(c));
    return typeof penalty === 'number' && penalty > 0;
  }).length;

  return { cells, steps: cells.length - 1, riskCrossed };
}

/**
 * Minimal binary min-heap keyed by priority. Kept local to the
 * pathfinder — it has no other caller and needs no public surface.
 */
class MinHeap {
  private readonly items: { cell: GridCoordinate; priority: number }[] = [];

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  push(cell: GridCoordinate, priority: number): void {
    this.items.push({ cell, priority });
    this.bubbleUp(this.items.length - 1);
  }

  pop(): GridCoordinate {
    const top = this.items[0];
    const last = this.items.pop();
    if (last && this.items.length > 0) {
      this.items[0] = last;
      this.bubbleDown(0);
    }
    return top.cell;
  }

  private bubbleUp(index: number): void {
    let i = index;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.items[parent].priority <= this.items[i].priority) break;
      this.swap(parent, i);
      i = parent;
    }
  }

  private bubbleDown(index: number): void {
    let i = index;
    const n = this.items.length;
    for (;;) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.items[left].priority < this.items[smallest].priority) smallest = left;
      if (right < n && this.items[right].priority < this.items[smallest].priority) smallest = right;
      if (smallest === i) break;
      this.swap(i, smallest);
      i = smallest;
    }
  }

  private swap(a: number, b: number): void {
    [this.items[a], this.items[b]] = [this.items[b], this.items[a]];
  }
}
