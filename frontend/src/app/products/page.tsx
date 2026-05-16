import { Suspense } from 'react';
import ProductsClientPage from './ProductsClientPage';
import styles from './products.module.scss';
 
function ProductsPageSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Products</h1>
        </div>
        <div className={styles.layout}>
          <div className={styles.sidebar} />
          <div className={styles.grid}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsClientPage />
    </Suspense>
  );
}
 