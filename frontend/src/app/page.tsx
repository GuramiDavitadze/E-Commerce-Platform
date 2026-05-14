'use client';
 
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import {
  HeroSection,
  TrustBar,
  CategoriesSection,
  FeaturedProducts,
  PromoBanner,
  Testimonials,
  NewsletterSection,
} from './home-components';
import styles from './home.module.scss';
 
export default function HomePage() {
  const { data: productsData } = useProducts({ limit: 8, sortBy: 'price', order: 'desc' });
  const { data: categoriesData } = useCategories();
  const addItem = useCartStore((s) => s.addItem);
 
  const products   = productsData?.data ?? [];
  const categories = categoriesData?.data ?? [];
 
  return (
    <div className={styles.page}>
      <HeroSection       categories={categories} />
      <TrustBar />
      <CategoriesSection categories={categories} />
      <FeaturedProducts  products={products} onAddToCart={(p) => addItem(p, 1)} />
      <PromoBanner />
      <Testimonials />
      <NewsletterSection />
    </div>
  );
}