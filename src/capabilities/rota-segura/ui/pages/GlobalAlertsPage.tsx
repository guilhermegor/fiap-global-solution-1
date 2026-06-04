import { Globe, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import type { Hazard, Region } from '../../domain/entities';
import { useRotaSegura } from '../../use-context';
import { HazardEventCard } from '../components/HazardEventCard';
import styles from '../styles.module.css';

/** Span (degrees) of the synthetic region focused when picking an event. */
const FOCUS_SPAN = 0.15;

export function GlobalAlertsPage() {
  const { globalEvents, loadGlobalAlerts, loadingGlobal, selectRegion } = useRotaSegura();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sentinela — Alertas Globais';
    if (globalEvents.length === 0) void loadGlobalAlerts();
  }, [globalEvents.length, loadGlobalAlerts]);

  function focusOnMap(hazard: Hazard) {
    const region: Region = {
      name: hazard.title.split('·')[0].trim().slice(0, 48),
      displayName: hazard.title,
      center: hazard.center,
      boundingBox: [
        hazard.center.lat - FOCUS_SPAN,
        hazard.center.lat + FOCUS_SPAN,
        hazard.center.lng - FOCUS_SPAN,
        hazard.center.lng + FOCUS_SPAN,
      ],
    };
    void selectRegion(region);
    void navigate('/central');
  }

  return (
    <main className={styles.page}>
      <header className={styles.pageHead}>
        <h1 className={styles.pageTitle}>
          <Globe size={24} aria-hidden="true" /> Alertas globais
        </h1>
        <p className={styles.pageSubtitle}>
          Eventos naturais reais detectados agora pela NASA EONET. Escolha um para focar a
          central de monitoramento naquela região.
        </p>
      </header>

      {loadingGlobal && globalEvents.length === 0 ? (
        <p className={styles.loading}>
          <Loader2 size={18} className={styles.spin} aria-hidden="true" /> Carregando eventos da
          NASA EONET…
        </p>
      ) : (
        <div className={styles.eventGrid}>
          {globalEvents.map((event) => (
            <HazardEventCard key={event.id} hazard={event} onFocus={focusOnMap} />
          ))}
          {globalEvents.length === 0 && (
            <p className={styles.empty}>
              Nenhum evento aberto retornado agora — verifique sua conexão e tente novamente.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
