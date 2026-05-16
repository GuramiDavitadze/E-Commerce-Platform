'use client';
 
import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';
import styles from '../products.module.scss';
 
export function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
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
    <Link href={`/products/${product.id}`} className={styles.card}>
      <div className={styles.cardImage}>
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <div className={styles.cardImagePlaceholder}>
            <span>No image</span>
          </div>
        )}
        {product.quantity === 0 && (
          <div className={styles.outOfStock}>Out of stock</div>
        )}
      </div>
 
      <div className={styles.cardBody}>
        {product.category && (
          <span className={styles.cardCategory}>{product.category.content}</span>
        )}
        <h3 className={styles.cardName}>{product.name}</h3>
        <p className={styles.cardDesc}>{product.description}</p>
 
        <div className={styles.cardFooter}>
          <span className={styles.cardPrice}>${product.price}</span>
          <button
            className={`${styles.addBtn} ${added ? styles.addedBtn : ''}`}
            onClick={handleAdd}
            disabled={product.quantity === 0 || added}
          >
            {added ? '✓ Added' : 'Add to cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}