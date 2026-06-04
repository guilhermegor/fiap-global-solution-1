import { createContext, useContext } from 'react';

import type { HelpRequestCreateDTO, HelpRequestResponseDTO } from './domain/dto';
import type { GridScenario, Hazard, Region, Shelter } from './domain/entities';
import type { RiskType } from './domain/enums';

export interface RotaSeguraContextValue {
  /* --- Region search (Nominatim) --- */
  regionResults: Region[];
  searchRegion: (query: string) => Promise<void>;
  clearRegionResults: () => void;
  searching: boolean;

  /* --- Selected region + its real data (EONET + Overpass) --- */
  region: Region | null;
  selectRegion: (region: Region) => Promise<void>;
  hazards: Hazard[];
  shelters: Shelter[];
  /** Hazards filtered by the active layers — what the map/router use. */
  visibleHazards: Hazard[];
  loadingRegionData: boolean;

  /* --- Active risk layers --- */
  activeTypes: ReadonlySet<RiskType>;
  toggleLayer: (type: RiskType) => void;

  /** Demo scenario: inject a labelled synthetic hazard so routing always bends. */
  demoMode: boolean;
  toggleDemo: () => void;

  /* --- Rescue requests --- */
  requests: HelpRequestResponseDTO[];
  requestRescue: (dto: HelpRequestCreateDTO) => Promise<HelpRequestResponseDTO | null>;
  advanceStatus: (id: string) => Promise<void>;
  submitting: boolean;
  selectedRequestId: string | null;
  selectRequest: (id: string | null) => void;

  /* --- Global alerts feed (NASA EONET worldwide) --- */
  globalEvents: Hazard[];
  loadGlobalAlerts: () => Promise<void>;
  loadingGlobal: boolean;

  /* --- Offline fallback --- */
  offline: boolean;
  gridScenario: GridScenario | null;
}

export const RotaSeguraContext = createContext<RotaSeguraContextValue | null>(null);

export function useRotaSegura(): RotaSeguraContextValue {
  const ctx = useContext(RotaSeguraContext);
  if (!ctx) throw new Error('useRotaSegura must be used within RotaSeguraProvider');
  return ctx;
}
