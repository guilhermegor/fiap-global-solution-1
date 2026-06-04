import { Outlet } from 'react-router';

import styles from './app-shell.module.css';
import { NavBar } from './NavBar';

/** App chrome: top navigation, the routed page, and a footer. */
export function AppShell() {
  return (
    <div className={styles.shell}>
      <NavBar />
      <Outlet />
      <footer className={styles.footer}>
        <span>Sentinela · Vigilância Orbital · Rotas Seguras</span>
        <span>Dados: NASA EONET · OpenStreetMap · OpenRouteService · ODS 11 &amp; 13</span>
      </footer>
    </div>
  );
}
