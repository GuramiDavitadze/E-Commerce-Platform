import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import styles from '../products.module.scss';
 
interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  hasSearch: boolean;
  onAddToCart: (product: Product) => void;
}
 
export function ProductGrid({
  products,
  isLoading,
  isError,
  hasSearch,
  onAddToCart,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    );
  }
 
  if (isError) {
    return (
      <div className={styles.empty}>
        <p>Failed to load products. Please try again.</p>
      </div>
    );
  }
 
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No products found.</p>
        {hasSearch && (
          <p className={styles.emptySub}>
            Try a different search term or clear your filters.
          </p>
        )}
      </div>
    );
  }
 
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  );
}
 