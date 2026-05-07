'use client';
import { useState,Fragment } from 'react';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import type { Order, OrderStatus } from '@/types';
import styles from './orders.module.scss';

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_STYLES: Record<OrderStatus, { color: string; bg: string }> = {
  PENDING:    { color: '#b45309', bg: 'rgba(245,158,11,0.12)' },
  PROCESSING: { color: '#1d4ed8', bg: 'rgba(59,130,246,0.12)' },
  SHIPPED:    { color: '#6d28d9', bg: 'rgba(139,92,246,0.12)' },
  DELIVERED:  { color: '#065f46', bg: 'rgba(16,185,129,0.12)' },
  CANCELLED:  { color: '#b91c1c', bg: 'rgba(239,68,68,0.1)'  },
};

export default function AdminOrdersPage() {
  const { data, isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();

  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const orders = data?.data ?? [];

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter ? o.status === statusFilter : true;
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const statusCounts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<OrderStatus, number>);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Orders</h1>
          <p className={styles.subtitle}>{orders.length} total orders</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className={styles.statusTabs}>
        <button
          className={`${styles.statusTab} ${!statusFilter ? styles.statusTabActive : ''}`}
          onClick={() => setStatusFilter('')}
        >
          All <span className={styles.statusTabCount}>{orders.length}</span>
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            className={`${styles.statusTab} ${statusFilter === s ? styles.statusTabActive : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
            <span className={styles.statusTabCount}>{statusCounts[s]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          placeholder="Search by order ID, customer name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Orders table */}
      <div className={styles.tableWrap}>
        {isLoading ? (
          <div className={styles.skeletonList}>
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className={styles.skeletonRow} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>No orders found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order,index) => {
                const total = (order.items ?? []).reduce((s, i) => s + i.price * i.quantity, 0);
                const isOpen = expanded === order.id;
                return (
                  <Fragment key={index}>
                    <tr key={order.id} className={isOpen ? styles.rowExpanded : ''}>
                      <td>
                        <span className={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</span>
                      </td>
                      <td>
                        <div className={styles.customerCell}>
                          <div className={styles.customerAvatar}>{order.user?.fullname?.charAt(0) ?? '?'}</div>
                          <div>
                            <p className={styles.customerName}>{order.user?.fullname ?? '—'}</p>
                            <p className={styles.customerEmail}>{order.user?.email ?? ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className={styles.cellCenter}>{order.items?.length}</td>
                      <td><strong>${total.toFixed(2)}</strong></td>
                      <td className={styles.cellMuted}>
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          style={{ color: STATUS_STYLES[order.status].color, background: STATUS_STYLES[order.status].bg }}
                          value={order.status}
                          onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value as OrderStatus })}
                        >
                          {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td>
                        <button
                          className={styles.expandBtn}
                          onClick={() => setExpanded(isOpen ? null : order.id)}
                        >
                          {isOpen ? '▲' : '▼'}
                        </button>
                      </td>
                    </tr>
                    {isOpen && <OrderItems key={`items-${order.id}`} order={order} />}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function OrderItems({ order }: { order: Order }) {
  return (
    <tr className={styles.itemsRow}>
      <td colSpan={7}>
        <div className={styles.itemsPanel}>
          <p className={styles.itemsPanelTitle}>Order items</p>
          <div className={styles.itemsGrid}>
            {order.items.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.itemThumb}>
                  {item.product?.image ? <img src={item.product.image} alt="" /> : <span>📦</span>}
                </div>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.product?.name ?? `Product #${item.product_id.slice(0, 6)}`}</span>
                  <span className={styles.itemMeta}>Qty: {item.quantity} · ${item.price.toFixed(2)} each</span>
                </div>
                <span className={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </td>
    </tr>
  );
}