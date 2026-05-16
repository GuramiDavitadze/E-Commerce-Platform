import Link from 'next/link';
import type { Order } from '@/types';
import { StatusBadge } from './StatusBadge';
import { OrderProgress } from './OrderProgress';
import styles from '../orders.module.scss';
 
export function OrderCard({
  order,
  onCancel,
  cancelling,
}: {
  order: Order;
  onCancel: () => void;
  cancelling: boolean;
}) {
  const total = (order.order_items ?? []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const canCancel = order.status === 'PENDING';
 
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <span className={styles.orderId}>
            Order #{order.id.slice(0, 8).toUpperCase()}
          </span>
          <span className={styles.orderDate}>
            {new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <div className={styles.cardHeaderRight}>
          <StatusBadge status={order.status} />
          <span className={styles.orderTotal}>${total.toFixed(2)}</span>
        </div>
      </div>
 
      {/* Items */}
      <div className={styles.items}>
        {(order.order_items ?? []).map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.itemImage}>
              {item.product?.image ? (
                <img src={item.product.image} alt={item.product?.name ?? ''} />
              ) : (
                <span>📦</span>
              )}
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>
                {item.product?.name ?? `Product #${item.product_id.slice(0, 6)}`}
              </span>
              <span className={styles.itemQty}>Qty: {item.quantity}</span>
            </div>
            <span className={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
 
      {/* Footer */}
      <div className={styles.cardFooter}>
        <Link href={`/orders/${order.id}`} className={styles.detailLink}>
          View details
        </Link>
        {canCancel && (
          <button
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling…' : 'Cancel order'}
          </button>
        )}
      </div>
 
      <OrderProgress status={order.status} />
    </div>
  );
}