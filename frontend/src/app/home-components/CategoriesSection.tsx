import Link from 'next/link';
import type { Category } from '@/types';
import styles from '../home.module.scss';
 
const CATEGORY_COLORS = [
  '#EEF2FF', '#FFF7ED', '#F0FDF4', '#FFF1F2',
  '#F0F9FF', '#FEFCE8', '#FAF5FF', '#FDF2F8',
];
 
export function CategoriesSection({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
 
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Browse by category</p>
            <h2 className={styles.sectionTitle}>What are you looking for?</h2>
          </div>
          <Link href="/products" className={styles.seeAll}>
            See all →
          </Link>
        </div>
 
        <div className={styles.categoryGrid}>
          {categories.slice(0, 8).map((cat, i) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.category_slug}`}
              className={styles.categoryCard}
              style={{ '--cat-bg': CATEGORY_COLORS[i % CATEGORY_COLORS.length] } as React.CSSProperties}
            >
              <span className={styles.categoryCardName}>{cat.content}</span>
              <span className={styles.categoryCardArrow}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}