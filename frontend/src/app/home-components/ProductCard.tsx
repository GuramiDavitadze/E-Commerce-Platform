'use client';
 
import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';
import styles from '../home.module.scss';
 
export function ProductCard({
  product,
  featured,
  onAddToCart,
}: {
  product: Product;
  featured?: boolean;
  onAddToCart: () => void;
}) {
  const [added, setAdded] = useState(false);
 
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
 
  return (
    <Link
      href={`/products/${product.id}`}
      className={`${styles.productCard} ${featured ? styles.productCardFeatured : ''}`}
    >
      <div className={styles.productCardImage}>
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <div className={styles.productCardPlaceholder}>
            <span>📦</span>
          </div>
        )}
        {product.quantity === 0 && (
          <div className={styles.productCardBadge}>Out of stock</div>
        )}
        {featured && product.quantity > 0 && (
          <div className={`${styles.productCardBadge} ${styles.productCardBadgeNew}`}>New</div>
        )}
      </div>
 
      <div className={styles.productCardBody}>
        {product.category && (
          <span className={styles.productCardCat}>{product.category.content}</span>
        )}
        <h3 className={styles.productCardName}>{product.name}</h3>
        <div className={styles.productCardFooter}>
          <span className={styles.productCardPrice}>${Number(product.price).toFixed(2)}</span>
          <button
            className={`${styles.productCardBtn} ${added ? styles.productCardBtnAdded : ''}`}
            onClick={handleAdd}
            disabled={product.quantity === 0 || added}
          >
            {added ? '✓' : '+'}
          </button>
        </div>
      </div>
    </Link>
  );
}