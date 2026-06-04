import { RequestStatus, RiskType, SituationType } from '../domain/enums';

/** Portuguese display labels for the domain enums (UI-local vocabulary). */

export const RISK_LABEL: Record<RiskType, string> = {
  [RiskType.Flood]: 'Enchente',
  [RiskType.Fire]: 'Fogo / Queimada',
  [RiskType.Landslide]: 'Deslizamento',
};

export const RISK_EMOJI: Record<RiskType, string> = {
  [RiskType.Flood]: '🌊',
  [RiskType.Fire]: '🔥',
  [RiskType.Landslide]: '⛰️',
};

export const SITUATION_LABEL: Record<SituationType, string> = {
  [SituationType.Trapped]: 'Ilhado / preso',
  [SituationType.Medical]: 'Emergência médica',
  [SituationType.Evacuate]: 'Preciso evacuar',
  [SituationType.Stranded]: 'Sem transporte',
};

export const STATUS_LABEL: Record<RequestStatus, string> = {
  [RequestStatus.Pending]: 'Pendente',
  [RequestStatus.EnRoute]: 'Em rota',
  [RequestStatus.Resolved]: 'Concluído',
};

/** Ordered status flow for the timeline component. */
export const STATUS_FLOW: readonly RequestStatus[] = [
  RequestStatus.Pending,
  RequestStatus.EnRoute,
  RequestStatus.Resolved,
];
