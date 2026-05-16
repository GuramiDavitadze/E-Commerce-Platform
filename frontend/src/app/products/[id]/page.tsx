'use client';
 
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProduct } from '@/hooks/useProducts';
import { useProductComments } from '@/hooks/useComments';
import {
  ProductSkeleton,
  ProductInfo,
  ReviewSection,
} from './components';
import styles from './product.module.scss';
 
export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
 
  const { data: productData, isLoading, isError } = useProduct(id);
  const { data: commentsData } = useProductComments(id);
 
  const product  = productData?.data;
  const comments = commentsData?.data ?? [];
 
  const avgRating =
    comments.length > 0
      ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
      : 0;
 
  if (isLoading) return <ProductSkeleton />;
 
  if (isError || !product) {
    return (
      <div className={styles.errorPage}>
        <h2>Product not found</h2>
        <Link href="/products" className={styles.backLink}>
          ← Back to products
        </Link>
      </div>
    );
  }
 
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span>/</span>
          <Link href="/products" className={styles.breadcrumbLink}>Products</Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>
 
        <ProductInfo
          product={product}
          avgRating={avgRating}
          reviewCount={comments.length}
        />
 
        <ReviewSection
          productId={id}
          comments={comments}
          avgRating={avgRating}
        />
      </div>
    </div>
  );
}