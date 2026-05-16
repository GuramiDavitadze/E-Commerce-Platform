import type { OrderStatus } from '@/types';
import { STATUS_LABELS } from './constants';
import styles from '../orders.module.scss';
 
export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`${styles.badge} ${styles[`badge${status}`]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
 