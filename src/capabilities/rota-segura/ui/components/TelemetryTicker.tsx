import { formatDistanceToNowStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import styles from '../styles.module.css';

interface TelemetryTickerProps {
  online: boolean;
  lastUpdate?: Date | null;
  lines?: readonly string[];
}

/** Mission-control style status strip: live indicator + scrolling data lines. */
export function TelemetryTicker({ online, lastUpdate, lines = [] }: TelemetryTickerProps) {
  const freshness = lastUpdate
    ? `há ${formatDistanceToNowStrict(lastUpdate, { locale: ptBR })}`
    : '—';

  return (
    <div className={styles.ticker} data-online={online} role="status">
      <span className={styles.tickerStatus}>
        <span className={styles.tickerDot} data-animation="telemetry" />
        {online ? 'DADOS AO VIVO' : 'MODO OFFLINE'}
      </span>
      <span className={styles.tickerSource}>
        NASA EONET · OSM · atualização {freshness}
      </span>
      {lines.length > 0 && (
        <div className={styles.tickerTrack} aria-hidden="true">
          <span>{lines.join('   ·   ')}</span>
        </div>
      )}
    </div>
  );
}
