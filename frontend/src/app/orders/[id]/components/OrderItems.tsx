import Link from 'next/link';
import type { OrderItem } from '@/types';
import styles from '../order.module.scss';
 
interface OrderItemsProps {
  items: OrderItem[];
  subtotal: number;
}
 
export function OrderItems({ items, subtotal }: OrderItemsProps) {
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const total    = subtotal + shipping;
 
  return (
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
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <Link href={`/products/${item.product_id}`} className={styles.itemImageLink}>
                <div className={styles.itemImage}>
                  {item.product?.image ? (
                    <img src={item.product.image} alt={item.product.name} />
                  ) : (
                    <span>📦</span>
                  )}
                </div>
              </Link>
 
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
 
              <div className={styles.itemRight}>
                <span className={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
 
      <div className={styles.totalsSection}>
        <div className={styles.totalRow}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Shipping</span>
          <span className={shipping === 0 ? styles.free : ''}>
            {shipping === 0 ? 'Free' : '$4.99'}
          </span>
        </div>
        <div className={styles.totalRowFinal}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}