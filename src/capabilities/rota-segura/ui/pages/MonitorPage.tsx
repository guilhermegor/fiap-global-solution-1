import { Loader2, RadioTower } from 'lucide-react';
import { useEffect } from 'react';

import { useRotaSegura } from '../../use-context';
import { DemoToggle } from '../components/DemoToggle';
import { LayerToggles } from '../components/LayerToggles';
import { LeafletMap } from '../components/LeafletMap';
import { MapLegend } from '../components/MapLegend';
import { RegionSearch } from '../components/RegionSearch';
import { RequestCard } from '../components/RequestCard';
import { TelemetryTicker } from '../components/TelemetryTicker';
import { DEFAULT_CENTER, DEFAULT_ZOOM, REGION_ZOOM } from '../map-defaults';
import styles from '../styles.module.css';

export function MonitorPage() {
  const {
    region,
    visibleHazards,
    shelters,
    loadingRegionData,
    requests,
    advanceStatus,
    selectedRequestId,
    selectRequest,
    offline,
  } = useRotaSegura();

  useEffect(() => {
    document.title = 'Sentinela — Central de Monitoramento';
  }, []);

  const selectedRoute = requests.find((r) => r.id === selectedRequestId)?.route ?? null;

  return (
    <main className={styles.monitorPage}>
      <section className={styles.monitorMain}>
        <RegionSearch />
        <TelemetryTicker
          online={!offline}
          lastUpdate={visibleHazards[0]?.date ?? null}
          lines={[
            `Região: ${region?.name ?? 'nenhuma'}`,
            `${visibleHazards.length} hazard(s) ativos`,
            `${shelters.length} abrigo(s) reais`,
            `${requests.length} chamado(s)`,
          ]}
        />
        <div className={styles.mapWrap}>
          <LeafletMap
            center={region?.center ?? DEFAULT_CENTER}
            zoom={region ? REGION_ZOOM : DEFAULT_ZOOM}
            hazards={visibleHazards}
            shelters={shelters}
            route={selectedRoute}
          />
          {loadingRegionData && (
            <div className={styles.mapOverlay}>
              <Loader2 size={20} className={styles.spin} aria-hidden="true" /> Carregando dados
              de satélite…
            </div>
          )}
          {!region && !loadingRegionData && (
            <div className={styles.mapOverlay}>
              <RadioTower size={20} aria-hidden="true" /> Busque uma região para começar a
              monitorar.
            </div>
          )}
        </div>
        <div className={styles.toggleRow}>
          <LayerToggles />
          <DemoToggle />
        </div>
        <MapLegend />
      </section>

      <aside className={styles.monitorSide}>
        <h2 className={styles.sideTitle}>Chamados recebidos</h2>
        {requests.length === 0 ? (
          <p className={styles.empty}>Nenhum chamado ainda. Eles aparecem aqui em tempo real.</p>
        ) : (
          <ul className={styles.requestList}>
            {requests.map((request) => (
              <li key={request.id}>
                <RequestCard
                  request={request}
                  selected={request.id === selectedRequestId}
                  onSelect={selectRequest}
                  onAdvance={(id) => void advanceStatus(id)}
                />
              </li>
            ))}
          </ul>
        )}
      </aside>
    </main>
  );
}
