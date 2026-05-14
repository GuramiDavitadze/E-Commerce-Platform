import Link from 'next/link';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import styles from '../home.module.scss';
 
export function FeaturedProducts({
  products,
  onAddToCart,
}: {
  products: Product[];
  onAddToCart: (p: Product) => void;
}) {
  if (products.length === 0) return null;
 
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Just arrived</p>
            <h2 className={styles.sectionTitle}>New arrivals</h2>
          </div>
          <Link href="/products" className={styles.seeAll}>
            View all →
          </Link>
        </div>
 
        <div className={styles.productGrid}>
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              featured={i === 0}
              onAddToCart={() => onAddToCart(product)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}