import { useEffect } from 'react';

import { OdsBadges } from '../components/OdsBadges';
import styles from '../styles.module.css';

const SOURCES = [
  { name: 'NASA EONET', url: 'https://eonet.gsfc.nasa.gov', note: 'Eventos naturais reais (fogo, enchente, tempestade) com coordenadas.' },
  { name: 'OpenStreetMap / Nominatim', url: 'https://nominatim.org', note: 'Geocodificação de regiões e mapa base.' },
  { name: 'OSM Overpass', url: 'https://overpass-api.de', note: 'Hospitais, escolas e abrigos reais por região.' },
  { name: 'OpenRouteService', url: 'https://openrouteservice.org', note: 'Rotas em ruas reais que contornam zonas de risco.' },
  { name: 'ESA · Disaster Charter', url: 'https://disastercharter.org', note: 'Inspiração: dados de satélite para resposta a desastres.' },
];

export function AboutPage() {
  useEffect(() => {
    document.title = 'Sentinela — Sobre';
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Sobre a Sentinela</h1>
        <p className={styles.pageSubtitle}>
          A economia espacial gera dados de observação da Terra capazes de salvar vidas. A
          Sentinela conecta esses dados ao chão: detecta o risco por satélite e entrega uma rota
          segura a quem precisa.
        </p>
      </header>

      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>Como funciona, por dentro</h2>
        <p className={styles.aboutText}>
          Eventos naturais são lidos da NASA EONET e desenhados como zonas de risco no mapa.
          Abrigos reais vêm do OpenStreetMap. Quando alguém pede resgate, o OpenRouteService
          calcula um caminho em ruas reais que evita essas zonas, escolhendo o abrigo mais
          próximo alcançável. Sem internet, o sistema cai em uma simulação local para nunca
          deixar o usuário sem resposta.
        </p>
      </section>

      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>Fontes de dados</h2>
        <ul className={styles.sourceList}>
          {SOURCES.map((source) => (
            <li key={source.name} className={styles.sourceItem}>
              <a href={source.url} target="_blank" rel="noreferrer" className={styles.sourceLink}>
                {source.name}
              </a>
              <span>{source.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>Compromisso com os ODS</h2>
        <OdsBadges />
      </section>
    </main>
  );
}
