import { Activity, Route as RouteIcon, Satellite, Siren } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router';

import { OdsBadges } from '../components/OdsBadges';
import styles from '../styles.module.css';

const STEPS = [
  {
    icon: Satellite,
    title: 'O satélite enxerga o risco',
    text: 'Dados de observação da Terra (NASA EONET) detectam enchentes, queimadas e tempestades em tempo real.',
  },
  {
    icon: Siren,
    title: 'O cidadão pede resgate',
    text: 'Quem está em perigo marca sua localização e informa a situação em segundos.',
  },
  {
    icon: RouteIcon,
    title: 'A rota segura é traçada',
    text: 'O sistema calcula um caminho real que contorna as zonas de risco até o abrigo mais próximo.',
  },
];

export function HomePage() {
  useEffect(() => {
    document.title = 'Sentinela — Vigilância Orbital · Rotas Seguras';
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.heroKicker}>
          <Activity size={16} aria-hidden="true" /> Economia espacial a serviço da vida
        </span>
        <h1 className={styles.heroTitle}>
          Do espaço ao chão: <br />
          rotas seguras quando o desastre chega.
        </h1>
        <p className={styles.heroLead}>
          A Sentinela transforma dados de satélite de observação da Terra em rotas de fuga
          reais — tirando pessoas do perigo e apoiando a defesa civil em enchentes, queimadas
          e deslizamentos.
        </p>
        <div className={styles.heroActions}>
          <Link to="/central" className={styles.primaryButton}>
            Abrir central de monitoramento
          </Link>
          <Link to="/cidadao" className={styles.secondaryButton}>
            Pedir resgate
          </Link>
        </div>
        <OdsBadges />
      </section>

      <section className={styles.steps} aria-label="Como funciona">
        <h2 className={styles.sectionTitle}>Como funciona</h2>
        <div className={styles.stepGrid}>
          {STEPS.map((step, index) => (
            <article key={step.title} className={styles.stepCard}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <step.icon size={28} aria-hidden="true" className={styles.stepIcon} />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
