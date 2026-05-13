'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMyOrders, useCancelOrder } from '@/hooks/useOrders';
import { useUser } from '@/store/authStore';
import type { Order, OrderStatus } from '@/types';
import styles from './orders.module.scss';

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export default function OrdersPage() {
  const router = useRouter();
  const user = useUser();
  const { data, isLoading, isError } = useMyOrders();
  const cancelOrder = useCancelOrder();

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  if (!user) return null;

  const orders = data?.data ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>My Orders</h1>
          <Link href="/products" className={styles.shopLink}>
            Continue shopping →
          </Link>
        </div>

        {isLoading && (
          <div className={styles.list}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        )}

        {isError && (
          <div className={styles.empty}>
            <p>Failed to load orders. Please try again.</p>
          </div>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📦</div>
            <h2 className={styles.emptyTitle}>No orders yet</h2>
            <p className={styles.emptyText}>
              When you place an order, it will appear here.
            </p>
            <Link href="/products" className={styles.browseBtn}>
              Browse products
            </Link>
          </div>
        )}

        {!isLoading && orders.length > 0 && (
          <div className={styles.list}>
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancel={() => cancelOrder.mutate(order.id)}
                cancelling={cancelOrder.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onCancel,
  cancelling,
}: {
  order: Order;
  onCancel: () => void;
  cancelling: boolean;
  }) {
  console.log(order);
  
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
        {(order.items ?? []).map((item) => (
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

      {/* Progress bar */}
      <OrderProgress status={order.status} />
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`${styles.badge} ${styles[`badge${status}`]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

const STEPS: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

function OrderProgress({ status }: { status: OrderStatus }) {
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
          <span className={`${styles.progressLabel} ${i <= currentStep ? styles.progressLabelActive : ''}`}>
            {STATUS_LABELS[step]}
          </span>
        </div>
      ))}
    </div>
  );
}