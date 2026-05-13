'use client';
 
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrder, useCancelOrder } from '@/hooks/useOrders';
import { useUser, useIsAdmin } from '@/store/authStore';
import { useHasHydrated } from '@/store/authStore';
import type { OrderStatus } from '@/types';
import styles from './order.module.scss';
 
const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING:    'Pending',
  PROCESSING: 'Processing',
  SHIPPED:    'Shipped',
  DELIVERED:  'Delivered',
  CANCELLED:  'Cancelled',
};
 
const STATUS_STEPS: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
 
const STATUS_META: Record<OrderStatus, { icon: string; desc: string }> = {
  PENDING:    { icon: '🕐', desc: 'Your order has been placed and is awaiting confirmation.' },
  PROCESSING: { icon: '📦', desc: 'We are preparing your order for shipment.' },
  SHIPPED:    { icon: '🚚', desc: 'Your order is on its way!' },
  DELIVERED:  { icon: '✅', desc: 'Your order has been delivered. Enjoy!' },
  CANCELLED:  { icon: '❌', desc: 'This order was cancelled.' },
};
 
export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useUser();
  const isAdmin = useIsAdmin();
  const hasHydrated = useHasHydrated();
  const { data, isLoading, isError } = useOrder(id);
  const cancelOrder = useCancelOrder();
 
  useEffect(() => {
    if (hasHydrated && !user) router.replace('/login');
  }, [hasHydrated, user, router]);
 
  // ── Loading ───────────────────────────────────────────────────────────────
  if (!hasHydrated || (!user && !hasHydrated)) return null;
 
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <OrderSkeleton />
        </div>
      </div>
    );
  }
 
  if (isError || !data?.data) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>🔍</span>
            <h2 className={styles.errorTitle}>Order not found</h2>
            <p className={styles.errorText}>
              We couldn't find this order. It may have been removed or you may not have access to it.
            </p>
            <Link href="/orders" className={styles.errorBtn}>
              ← Back to my orders
            </Link>
          </div>
        </div>
      </div>
    );
  }
 
  const order     = data.data;
  const items     = order.items ?? [];
  const subtotal  = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const canCancel = order.status === 'PENDING';
  const isCancelled = order.status === 'CANCELLED';
  const currentStep = STATUS_STEPS.indexOf(order.status);
  const meta = STATUS_META[order.status];
 
  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    await cancelOrder.mutateAsync(order.id);
    router.push('/orders');
  };
 
  return (
    <div className={styles.page}>
      <div className={styles.container}>
 
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href={isAdmin ? '/admin/orders' : '/orders'} className={styles.breadcrumbLink}>
            {isAdmin ? 'All orders' : 'My orders'}
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>
            #{order.id.slice(0, 8).toUpperCase()}
          </span>
        </nav>
 
        {/* Page title row */}
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.pageTitle}>
              Order <span className={styles.pageTitleId}>#{order.id.slice(0, 8).toUpperCase()}</span>
            </h1>
            <p className={styles.pageSubtitle}>
              Placed on{' '}
              {new Date(order.created_at).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
          <span className={`${styles.statusBadge} ${styles[`badge${order.status}`]}`}>
            {meta.icon} {STATUS_LABELS[order.status]}
          </span>
        </div>
 
        {/* Progress tracker (not for cancelled) */}
        {!isCancelled && (
          <div className={styles.progressCard}>
            <div className={styles.progressMeta}>
              <span className={styles.progressMetaIcon}>{meta.icon}</span>
              <p className={styles.progressMetaDesc}>{meta.desc}</p>
            </div>
            <div className={styles.progressTrack}>
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className={styles.progressStep}>
                  <div className={styles.progressStepTop}>
                    <div className={`${styles.progressDot} ${i <= currentStep ? styles.progressDotDone : ''} ${i === currentStep ? styles.progressDotActive : ''}`}>
                      {i < currentStep ? '✓' : i + 1}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`${styles.progressLine} ${i < currentStep ? styles.progressLineDone : ''}`} />
                    )}
                  </div>
                  <span className={`${styles.progressLabel} ${i <= currentStep ? styles.progressLabelDone : ''}`}>
                    {STATUS_LABELS[step]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* Cancelled banner */}
        {isCancelled && (
          <div className={styles.cancelledBanner}>
            <span>❌</span>
            <div>
              <strong>Order Cancelled</strong>
              <p>This order was cancelled. If you have questions, please contact support.</p>
            </div>
          </div>
        )}
 
        <div className={styles.layout}>
          {/* ── Left ──────────────────────────────────────────────────────── */}
          <div className={styles.left}>
 
            {/* Items */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Items ordered</h2>
                <span className={styles.cardCount}>
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </span>
              </div>
 
              {items.length === 0 ? (
                <p className={styles.noItems}>No item details available.</p>
              ) : (
                <div className={styles.itemList}>
                  {items.map((item, idx) => (
                    <div key={item.id} className={styles.item}>
                      {/* Image */}
                      <Link href={`/products/${item.product_id}`} className={styles.itemImageLink}>
                        <div className={styles.itemImage}>
                          {item.product?.image ? (
                            <img src={item.product.image} alt={item.product.name} />
                          ) : (
                            <span>📦</span>
                          )}
                        </div>
                      </Link>
 
                      {/* Info */}
                      <div className={styles.itemInfo}>
                        <Link href={`/products/${item.product_id}`} className={styles.itemName}>
                          {item.product?.name ?? `Product #${item.product_id.slice(0, 8)}`}
                        </Link>
                        {item.product?.category && (
                          <span className={styles.itemCategory}>
                            {item.product.category.content}
                          </span>
                        )}
                        <div className={styles.itemPriceLine}>
                          <span className={styles.itemUnitPrice}>
                            ${item.price.toFixed(2)} × {item.quantity}
                          </span>
                        </div>
                      </div>
 
                      {/* Line total */}
                      <div className={styles.itemRight}>
                        <span className={styles.itemTotal}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
 
              {/* Totals */}
              <div className={styles.totalsSection}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Shipping</span>
                  <span className={subtotal >= 50 ? styles.free : ''}>
                    {subtotal >= 50 ? 'Free' : '$4.99'}
                  </span>
                </div>
                <div className={styles.totalRowFinal}>
                  <span>Total</span>
                  <span>${(subtotal + (subtotal >= 50 ? 0 : 4.99)).toFixed(2)}</span>
                </div>
              </div>
            </div>
 
          </div>
 
          {/* ── Right ─────────────────────────────────────────────────────── */}
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
                    onClick={handleCancel}
                    disabled={cancelOrder.isPending}
                  >
                    {cancelOrder.isPending ? (
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
        </div>
      </div>
    </div>
  );
}
 
// ─── Skeleton ─────────────────────────────────────────────────────────────────
 
function OrderSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
      <div className={`${styles.skeletonBlock} ${styles.skeletonProgress}`} />
      <div className={styles.skeletonLayout}>
        <div className={styles.skeletonLeft}>
          <div className={`${styles.skeletonBlock} ${styles.skeletonCard}`} />
        </div>
        <div className={styles.skeletonRight}>
          <div className={`${styles.skeletonBlock} ${styles.skeletonSidebar}`} />
          <div className={`${styles.skeletonBlock} ${styles.skeletonSidebarSm}`} />
        </div>
      </div>
    </div>
  );
}