import type { OrderStatus } from '@/types';
import { STATUS_LABELS, STEPS } from './constants';
import styles from '../orders.module.scss';
 
export function OrderProgress({ status }: { status: OrderStatus }) {
  if (status === 'CANCELLED') return null;
  const currentStep = STEPS.indexOf(status);
 
  return (
    <div className={styles.progress}>
      {STEPS.map((step, i) => (
        <div key={step} className={styles.progressStep}>
          <div
            className={`${styles.progressDot} ${i <= currentStep ? styles.progressDotActive : ''}`}
          />
          {i < STEPS.length - 1 && (
            <div
              className={`${styles.progressLine} ${i < currentStep ? styles.progressLineActive : ''}`}
            />
          )}
          <span
            className={`${styles.progressLabel} ${i <= currentStep ? styles.progressLabelActive : ''}`}
          >
            {STATUS_LABELS[step]}
          </span>
        </div>
      ))}
    </div>
  );
}