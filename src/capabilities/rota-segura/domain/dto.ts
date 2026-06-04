import type { GeoPoint, RouteResult } from './entities';
import type { RequestStatus, SituationType } from './enums';

/** Inbound: a citizen submitting the help-request form. */
export interface HelpRequestCreateDTO {
  citizenName: string;
  /** Optional ID document as typed (masked or not); sanitized by the use-case. */
  document?: string;
  situation: SituationType;
  origin: GeoPoint;
}

/**
 * Outbound: a request projected for the UI. The shelter is flattened to
 * its display name (resolved by the caller); the route is included so the
 * map can draw it.
 */
export interface HelpRequestResponseDTO {
  id: string;
  citizenName: string;
  document: string | null;
  situation: SituationType;
  origin: GeoPoint;
  status: RequestStatus;
  shelterName: string | null;
  route: RouteResult | null;
  createdAt: Date;
}
