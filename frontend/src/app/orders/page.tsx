'use client';
 
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMyOrders, useCancelOrder } from '@/hooks/useOrders';
import { useHasHydrated, useUser } from '@/store/authStore';
import { OrderCard } from './components';
import styles from './orders.module.scss';
 
export default function OrdersPage() {
  const router      = useRouter();
  const user        = useUser();
  const hasHydrated = useHasHydrated();
  const { data, isLoading, isError } = useMyOrders();
  const cancelOrder = useCancelOrder();
 
  useEffect(() => {
    if (!user && hasHydrated) router.replace('/login');
  }, [user, hasHydrated, router]);
 
  if (!hasHydrated || !user) return null;
 
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