'use client';
 
import Link from 'next/link';
import { useAdminOrders } from '@/hooks/useOrders';
import { useAdminProducts, useAdminUsers } from '@/hooks/useAdmin';
import type { OrderStatus } from '@/types';
import styles from './page.module.scss';
 
const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING:    '#f59e0b',
  PROCESSING: '#3b82f6',
  SHIPPED:    '#8b5cf6',
  DELIVERED:  '#10b981',
  CANCELLED:  '#ef4444',
};
 
export default function AdminOverviewPage() {
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders();
  const { data: productsData, isLoading: productsLoading } = useAdminProducts();
  const { data: usersData } = useAdminUsers();
 
  const orders   = ordersData?.data ?? [];
  const products = productsData?.data.products ?? [];
  const users    = usersData?.data ?? [];
 
  const revenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);
 
  const stats = [
    { label: 'Total Revenue',  value: `$${revenue.toFixed(2)}`, icon: '💰', color: '#10b981', sub: `${orders.filter(o => o.status !== 'CANCELLED').length} paid orders`, href: '/admin/orders' },
    { label: 'Total Orders',   value: orders.length,            icon: '📦', color: '#3b82f6', sub: `${orders.filter(o => o.status === 'PENDING').length} pending`,       href: '/admin/orders' },
    { label: 'Products',       value: products.length,          icon: '🛍️', color: '#8b5cf6', sub: `${products.filter(p => p.quantity === 0).length} out of stock`,      href: '/admin/products' },
    { label: 'Customers',      value: users.length,             icon: '👥', color: '#f59e0b', sub: `${users.filter(u => u.role === 'ADMIN').length} admins`,             href: '/admin/users' },
  ];
 
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);
 
  const lowStock = products
    .filter((p) => p.quantity <= 5)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 6);
 
  const ordersByStatus = Object.entries(
    orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ) as [OrderStatus, number][];
 
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Overview</h1>
          <p className={styles.subtitle}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
 
      {/* Stat cards */}
      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.statIcon} style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
              <span className={styles.statValue}>{s.value}</span>
            </div>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statSub}>{s.sub}</p>
          </Link>
        ))}
      </div>
 
      <div className={styles.grid2}>
        {/* Recent orders */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Recent Orders</h2>
            <Link href="/admin/orders" className={styles.cardLink}>View all →</Link>
          </div>
          {ordersLoading ? (
            <div className={styles.skeletonList}>
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className={styles.skeletonRow} />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className={styles.empty}>No orders yet.</p>
          ) : (
            <div className={styles.orderList}>
              {recentOrders.map((order) => {
                const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
                return (
                  <Link key={order.id} href="/admin/orders" className={styles.orderRow}>
                    <div className={styles.orderRowLeft}>
                      <span className={styles.orderRowId}>#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className={styles.orderRowCustomer}>{order.user?.fullname ?? '—'}</span>
                    </div>
                    <div className={styles.orderRowRight}>
                      <span className={styles.orderRowTotal}>${total.toFixed(2)}</span>
                      <span className={styles.orderRowStatus} style={{ color: STATUS_COLORS[order.status], background: `${STATUS_COLORS[order.status]}15` }}>
                        {order.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
 
        <div className={styles.rightCol}>
          {/* Order status breakdown */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>Orders by Status</h2>
            </div>
            <div className={styles.statusBreakdown}>
              {ordersByStatus.map(([status, count]) => (
                <div key={status} className={styles.statusRow}>
                  <div className={styles.statusRowLeft}>
                    <span className={styles.statusDot} style={{ background: STATUS_COLORS[status] }} />
                    <span className={styles.statusRowLabel}>{status}</span>
                  </div>
                  <div className={styles.statusRowRight}>
                    <div className={styles.statusBar}>
                      <div className={styles.statusBarFill} style={{ width: `${(count / orders.length) * 100}%`, background: STATUS_COLORS[status] }} />
                    </div>
                    <span className={styles.statusRowCount}>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
 
          {/* Low stock */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>Low Stock Alert</h2>
              <Link href="/admin/products" className={styles.cardLink}>Manage →</Link>
            </div>
            {productsLoading ? (
              <div className={styles.skeletonList}>
                {Array.from({ length: 3 }).map((_, i) => <div key={i} className={styles.skeletonRow} />)}
              </div>
            ) : lowStock.length === 0 ? (
              <p className={styles.empty}>All products are well stocked ✓</p>
            ) : (
              <div className={styles.stockList}>
                {lowStock.map((p) => (
                  <div key={p.id} className={styles.stockRow}>
                    <div className={styles.stockThumb}>{p.image ? <img src={p.image} alt={p.name} /> : <span>📦</span>}</div>
                    <span className={styles.stockName}>{p.name}</span>
                    <span className={`${styles.stockQty} ${p.quantity === 0 ? styles.stockQtyOut : ''}`}>{p.quantity === 0 ? 'Out' : `${p.quantity} left`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}