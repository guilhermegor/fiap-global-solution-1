import { formatDistanceToNowStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MapPin } from 'lucide-react';

import type { Hazard } from '../../domain/entities';
import { RISK_EMOJI, RISK_LABEL } from '../labels';
import styles from '../styles.module.css';

interface HazardEventCardProps {
  hazard: Hazard;
  onFocus: (hazard: Hazard) => void;
}

/** A real NASA EONET event in the global feed, with a "focus on map" action. */
export function HazardEventCard({ hazard, onFocus }: HazardEventCardProps) {
  return (
    <article className={styles.eventCard} data-risk={hazard.type}>
      <span className={styles.eventEmoji} aria-hidden="true">
        {RISK_EMOJI[hazard.type]}
      </span>
      <div className={styles.eventBody}>
        <h3 className={styles.eventTitle}>{hazard.title}</h3>
        <p className={styles.eventMeta}>
          {RISK_LABEL[hazard.type]} · {hazard.source} · há{' '}
          {formatDistanceToNowStrict(hazard.date, { locale: ptBR })}
        </p>
      </div>
      <button type="button" className={styles.eventButton} onClick={() => onFocus(hazard)}>
        <MapPin size={16} aria-hidden="true" /> Ver no mapa
      </button>
    </article>
  );
}
