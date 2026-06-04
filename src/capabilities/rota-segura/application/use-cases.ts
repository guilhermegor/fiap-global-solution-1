import { useCallback, useState } from 'react';

import type { HelpRequestCreateDTO, HelpRequestResponseDTO } from '../domain/dto';
import type { Hazard, HelpRequest, Region, Shelter } from '../domain/entities';
import { RequestStatus } from '../domain/enums';
import type {
  GeocodingService,
  HazardService,
  INotifier,
  RequestRepository,
  RoutingService,
  ShelterService,
} from '../domain/ports';

import { helpRequestFromCreateDTO, helpRequestToResponseDTO } from './factories';

/** Geocode a place name into candidate regions. */
export function useRegionSearch(geocoder: GeocodingService, notifier: INotifier) {
  const [results, setResults] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(
    async (query: string): Promise<void> => {
      const trimmed = query.trim();
      if (trimmed.length < 3) {
        notifier.warning('Digite ao menos 3 letras para buscar uma região.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const found = await geocoder.search(trimmed);
        setResults(found);
        if (found.length === 0) notifier.info('Nenhuma região encontrada para essa busca.');
      } catch (err) {
        setError(toError(err));
        notifier.error('Falha na busca de região. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    },
    [geocoder, notifier],
  );

  const clear = useCallback(() => setResults([]), []);

  return { results, search, clear, loading, error };
}

/** Load the real hazards (EONET) and shelters (Overpass) for a region. */
export function useRegionData(
  hazardService: HazardService,
  shelterService: ShelterService,
  notifier: INotifier,
) {
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(
    async (region: Region): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const [haz, shel] = await Promise.all([
          hazardService.near(region),
          shelterService.near(region),
        ]);
        setHazards(haz);
        setShelters(shel);
        notifier.info(
          `${region.name}: ${haz.length} evento(s) e ${shel.length} abrigo(s) carregados.`,
        );
      } catch (err) {
        setError(toError(err));
        notifier.error('Falha ao carregar dados da região. Tentando modo offline.');
      } finally {
        setLoading(false);
      }
    },
    [hazardService, shelterService, notifier],
  );

  return { hazards, shelters, load, loading, error };
}

/** Live worldwide natural-event feed for the "Alertas Globais" screen. */
export function useGlobalAlerts(hazardService: HazardService, notifier: INotifier) {
  const [events, setEvents] = useState<Hazard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      setEvents(await hazardService.global());
    } catch (err) {
      setError(toError(err));
      notifier.error('Falha ao carregar alertas globais da NASA EONET.');
    } finally {
      setLoading(false);
    }
  }, [hazardService, notifier]);

  return { events, load, loading, error };
}

/**
 * Owns the rescue-request list and the two intents over it: a citizen
 * requesting rescue (which asks the routing service for a real road route
 * that avoids the active hazards) and the central advancing a request's
 * status. Hazards and shelters are passed in so the route reflects exactly
 * what the map is showing.
 */
export function useRescueRequests(
  repo: RequestRepository,
  routing: RoutingService,
  notifier: INotifier,
  hazards: readonly Hazard[],
  shelters: readonly Shelter[],
) {
  const [requests, setRequests] = useState<HelpRequestResponseDTO[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Hydrate persisted requests on boot (localStorage-backed repository).
  const load = useCallback(async (): Promise<void> => {
    try {
      const items = await repo.list();
      setRequests(items.map(helpRequestToResponseDTO));
    } catch (err) {
      setError(toError(err));
    }
  }, [repo]);

  const requestRescue = useCallback(
    async (dto: HelpRequestCreateDTO): Promise<HelpRequestResponseDTO | null> => {
      if (shelters.length === 0) {
        notifier.error('Nenhum abrigo carregado. Busque uma região primeiro.');
        return null;
      }
      setSubmitting(true);
      setError(null);
      try {
        const cleanDto: HelpRequestCreateDTO = {
          ...dto,
          document: dto.document ? sanitizeDocument(dto.document) : undefined,
        };
        const base = helpRequestFromCreateDTO(cleanDto);
        const result = await routing.safeRoute(dto.origin, shelters, hazards);

        if (!result) {
          notifier.warning('Sem rota terrestre segura — chamado registrado para resgate aéreo.');
        }

        const shelter = result ? shelters.find((s) => s.id === result.shelterId) : undefined;
        const routed: HelpRequest = {
          ...base,
          shelterId: result?.shelterId ?? null,
          shelterName: shelter?.name ?? null,
          route: result ?? null,
        };
        const saved = await repo.add(routed);
        setRequests((prev) => [helpRequestToResponseDTO(saved), ...prev]);

        if (result) notifier.success('Resgate solicitado — rota segura traçada.');
        return helpRequestToResponseDTO(saved);
      } catch (err) {
        setError(toError(err));
        notifier.error('Falha ao calcular a rota. Verifique a chave do roteamento.');
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [repo, routing, notifier, hazards, shelters],
  );

  const advanceStatus = useCallback(
    async (id: string): Promise<void> => {
      const current = requests.find((r) => r.id === id);
      if (!current || current.status === RequestStatus.Resolved) return;
      try {
        const saved = await repo.updateStatus(id, nextStatus(current.status));
        setRequests((prev) => prev.map((r) => (r.id === id ? helpRequestToResponseDTO(saved) : r)));
        if (saved.status === RequestStatus.EnRoute) notifier.info('Equipe despachada pela rota segura.');
        if (saved.status === RequestStatus.Resolved) notifier.success('Cidadão em segurança no abrigo.');
      } catch (err) {
        setError(toError(err));
        notifier.error('Falha ao atualizar o status do chamado.');
      }
    },
    [repo, notifier, requests],
  );

  return { requests, load, requestRescue, advanceStatus, submitting, error };
}

/** Strip mask characters from an ID document, keeping digits only (LGPD-min). */
function sanitizeDocument(raw: string): string {
  return raw.replace(/\D/g, '');
}

/** Pending → EnRoute → Resolved; Resolved is terminal. */
function nextStatus(status: RequestStatus): RequestStatus {
  if (status === RequestStatus.Pending) return RequestStatus.EnRoute;
  return RequestStatus.Resolved;
}

function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}
