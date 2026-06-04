import styles from '../styles.module.css';

/** The two UN SDGs the project contributes to (official colours). */
const ODS = [
  { number: 11, label: 'Cidades e comunidades sustentáveis', color: '#FD9D24' },
  { number: 13, label: 'Ação contra a mudança global do clima', color: '#3F7E44' },
] as const;

export function OdsBadges() {
  return (
    <ul className={styles.odsList} aria-label="Objetivos de Desenvolvimento Sustentável">
      {ODS.map((ods) => (
        <li key={ods.number} className={styles.odsBadge} style={{ backgroundColor: ods.color }}>
          <span className={styles.odsNumber}>ODS {ods.number}</span>
          <span className={styles.odsLabel}>{ods.label}</span>
        </li>
      ))}
    </ul>
  );
}
