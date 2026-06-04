import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  useGlobalAlerts,
  useRegionData,
  useRegionSearch,
  useRescueRequests,
} from './application/use-cases';
import type { GridScenario, Region } from './domain/entities';
import { RiskType } from './domain/enums';
import type {
  GeocodingService,
  GridScenarioRepository,
  HazardService,
  RequestRepository,
  RoutingService,
  ShelterService,
} from './domain/ports';
import { buildDemoHazard } from './infrastructure/demo-hazard';
import { EonetHazardService } from './infrastructure/eonet-hazard-service';
import { InMemoryGridScenarioRepository } from './infrastructure/in-memory-scenario-repository';
import { LocalStorageRequestRepository } from './infrastructure/local-storage-request-repository';
import { NominatimGeocodingService } from './infrastructure/nominatim-geocoding-service';
import { OrsRoutingService } from './infrastructure/ors-routing-service';
import { OverpassShelterService } from './infrastructure/overpass-shelter-service';
import { toastNotifier } from './infrastructure/toast-notifier';
import { RotaSeguraContext, type RotaSeguraContextValue } from './use-context';

interface RotaSeguraProviderProps {
  children: React.ReactNode;
  /** All adapters are overridable for tests; defaults are the real ones. */
  geocodingService?: GeocodingService;
  hazardService?: HazardService;
  shelterService?: ShelterService;
  routingService?: RoutingService;
  requestRepository?: RequestRepository;
  gridScenarioRepository?: GridScenarioRepository;
}

const ALL_RISK_TYPES: readonly RiskType[] = [RiskType.Flood, RiskType.Fire, RiskType.Landslide];

export function RotaSeguraProvider({
  children,
  geocodingService,
  hazardService,
  shelterService,
  routingService,
  requestRepository,
  gridScenarioRepository,
}: RotaSeguraProviderProps) {
  const geocoder = useMemo(
    () => geocodingService ?? new NominatimGeocodingService(),
    [geocodingService],
  );
  const hazards$ = useMemo(() => hazardService ?? new EonetHazardService(), [hazardService]);
  const shelters$ = useMemo(() => shelterService ?? new OverpassShelterService(), [shelterService]);
  const routing$ = useMemo(() => routingService ?? new OrsRoutingService(), [routingService]);
  const requestRepo = useMemo(
    () => requestRepository ?? new LocalStorageRequestRepository(),
    [requestRepository],
  );
  const gridRepo = useMemo(
    () => gridScenarioRepository ?? new InMemoryGridScenarioRepository(),
    [gridScenarioRepository],
  );
  const notifier = toastNotifier;

  const {
    results: regionResults,
    search: searchRegion,
    clear: clearRegionResults,
    loading: searching,
  } = useRegionSearch(geocoder, notifier);

  const {
    hazards,
    shelters,
    load: loadRegionData,
    loading: loadingRegionData,
    error: regionDataError,
  } = useRegionData(hazards$, shelters$, notifier);

  const {
    events: globalEvents,
    load: loadGlobalAlerts,
    loading: loadingGlobal,
    error: globalError,
  } = useGlobalAlerts(hazards$, notifier);

  const [region, setRegion] = useState<Region | null>(null);
  const [activeTypes, setActiveTypes] = useState<ReadonlySet<RiskType>>(
    () => new Set(ALL_RISK_TYPES),
  );

  const toggleLayer = useCallback((type: RiskType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const [demoMode, setDemoMode] = useState(true);
  const toggleDemo = useCallback(() => setDemoMode((prev) => !prev), []);

  // Real hazards plus, when the demo scenario is on and a region is loaded, a
  // labelled synthetic zone so the avoid-route is always demonstrable.
  const effectiveHazards = useMemo(
    () => (demoMode && region ? [...hazards, buildDemoHazard(region)] : hazards),
    [demoMode, region, hazards],
  );

  const visibleHazards = useMemo(
    () => effectiveHazards.filter((h) => activeTypes.has(h.type)),
    [effectiveHazards, activeTypes],
  );

  const {
    requests,
    load: loadRequests,
    requestRescue,
    advanceStatus,
    submitting,
  } = useRescueRequests(requestRepo, routing$, notifier, visibleHazards, shelters);

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const selectRequest = useCallback((id: string | null) => setSelectedRequestId(id), []);

  const selectRegion = useCallback(
    async (next: Region) => {
      setRegion(next);
      clearRegionResults();
      await loadRegionData(next);
    },
    [loadRegionData, clearRegionResults],
  );

  // Hydrate persisted rescue requests from localStorage on boot.
  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const [gridScenario, setGridScenario] = useState<GridScenario | null>(null);
  useEffect(() => {
    void gridRepo
      .load()
      .then(setGridScenario)
      .catch(() => setGridScenario(null));
  }, [gridRepo]);

  const offline = Boolean(regionDataError ?? globalError);

  const value = useMemo<RotaSeguraContextValue>(
    () => ({
      regionResults,
      searchRegion,
      clearRegionResults,
      searching,
      region,
      selectRegion,
      hazards,
      shelters,
      visibleHazards,
      loadingRegionData,
      activeTypes,
      toggleLayer,
      demoMode,
      toggleDemo,
      requests,
      requestRescue,
      advanceStatus,
      submitting,
      selectedRequestId,
      selectRequest,
      globalEvents,
      loadGlobalAlerts,
      loadingGlobal,
      offline,
      gridScenario,
    }),
    [
      regionResults,
      searchRegion,
      clearRegionResults,
      searching,
      region,
      selectRegion,
      hazards,
      shelters,
      visibleHazards,
      loadingRegionData,
      activeTypes,
      toggleLayer,
      demoMode,
      toggleDemo,
      requests,
      requestRescue,
      advanceStatus,
      submitting,
      selectedRequestId,
      selectRequest,
      globalEvents,
      loadGlobalAlerts,
      loadingGlobal,
      offline,
      gridScenario,
    ],
  );

  return <RotaSeguraContext.Provider value={value}>{children}</RotaSeguraContext.Provider>;
}
