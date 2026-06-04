import { useEffect } from 'react';

import { useRotaSegura } from '../../use-context';
import { RequestCard } from '../components/RequestCard';
import { StatusTimeline } from '../components/StatusTimeline';
import { SITUATION_LABEL } from '../labels';
import styles from '../styles.module.css';

export function RequestsPage() {
  const { requests, advanceStatus, selectedRequestId, selectRequest } = useRotaSegura();

  useEffect(() => {
    document.title = 'Sentinela — Chamados';
  }, []);

  const selected = requests.find((r) => r.id === selectedRequestId) ?? requests[0] ?? null;

  return (
    <main className={styles.page}>
      <header className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Chamados &amp; status</h1>
        <p className={styles.pageSubtitle}>
          Acompanhe cada pedido de resgate da abertura à conclusão.
        </p>
      </header>

      {requests.length === 0 ? (
        <p className={styles.empty}>
          Nenhum chamado ainda. Crie um em <strong>Pedir resgate</strong>.
        </p>
      ) : (
        <div className={styles.requestsLayout}>
          <ul className={styles.requestList}>
            {requests.map((request) => (
              <li key={request.id}>
                <RequestCard
                  request={request}
                  selected={request.id === selected?.id}
                  onSelect={selectRequest}
                  onAdvance={(id) => void advanceStatus(id)}
                />
              </li>
            ))}
          </ul>

          {selected && (
            <aside className={styles.requestDetail}>
              <h2 className={styles.sideTitle}>{selected.citizenName}</h2>
              <p className={styles.detailLine}>{SITUATION_LABEL[selected.situation]}</p>
              {selected.document && (
                <p className={styles.detailLine}>Documento: {formatDocument(selected.document)}</p>
              )}
              {selected.shelterName && (
                <p className={styles.detailLine}>Destino: {selected.shelterName}</p>
              )}
              {selected.route && (
                <p className={styles.detailLine}>
                  {(selected.route.distanceMeters / 1000).toFixed(1)} km ·{' '}
                  {Math.round(selected.route.durationSeconds / 60)} min ·{' '}
                  {selected.route.avoidedHazards} zona(s) evitada(s)
                </p>
              )}
              <StatusTimeline status={selected.status} />
            </aside>
          )}
        </div>
      )}
    </main>
  );
}

/** Display an unmasked stored document with light CPF/RG punctuation. */
function formatDocument(digits: string): string {
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (digits.length === 9) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
  }
  return digits;
}
