import type { OrderStatus } from '@/types';
import { STATUS_LABELS, STATUS_STEPS, STATUS_META } from './constants';
import styles from '../order.module.scss';
 
export function OrderProgressTracker({ status }: { status: OrderStatus }) {
  const currentStep = STATUS_STEPS.indexOf(status);
  const meta        = STATUS_META[status];
 
  return (
    <div className={styles.progressCard}>
      <div className={styles.progressMeta}>
        <span className={styles.progressMetaIcon}>{meta.icon}</span>
        <p className={styles.progressMetaDesc}>{meta.desc}</p>
      </div>
      <div className={styles.progressTrack}>
        {STATUS_STEPS.map((step, i) => (
          <div key={step} className={styles.progressStep}>
            <div className={styles.progressStepTop}>
              <div
                className={`
                  ${styles.progressDot}
                  ${i <= currentStep ? styles.progressDotDone : ''}
                  ${i === currentStep ? styles.progressDotActive : ''}
                `}
              >
                {i < currentStep ? '✓' : i + 1}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className={`${styles.progressLine} ${i < currentStep ? styles.progressLineDone : ''}`}
                />
              )}
            </div>
            <span
              className={`${styles.progressLabel} ${i <= currentStep ? styles.progressLabelDone : ''}`}
            >
              {STATUS_LABELS[step]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}