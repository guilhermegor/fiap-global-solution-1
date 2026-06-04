import { RequestStatus } from '../../domain/enums';
import { STATUS_FLOW, STATUS_LABEL } from '../labels';
import styles from '../styles.module.css';

interface StatusTimelineProps {
  status: RequestStatus;
}

/** Pending → EnRoute → Resolved progress, with the current step highlighted. */
export function StatusTimeline({ status }: StatusTimelineProps) {
  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <ol className={styles.timeline} aria-label="Status do chamado">
      {STATUS_FLOW.map((step, index) => {
        const state =
          index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'pending';
        return (
          <li
            key={step}
            className={styles.timelineStep}
            data-state={state}
            aria-current={state === 'active' ? 'step' : undefined}
          >
            <span className={styles.timelineDot} />
            <span>{STATUS_LABEL[step]}</span>
          </li>
        );
      })}
    </ol>
  );
}
