import { ArrowRight, MapPinned, ShieldCheck } from 'lucide-react';

import type { HelpRequestResponseDTO } from '../../domain/dto';
import { RequestStatus } from '../../domain/enums';
import { SITUATION_LABEL, STATUS_LABEL } from '../labels';
import styles from '../styles.module.css';

interface RequestCardProps {
  request: HelpRequestResponseDTO;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onAdvance?: (id: string) => void;
}

const ADVANCE_LABEL: Partial<Record<RequestStatus, string>> = {
  [RequestStatus.Pending]: 'Despachar equipe',
  [RequestStatus.EnRoute]: 'Marcar concluído',
};

export function RequestCard({ request, selected, onSelect, onAdvance }: RequestCardProps) {
  const advanceLabel = ADVANCE_LABEL[request.status];

  return (
    <article
      className={styles.requestCard}
      data-selected={selected ?? false}
      data-status={request.status}
    >
      <button type="button" className={styles.requestMain} onClick={() => onSelect?.(request.id)}>
        <header className={styles.requestHead}>
          <strong>{request.citizenName}</strong>
          <span className={styles.statusBadge} data-status={request.status}>
            {STATUS_LABEL[request.status]}
          </span>
        </header>
        <p className={styles.requestSituation}>{SITUATION_LABEL[request.situation]}</p>
        {request.route && request.shelterName ? (
          <p className={styles.requestRoute}>
            <ShieldCheck size={14} aria-hidden="true" /> {request.shelterName} ·{' '}
            {formatKm(request.route.distanceMeters)} · {formatMin(request.route.durationSeconds)}
          </p>
        ) : (
          <p className={styles.requestRoute} data-warning="true">
            <MapPinned size={14} aria-hidden="true" /> Sem rota terrestre — resgate aéreo
          </p>
        )}
      </button>
      {advanceLabel && onAdvance && (
        <button type="button" className={styles.requestAdvance} onClick={() => onAdvance(request.id)}>
          {advanceLabel} <ArrowRight size={14} aria-hidden="true" />
        </button>
      )}
    </article>
  );
}

function formatKm(meters: number): string {
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatMin(seconds: number): string {
  return `${Math.round(seconds / 60)} min`;
}
