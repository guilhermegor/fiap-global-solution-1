import type {
  GridCoordinate,
  GridRiskZone,
  GridScenario,
  GridShelter,
} from '../domain/entities';
import { RiskSeverity, RiskType } from '../domain/enums';

/*
 * Seed "operating picture" for the prototype: a stylized riverside town
 * on a 24×16 grid. The risk zones stand in for satellite-derived hazard
 * footprints (SAR flood, thermal fire, InSAR landslide); shelters are
 * safe destinations. A real adapter would fetch this from an Earth-
 * observation data service — here it is in-memory so the demo runs on
 * file:// with no backend.
 */

const GRID = { cols: 24, rows: 16 } as const;

/** Minutes since the (simulated) last satellite overpass. */
const MINUTES_SINCE_PASS = 4;
const ONE_MINUTE_MS = 60_000;

/** Every cell in an inclusive rectangle, clamped to the grid. */
function rect(col0: number, row0: number, col1: number, row1: number): GridCoordinate[] {
  const cells: GridCoordinate[] = [];
  for (let row = row0; row <= row1; row += 1) {
    for (let col = col0; col <= col1; col += 1) {
      if (col >= 0 && row >= 0 && col < GRID.cols && row < GRID.rows) {
        cells.push({ col, row });
      }
    }
  }
  return cells;
}

/*
 * A river cuts diagonally across the map. The core channel (centre cell
 * per row) and the banks (±1 column) are built separately so they can
 * carry different severities — the channel is costly to cross, the banks
 * merely discouraged. The route then bends toward the cheapest crossing.
 */
const riverChannel = (() => {
  const core: GridCoordinate[] = [];
  for (let row = 0; row < GRID.rows; row += 1) {
    core.push({ col: Math.round(5 + row * 0.9), row });
  }
  return core;
})();

const riverBanks = (() => {
  const banks: GridCoordinate[] = [];
  for (let row = 0; row < GRID.rows; row += 1) {
    const centre = Math.round(5 + row * 0.9);
    for (const col of [centre - 1, centre + 1]) {
      if (col >= 0 && col < GRID.cols) banks.push({ col, row });
    }
  }
  return banks;
})();

const ZONES: GridRiskZone[] = [
  // Flood — the river channel (high cost to cross) and its banks (mild).
  {
    id: 'flood-river',
    type: RiskType.Flood,
    severity: RiskSeverity.High,
    cells: riverChannel,
  },
  {
    id: 'flood-banks',
    type: RiskType.Flood,
    severity: RiskSeverity.Moderate,
    cells: riverBanks,
  },
  // Fire — forest blaze top-right. Inner core is impassable, smoke ring
  // is passable at high cost.
  {
    id: 'fire-core',
    type: RiskType.Fire,
    severity: RiskSeverity.Critical,
    cells: rect(18, 1, 21, 3),
  },
  {
    id: 'fire-smoke',
    type: RiskType.Fire,
    severity: RiskSeverity.High,
    cells: [...rect(17, 0, 22, 4), ...rect(16, 1, 16, 3)],
  },
  // Landslide — unstable hillside bottom-left.
  {
    id: 'landslide-scar',
    type: RiskType.Landslide,
    severity: RiskSeverity.High,
    cells: rect(1, 12, 4, 14),
  },
  {
    id: 'landslide-runout',
    type: RiskType.Landslide,
    severity: RiskSeverity.Moderate,
    cells: rect(0, 11, 6, 15),
  },
];

const SHELTERS: GridShelter[] = [
  { id: 'shelter-norte', name: 'Abrigo Norte · Escola Municipal', position: { col: 2, row: 2 }, capacity: 180 },
  { id: 'shelter-central', name: 'Abrigo Central · Ginásio', position: { col: 16, row: 9 }, capacity: 320 },
  { id: 'shelter-oeste', name: 'Abrigo Oeste · Centro Comunitário', position: { col: 1, row: 8 }, capacity: 140 },
  { id: 'shelter-sul', name: 'Abrigo Sul · Hospital de Campanha', position: { col: 21, row: 14 }, capacity: 260 },
];

/** Build a fresh Scenario (deep-cloned) anchored to the current clock. */
export function buildSeedScenario(): GridScenario {
  return {
    gridSize: { ...GRID },
    zones: ZONES.map((zone) => ({ ...zone, cells: zone.cells.map((c) => ({ ...c })) })),
    shelters: SHELTERS.map((s) => ({ ...s, position: { ...s.position } })),
    lastSatellitePassAt: new Date(Date.now() - MINUTES_SINCE_PASS * ONE_MINUTE_MS),
  };
}
