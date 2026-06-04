import type { GridScenario } from '../domain/entities';
import type { GridScenarioRepository } from '../domain/ports';

import { buildSeedScenario } from './seed';

/**
 * Serves the schematic fallback scenario from in-memory seed data. Used
 * by the offline simulation when the live APIs are unreachable. Stateless
 * beyond the seed, so no singleton lifecycle is needed.
 */
export class InMemoryGridScenarioRepository implements GridScenarioRepository {
  async load(): Promise<GridScenario> {
    return buildSeedScenario();
  }
}
