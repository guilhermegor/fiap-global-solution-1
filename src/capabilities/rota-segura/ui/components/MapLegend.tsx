import { RiskType } from '../../domain/enums';
import { RISK_LABEL } from '../labels';
import styles from '../styles.module.css';

const RISK_COLOR: Record<RiskType, string> = {
  [RiskType.Flood]: '#1E88E5',
  [RiskType.Fire]: '#FFB300',
  [RiskType.Landslide]: '#8D6E63',
};

/** Colour key for the map: risk zones, safe route, shelters, origin. */
export function MapLegend() {
  return (
    <ul className={styles.legend} aria-label="Legenda do mapa">
      {Object.values(RiskType).map((type) => (
        <li key={type} className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ backgroundColor: RISK_COLOR[type] }} />
          {RISK_LABEL[type]}
        </li>
      ))}
      <li className={styles.legendItem}>
        <span className={styles.legendSwatch} style={{ backgroundColor: '#00E5FF' }} />
        Rota segura
      </li>
      <li className={styles.legendItem}>
        <span className={styles.legendDot} style={{ backgroundColor: '#00E5FF' }} />
        Abrigo
      </li>
      <li className={styles.legendItem}>
        <span className={styles.legendDot} style={{ backgroundColor: '#FFB300' }} />
        Você
      </li>
    </ul>
  );
}
