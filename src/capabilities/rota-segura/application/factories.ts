import type { HelpRequestCreateDTO, HelpRequestResponseDTO } from '../domain/dto';
import type { HelpRequest } from '../domain/entities';
import { RequestStatus } from '../domain/enums';

/**
 * Build a fresh, unrouted rescue request from form input. The route, shelter
 * and shelter name are resolved later by the use-case (which calls the routing
 * service), so they start null and the request starts Pending. `document` is
 * expected pre-sanitized (digits only) by the caller.
 */
export function helpRequestFromCreateDTO(dto: HelpRequestCreateDTO): HelpRequest {
  return {
    id: crypto.randomUUID(),
    citizenName: dto.citizenName,
    document: dto.document ?? null,
    situation: dto.situation,
    origin: dto.origin,
    status: RequestStatus.Pending,
    shelterId: null,
    shelterName: null,
    route: null,
    createdAt: new Date(),
  };
}

/** Project a request for the UI — a straight copy of its display fields. */
export function helpRequestToResponseDTO(request: HelpRequest): HelpRequestResponseDTO {
  return {
    id: request.id,
    citizenName: request.citizenName,
    document: request.document,
    situation: request.situation,
    origin: request.origin,
    status: request.status,
    shelterName: request.shelterName,
    route: request.route,
    createdAt: request.createdAt,
  };
}
