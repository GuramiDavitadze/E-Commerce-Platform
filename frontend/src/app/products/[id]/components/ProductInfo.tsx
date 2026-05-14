'use client';
 
import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';
import { Stars } from './Stars';
import styles from '../product.module.scss';
 
interface ProductInfoProps {
  product: Product;
  avgRating: number;
  reviewCount: number;
}
 
export function ProductInfo({ product, avgRating, reviewCount }: ProductInfoProps) {
    const addItem = useCartStore((s) => s.addItem);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
 
    const handleAddToCart = () => {
        addItem(product, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };
 
    return (
        <div className={styles.product}>
            {/* Image */}
            <div className={styles.imageWrap}>
                {product.image ? (
                    <img src={product.image} alt={product.name} className={styles.image} />
                ) : (
                    <div className={styles.imagePlaceholder}>No image</div>
                )}
            </div>
 
            {/* Info */}
            <div className={styles.info}>
                {product.category && (
                    <span className={styles.category}>{product.category.content}</span>
                )}
                <h1 className={styles.name}>{product.name}</h1>
 
                {/* Rating summary */}
                {reviewCount > 0 && (
                    <div className={styles.ratingRow}>
                        <Stars rating={avgRating} />
                        <span className={styles.ratingText}>
                            {avgRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                        </span>
                    </div>
                )}
 
                <p className={styles.price}>${Number(product.price).toFixed(2)}</p>
                <p className={styles.description}>{product.description}</p>
 
                {/* Stock */}
                <div className={styles.stock}>
                    {product.quantity > 0 ? (
                        <span className={styles.inStock}>
                            ✓ In stock ({product.quantity} available)
                        </span>
                    ) : (
                        <span className={styles.outOfStock}>✗ Out of stock</span>
                    )}
                </div>
 
                {/* Quantity + Add to cart */}
                {product.quantity > 0 && (
                    <div className={styles.actions}>
                        <div className={styles.qtyControl}>
                            <button
                                className={styles.qtyBtn}
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                disabled={qty <= 1}
                            >
                                −
                            </button>
                            <span className={styles.qtyValue}>{qty}</span>
                            <button
                                className={styles.qtyBtn}
                                onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}
                                disabled={qty >= product.quantity}
                            >
                                +
                            </button>
                        </div>
                        <button
                            className={`${styles.addBtn} ${added ? styles.addedBtn : ''}`}
                            onClick={handleAddToCart}
                            disabled={added}
                        >
                            {added ? '✓ Added to cart' : 'Add to cart'}
                        </button>
                    </div>
                )}
 
                <Link href="/cart" className={styles.viewCartLink}>
                    View cart →
                </Link>
            </div>
        </div>
    );
}