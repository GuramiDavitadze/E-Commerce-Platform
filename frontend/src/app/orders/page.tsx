'use client';
 
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrder, useCancelOrder } from '@/hooks/useOrders';
import { useUser, useIsAdmin } from '@/store/authStore';
import type { OrderStatus } from '@/types';
import styles from './order.module.scss';
 
const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};
 
export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useUser();
  const isAdmin = useIsAdmin();
  const { data, isLoading, isError } = useOrder(id);
  const cancelOrder = useCancelOrder();
 
  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);
 
  if (!user) return null;
 
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading order…</div>
        </div>
      </div>
    );
  }
 
  if (isError || !data?.data) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Order not found</h2>
            <Link href="/orders" className={styles.backLink}>← Back to orders</Link>
          </div>
        </div>
      </div>
    );
  }
 
  const order = data.data;
  const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const canCancel = order.status === 'PENDING';
 
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href={isAdmin ? '/admin' : '/orders'} className={styles.breadcrumbLink}>
            {isAdmin ? 'Admin' : 'My Orders'}
          </Link>
          <span>/</span>
          <span>#{order.id.slice(0, 8).toUpperCase()}</span>
        </nav>
 
        <div className={styles.layout}>
          {/* Left: items */}
          <div className={styles.left}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Order items</h2>
                <span className={styles.itemCount}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
              </div>
              <div className={styles.items}>
                {order.items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.itemImage}>
                      {item.product?.image ? (
                        <img src={item.product.image} alt={item.product?.name} />
                      ) : (
                        <span>📦</span>
                      )}
                    </div>
                    <div className={styles.itemInfo}>
                      <Link href={`/products/${item.product_id}`} className={styles.itemName}>
                        {item.product?.name ?? `Product #${item.product_id.slice(0, 6)}`}
                      </Link>
                      <span className={styles.itemQty}>Quantity: {item.quantity}</span>
                      <span className={styles.itemUnit}>${item.price.toFixed(2)} each</span>
                    </div>
                    <span className={styles.itemTotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.orderTotal}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
 
          {/* Right: summary */}
          <div className={styles.right}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Order summary</h2>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Order ID</span>
                <span className={styles.summaryValue} style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Date placed</span>
                <span className={styles.summaryValue}>
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Status</span>
                <span className={`${styles.badge} ${styles[`badge${order.status}`]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              {isAdmin && order.user && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Customer</span>
                  <span className={styles.summaryValue}>{order.user.fullname}</span>
                </div>
              )}
 
              {canCancel && (
                <button
                  className={styles.cancelBtn}
                  onClick={() => {
                    cancelOrder.mutate(order.id);
                    router.push('/orders');
                  }}
                  disabled={cancelOrder.isPending}
                >
                  {cancelOrder.isPending ? 'Cancelling…' : 'Cancel order'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}