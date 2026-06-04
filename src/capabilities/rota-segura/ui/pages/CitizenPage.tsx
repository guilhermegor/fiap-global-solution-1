import { useEffect, useState } from 'react';

import type { GeoPoint, RouteResult } from '../../domain/entities';
import { useRotaSegura } from '../../use-context';
import { DemoToggle } from '../components/DemoToggle';
import { HelpRequestForm } from '../components/HelpRequestForm';
import { LeafletMap } from '../components/LeafletMap';
import { RegionSearch } from '../components/RegionSearch';
import { DEFAULT_CENTER, DEFAULT_ZOOM, REGION_ZOOM } from '../map-defaults';
import styles from '../styles.module.css';

export function CitizenPage() {
  const { region, visibleHazards, shelters, requestRescue, submitting } = useRotaSegura();
  const [origin, setOrigin] = useState<GeoPoint | null>(null);
  const [route, setRoute] = useState<RouteResult | null>(null);

  useEffect(() => {
    document.title = 'Sentinela — Pedir Resgate';
  }, []);

  async function handleSubmit(dto: Parameters<typeof requestRescue>[0]) {
    const result = await requestRescue(dto);
    setRoute(result?.route ?? null);
  }

  return (
    <main className={styles.citizenPage}>
      <section className={styles.citizenForm}>
        <h1 className={styles.pageTitle}>Pedir resgate</h1>
        <p className={styles.pageSubtitle}>
          Busque sua região, toque no mapa para marcar onde você está e peça ajuda. Traçamos a
          rota segura até o abrigo mais próximo.
        </p>
        <RegionSearch />
        <DemoToggle />
        <HelpRequestForm
          origin={origin}
          submitting={submitting}
          onSubmit={(dto) => void handleSubmit(dto)}
        />
      </section>

      <section className={styles.citizenMap}>
        <div className={styles.mapWrap}>
          <LeafletMap
            center={region?.center ?? DEFAULT_CENTER}
            zoom={region ? REGION_ZOOM : DEFAULT_ZOOM}
            hazards={visibleHazards}
            shelters={shelters}
            origin={origin}
            route={route}
            onMapClick={setOrigin}
          />
          {!region && (
            <div className={styles.mapOverlay}>Busque uma região para liberar o mapa.</div>
          )}
        </div>
      </section>
    </main>
  );
}
