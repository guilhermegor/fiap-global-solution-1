import { Satellite } from 'lucide-react';
import { NavLink } from 'react-router';

import { useRotaSegura } from '@/capabilities/rota-segura';

import styles from './app-shell.module.css';

const LINKS = [
  { to: '/', label: 'Início', end: true },
  { to: '/alertas', label: 'Alertas globais' },
  { to: '/central', label: 'Central' },
  { to: '/cidadao', label: 'Pedir resgate' },
  { to: '/chamados', label: 'Chamados' },
  { to: '/sobre', label: 'Sobre' },
];

export function NavBar() {
  const { offline } = useRotaSegura();

  return (
    <header className={styles.nav}>
      <NavLink to="/" className={styles.brand}>
        <Satellite size={20} aria-hidden="true" />
        <span className={styles.brandName}>SENTINELA</span>
      </NavLink>

      <nav className={styles.links} aria-label="Navegação principal">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? `${styles.link} ${styles.linkActive}` : styles.link)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <span className={styles.statusPill} data-online={!offline}>
        {offline ? 'OFFLINE' : 'AO VIVO'}
      </span>
    </header>
  );
}
