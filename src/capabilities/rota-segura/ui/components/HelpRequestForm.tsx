import { LifeBuoy } from 'lucide-react';
import { useRef, useState } from 'react';

import { validateDocument } from '../../domain/document-validation';
import type { HelpRequestCreateDTO } from '../../domain/dto';
import type { GeoPoint } from '../../domain/entities';
import { SituationType } from '../../domain/enums';
import { SITUATION_LABEL } from '../labels';
import styles from '../styles.module.css';

interface HelpRequestFormProps {
  origin: GeoPoint | null;
  submitting: boolean;
  onSubmit: (dto: HelpRequestCreateDTO) => void;
}

/**
 * Citizen rescue form. The name is read once at submit (uncontrolled ref);
 * the situation is a controlled select. Origin comes from a map click and
 * is validated here before the request is dispatched.
 */
export function HelpRequestForm({ origin, submitting, onSubmit }: HelpRequestFormProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);
  const [situation, setSituation] = useState<SituationType>(SituationType.Trapped);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = nameRef.current?.value.trim() ?? '';
    if (!name) {
      setError('Informe seu nome.');
      return;
    }
    if (!origin) {
      setError('Toque no mapa para marcar onde você está.');
      return;
    }

    // Document is optional — but if filled, it must be a valid CPF/RG.
    const rawDocument = documentRef.current?.value.trim() ?? '';
    let document: string | undefined;
    if (rawDocument) {
      const result = validateDocument(rawDocument);
      if (!result.ok) {
        setError(result.reason);
        return;
      }
      document = result.digits;
    }

    setError(null);
    onSubmit({ citizenName: name, document, situation, origin });
  }

  return (
    <form className={styles.helpForm} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Seu nome</span>
        <input ref={nameRef} type="text" className={styles.input} placeholder="Como te chamam?" />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>CPF ou RG (opcional)</span>
        <input
          ref={documentRef}
          type="text"
          inputMode="numeric"
          className={styles.input}
          placeholder="Ajuda a localizar você nos cadastros"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Situação</span>
        <select
          className={styles.input}
          value={situation}
          onChange={(e) => setSituation(e.target.value as SituationType)}
        >
          {Object.values(SituationType).map((value) => (
            <option key={value} value={value}>
              {SITUATION_LABEL[value]}
            </option>
          ))}
        </select>
      </label>

      <p className={styles.originHint} data-set={Boolean(origin)}>
        {origin
          ? `Local marcado: ${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}`
          : 'Toque no mapa para marcar sua localização.'}
      </p>

      {error && (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.primaryButton} disabled={submitting}>
        <LifeBuoy size={18} aria-hidden="true" />
        {submitting ? 'Calculando rota segura…' : 'Pedir resgate'}
      </button>
    </form>
  );
}
