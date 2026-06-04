import { RiskType } from '../../domain/enums';
import { useRotaSegura } from '../../use-context';
import { RISK_EMOJI, RISK_LABEL } from '../labels';
import styles from '../styles.module.css';

/** Toggle which hazard layers are shown on the map AND avoided by routing. */
export function LayerToggles() {
  const { activeTypes, toggleLayer } = useRotaSegura();

  return (
    <div className={styles.layerToggles} role="group" aria-label="Camadas de risco">
      {Object.values(RiskType).map((type) => {
        const active = activeTypes.has(type);
        return (
          <button
            key={type}
            type="button"
            className={styles.layerChip}
            data-risk={type}
            data-active={active}
            role="switch"
            aria-checked={active}
            onClick={() => toggleLayer(type)}
          >
            <span aria-hidden="true">{RISK_EMOJI[type]}</span>
            {RISK_LABEL[type]}
          </button>
        );
      })}
    </div>
  );
}
