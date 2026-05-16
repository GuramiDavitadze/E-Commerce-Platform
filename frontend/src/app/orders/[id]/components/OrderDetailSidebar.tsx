import Link from 'next/link';
import type { Order } from '@/types';
import { STATUS_LABELS } from './constants';
import styles from '../order.module.scss';
 
interface OrderDetailSidebarProps {
  order: Order;
  isAdmin: boolean;
  canCancel: boolean;
  isCancelling: boolean;
  onCancel: () => void;
}
 
export function OrderDetailSidebar({
  order,
  isAdmin,
  canCancel,
  isCancelling,
  onCancel,
}: OrderDetailSidebarProps) {
  const items = order.order_items ?? [];
 
  return (
    <div className={styles.right}>
      {/* Order info */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Order details</h2>
        <div className={styles.detailList}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Order ID</span>
            <span className={styles.detailValueMono}>
              {order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Date placed</span>
            <span className={styles.detailValue}>
              {new Date(order.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Status</span>
            <span className={`${styles.statusBadgeSmall} ${styles[`badge${order.status}`]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Items</span>
            <span className={styles.detailValue}>{items.length}</span>
          </div>
 
          {isAdmin && order.user && (
            <>
              <div className={styles.detailDivider} />
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Customer</span>
                <span className={styles.detailValue}>{order.user.fullname}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{order.user.email}</span>
              </div>
            </>
          )}
        </div>
      </div>
 
      {/* Actions */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Actions</h2>
        <div className={styles.actionBtns}>
          <Link
            href={isAdmin ? '/admin/orders' : '/orders'}
            className={styles.actionBtnSecondary}
          >
            ← {isAdmin ? 'All orders' : 'My orders'}
          </Link>
 
          {canCancel && (
            <button
              className={styles.actionBtnDanger}
              onClick={onCancel}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <><span className={styles.spinner} /> Cancelling…</>
              ) : (
                'Cancel order'
              )}
            </button>
          )}
 
          {order.status === 'DELIVERED' && (
            <Link href="/products" className={styles.actionBtnPrimary}>
              Buy again
            </Link>
          )}
        </div>
 
        {canCancel && (
          <p className={styles.cancelNote}>
            Orders can only be cancelled while in Pending status.
          </p>
        )}
      </div>
    </div>
  );
}