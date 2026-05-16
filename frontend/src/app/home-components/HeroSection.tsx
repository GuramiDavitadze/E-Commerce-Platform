'use client';
 
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Category } from '@/types';
import { ArrowRight } from './ArrowRight';
import styles from '../home.module.scss';
 
export function HeroSection({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const headlineRef = useRef<HTMLHeadingElement>(null);
 
  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, [activeCategory]);
 
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg}>
        <div className={styles.heroShape1} />
        <div className={styles.heroShape2} />
        <div className={styles.heroShape3} />
      </div>
 
      <div className={styles.heroInner}>
        {/* Left side */}
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroDot} />
            New arrivals every week
          </div>
 
          <h1 ref={headlineRef} className={styles.heroHeadline}>
            {categories[activeCategory]
              ? `Shop ${categories[activeCategory].content}`
              : 'Discover Something Great'}
          </h1>
 
          <p className={styles.heroSub}>
            Curated collections, unbeatable prices. Find exactly what you're
            looking for — or discover something you didn't know you needed.
          </p>
 
          <div className={styles.heroActions}>
            <Link href="/products" className={styles.heroCta}>
              Shop now
              <ArrowRight />
            </Link>
            <Link href="/products" className={styles.heroSecondary}>
              Browse all
            </Link>
          </div>
 
          {categories.length > 0 && (
            <div className={styles.heroCategoryPills}>
              {categories.slice(0, 5).map((cat, i) => (
                <button
                  key={cat.id}
                  className={`${styles.heroPill} ${activeCategory === i ? styles.heroPillActive : ''}`}
                  onClick={() => setActiveCategory(i)}
                >
                  {cat.content}
                </button>
              ))}
            </div>
          )}
        </div>
 
        {/* Right side */}
        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardInner}>
              <div className={styles.heroCardIcon}>🛍️</div>
              <div className={styles.heroCardText}>
                <span className={styles.heroCardNum}>10k+</span>
                <span className={styles.heroCardLabel}>Products</span>
              </div>
            </div>
            <div className={styles.heroCardInner}>
              <div className={styles.heroCardIcon}>⭐</div>
              <div className={styles.heroCardText}>
                <span className={styles.heroCardNum}>4.9</span>
                <span className={styles.heroCardLabel}>Avg rating</span>
              </div>
            </div>
            <div className={styles.heroCardInner}>
              <div className={styles.heroCardIcon}>🚚</div>
              <div className={styles.heroCardText}>
                <span className={styles.heroCardNum}>Free</span>
                <span className={styles.heroCardLabel}>Shipping</span>
              </div>
            </div>
          </div>
 
          <div className={styles.heroImageGrid}>
            <div className={`${styles.heroImageCell} ${styles.heroImageCellLarge}`}>
              <div className={styles.heroImagePlaceholder}><span>Featured</span></div>
            </div>
            <div className={styles.heroImageCell}>
              <div className={styles.heroImagePlaceholder}><span>New</span></div>
            </div>
            <div className={styles.heroImageCell}>
              <div className={styles.heroImagePlaceholder}><span>Sale</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}