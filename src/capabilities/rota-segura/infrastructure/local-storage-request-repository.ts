import type { HelpRequest } from '../domain/entities';
import type { RequestStatus } from '../domain/enums';
import type { RequestRepository } from '../domain/ports';

const STORAGE_KEY = 'sentinela.requests';

/** Wire shape in localStorage — Date is serialized as an ISO string. */
type StoredRequest = Omit<HelpRequest, 'createdAt'> & { createdAt: string };

/**
 * Persists rescue requests in `localStorage` so they survive a reload.
 * Implements the same `RequestRepository` port as the in-memory adapter,
 * so the composition root swaps one for the other with no other change.
 * Works on `file://` (the vanilla `ship/` deliverable).
 */
export class LocalStorageRequestRepository implements RequestRepository {
  async add(request: HelpRequest): Promise<HelpRequest> {
    const all = this.read();
    all.unshift(request);
    this.write(all);
    return request;
  }

  async list(): Promise<HelpRequest[]> {
    return this.read();
  }

  async updateStatus(id: string, status: RequestStatus): Promise<HelpRequest> {
    const all = this.read();
    const found = all.find((r) => r.id === id);
    if (!found) throw new Error(`Chamado não encontrado: ${id}`);
    found.status = status;
    this.write(all);
    return found;
  }

  private read(): HelpRequest[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as StoredRequest[];
      return parsed.map((r) => ({ ...r, createdAt: new Date(r.createdAt) }));
    } catch (err) {
      console.warn('[sentinela] localStorage de chamados corrompido — recomeçando vazio.', err);
      return [];
    }
  }

  private write(requests: HelpRequest[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (err) {
      // Quota exceeded or storage blocked (e.g. private mode): keep the
      // in-session list working rather than crashing the rescue flow.
      console.warn('[sentinela] não foi possível persistir os chamados.', err);
    }
  }
}
