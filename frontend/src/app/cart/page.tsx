'use client';
 
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useIsAuthenticated, useUser } from '@/store/authStore';
import { useCreateOrder } from '@/hooks/useOrders';
import type { CartItem } from '@/types';
import styles from './cart.module.scss';
 
export default function CartPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCartStore();
  const createOrder = useCreateOrder();
 
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState('');
 
  const subtotal   = totalPrice();
  const shipping   = subtotal >= 50 ? 0 : 4.99;
  const total      = subtotal + shipping;
  const itemCount  = totalItems();
 

  // ─── Checkout ──────────────────────────────────────────────────────────────
 
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }
    setOrderError('');
    setPlacing(true);
    try {
      const res = await createOrder.mutateAsync({
        products: items.map((i) => ({
          product_id: i.product.id,
            quantity: i.quantity,
          price:i.product.price
        })),
      });
      clearCart();
      router.push(`/orders/${res.data.id}`);
    } catch (err: any) {
      setOrderError(err?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };
 
  // ─── Empty state ───────────────────────────────────────────────────────────
 
  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <div className={styles.emptyBag}>
              <span className={styles.emptyBagIcon}>🛒</span>
            </div>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyText}>
              Looks like you haven't added anything yet.
            </p>
            <Link href="/products" className={styles.browseBtn}>
              Browse products
            </Link>
            {isAuthenticated && (
              <Link href="/orders" className={styles.ordersLink}>
                View past orders →
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Shopping Cart</h1>
            <p className={styles.pageSubtitle}>
              {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <button className={styles.clearBtn} onClick={clearCart}>
            Clear cart
          </button>
        </div>
 
        <div className={styles.layout}>
          {/* ── Left: items ─────────────────────────────────────────────── */}
          <div className={styles.left}>
 
     
 
            {/* Item list */}
            <div className={styles.itemsList}>
              <div className={styles.itemsHeader}>
                <span>Product</span>
                <span className={styles.itemsHeaderRight}>
                  <span>Qty</span>
                  <span>Total</span>
                </span>
              </div>
 
              {items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onQtyChange={(qty) => updateQuantity(item.product.id, qty)}
                  onRemove={() => removeItem(item.product.id)}
                />
              ))}
            </div>
 
          </div>
 
          <div className={styles.right}>
            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Order summary</h2>
 
              <div className={styles.summaryLines}>
                {items.map((item) => (
                  <div key={item.product.id} className={styles.summaryLine}>
                    <div className={styles.summaryLineLeft}>
                      <span className={styles.summaryLineQty}>{item.quantity}×</span>
                      <span className={styles.summaryLineName}>{item.product.name}</span>
                    </div>
                    <span className={styles.summaryLinePrice}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
 
              <div className={styles.summaryDivider} />
 
              <div className={styles.summaryCalc}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
           
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  
                    <span>${shipping.toFixed(2)}</span>
                </div>
              </div>
 
              <div className={styles.summaryDivider} />
 
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
 
              {/* Error */}
              {orderError && (
                <div className={styles.orderError}>{orderError}</div>
              )}
 
              {/* Checkout button */}
              <button
                className={styles.checkoutBtn}
                onClick={handleCheckout}
                disabled={placing}
              >
                {placing ? (
                  <><span className={styles.spinner} />Placing order…</>
                ) : isAuthenticated ? (
                  <>Place order · ${total.toFixed(2)}</>
                ) : (
                  'Sign in to checkout'
                )}
              </button>
 
              {!isAuthenticated && (
                <p className={styles.authNote}>
                  <Link href="/login?redirect=/cart">Sign in</Link> or{' '}
                  <Link href="/register">create an account</Link> to complete your order.
                </p>
              )}
 
              {isAuthenticated && (
                <p className={styles.accountNote}>
                  Ordering as <strong>{user?.fullname}</strong>
                </p>
              )}
 
              <Link href="/products" className={styles.continueLink}>
                ← Continue shopping
              </Link>
 
              {/* Trust badges */}
              <div className={styles.trustBadges}>
                <div className={styles.trustBadge}>
                  <span>🔒</span> Secure checkout
                </div>
                <div className={styles.trustBadge}>
                  <span>↩️</span> 30-day returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
// ─── Cart Item Row ────────────────────────────────────────────────────────────
 
function CartItemRow({
  item,
  onQtyChange,
  onRemove,
}: {
  item: CartItem;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}) {
  const lineTotal = item.product.price * item.quantity;
  const isLowStock = item.product.quantity <= 5 && item.product.quantity > 0;
 
  return (
    <div className={styles.item}>
      {/* Image */}
      <Link href={`/products/${item.product.id}`} className={styles.itemImageLink}>
        <div className={styles.itemImage}>
          {item.product.image ? (
            <img src={item.product.image} alt={item.product.name} loading="lazy" />
          ) : (
            <span className={styles.itemImagePlaceholder}>📦</span>
          )}
        </div>
      </Link>
 
      {/* Details */}
      <div className={styles.itemDetails}>
        <Link href={`/products/${item.product.id}`} className={styles.itemName}>
          {item.product.name}
        </Link>
        {item.product.category && (
          <span className={styles.itemCategory}>{item.product.category.content}</span>
        )}
        <span className={styles.itemUnitPrice}>
          ${Number(item.product.price).toFixed(2)} each
        </span>
        {isLowStock && (
          <span className={styles.itemLowStock}>
            Only {item.product.quantity} left!
          </span>
        )}
        {/* Mobile remove */}
        <button className={styles.itemRemoveMobile} onClick={onRemove}>
          Remove
        </button>
      </div>
 
      {/* Qty control */}
      <div className={styles.itemQtyControl}>
        <button
          className={styles.qtyBtn}
          onClick={() => onQtyChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className={styles.qtyValue}>{item.quantity}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => onQtyChange(item.quantity + 1)}
          disabled={item.quantity >= item.product.quantity}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
 
      {/* Total + remove */}
      <div className={styles.itemRight}>
        <span className={styles.itemTotal}>${lineTotal.toFixed(2)}</span>
        <button className={styles.removeBtn} onClick={onRemove} title="Remove item" aria-label="Remove item">
          ✕
        </button>
      </div>
    </div>
  );
}