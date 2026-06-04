import type { HelpRequest } from '../domain/entities';
import type { RequestStatus } from '../domain/enums';
import type { RequestRepository } from '../domain/ports';

/**
 * Holds rescue requests in memory for the lifetime of the page. Stateful
 * (it owns the store), so it is instantiated once in the composition root
 * and shared via context — never reconstructed per render.
 */
export class InMemoryRequestRepository implements RequestRepository {
  private readonly store: HelpRequest[] = [];

  async add(request: HelpRequest): Promise<HelpRequest> {
    const stored = clone(request);
    this.store.unshift(stored);
    return clone(stored);
  }

  async list(): Promise<HelpRequest[]> {
    return this.store.map(clone);
  }

  async updateStatus(id: string, status: RequestStatus): Promise<HelpRequest> {
    const found = this.store.find((r) => r.id === id);
    if (!found) throw new Error(`Chamado não encontrado: ${id}`);
    found.status = status;
    return clone(found);
  }
}

function clone(request: HelpRequest): HelpRequest {
  return {
    ...request,
    origin: { ...request.origin },
    createdAt: new Date(request.createdAt),
    route: request.route
      ? { ...request.route, geometry: request.route.geometry.map((p) => ({ ...p })) }
      : null,
  };
}
