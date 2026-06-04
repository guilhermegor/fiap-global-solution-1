import { FlaskConical } from 'lucide-react';

import { useRotaSegura } from '../../use-context';
import styles from '../styles.module.css';

/**
 * Toggle the demo scenario — a labelled synthetic flood zone over the
 * searched region so the avoid-route is always demonstrable, even when NASA
 * EONET has no live event in that area.
 */
export function DemoToggle() {
  const { demoMode, toggleDemo } = useRotaSegura();

  return (
    <button
      type="button"
      className={styles.demoToggle}
      role="switch"
      aria-checked={demoMode}
      data-active={demoMode}
      onClick={toggleDemo}
    >
      <FlaskConical size={16} aria-hidden="true" />
      Cenário de simulação
    </button>
  );
}
