'use client';
 
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import type { Product, Category } from '@/types';
import styles from './home.module.scss';
 
// ─── Page ─────────────────────────────────────────────────────────────────────
 
export default function HomePage() {
  const { data: productsData } = useProducts({ limit: 8, sortBy: 'created_at', sortOrder: 'desc' });
  const { data: categoriesData } = useCategories();
  const addItem = useCartStore((s) => s.addItem);
 
  const products = productsData?.data.products ?? [];
  const categories = categoriesData?.data ?? [];
 
  return (
    <div className={styles.page}>
      <HeroSection categories={categories} />
      <TrustBar />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={products} onAddToCart={(p) => addItem(p, 1)} />
      <PromoBanner />
      <Testimonials />
      <NewsletterSection />
    </div>
  );
}
 
// ─── Hero ─────────────────────────────────────────────────────────────────────
 
function HeroSection({ categories }: { categories: Category[] }) {
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
      {/* Background geometric shapes */}
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
 
          {/* Category pills */}
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
 
        {/* Right side - visual panel */}
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
              <div className={styles.heroImagePlaceholder}>
                <span>Featured</span>
              </div>
            </div>
            <div className={styles.heroImageCell}>
              <div className={styles.heroImagePlaceholder}>
                <span>New</span>
              </div>
            </div>
            <div className={styles.heroImageCell}>
              <div className={styles.heroImagePlaceholder}>
                <span>Sale</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
 
// ─── Trust Bar ────────────────────────────────────────────────────────────────
 
function TrustBar() {
  const items = [
    { icon: '🚚', label: 'Free shipping', sub: 'On orders over $50' },
    { icon: '↩️', label: 'Easy returns', sub: '30-day return policy' },
    { icon: '🔒', label: 'Secure checkout', sub: 'SSL encrypted payments' },
    { icon: '💬', label: '24/7 support', sub: 'We\'re always here' },
  ];
 
  return (
    <div className={styles.trustBar}>
      <div className={styles.trustBarInner}>
        {items.map((item) => (
          <div key={item.label} className={styles.trustItem}>
            <span className={styles.trustIcon}>{item.icon}</span>
            <div className={styles.trustText}>
              <span className={styles.trustLabel}>{item.label}</span>
              <span className={styles.trustSub}>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
// ─── Categories Section ───────────────────────────────────────────────────────
 
const CATEGORY_COLORS = [
  '#EEF2FF', '#FFF7ED', '#F0FDF4', '#FFF1F2',
  '#F0F9FF', '#FEFCE8', '#FAF5FF', '#FDF2F8',
];
const CATEGORY_ICONS = ['🎧', '👗', '🏠', '💄', '📱', '🎮', '🌿', '🍳'];
 
function CategoriesSection({ categories }: { categories: Category[] }) {
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
              <span className={styles.categoryCardIcon}>
                {CATEGORY_ICONS[i % CATEGORY_ICONS.length]}
              </span>
              <span className={styles.categoryCardName}>{cat.content}</span>
              <span className={styles.categoryCardArrow}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
 
// ─── Featured Products ────────────────────────────────────────────────────────
 
function FeaturedProducts({
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
 
function ProductCard({
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
          <span className={styles.productCardPrice}>${product.price.toFixed(2)}</span>
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
 
// ─── Promo Banner ─────────────────────────────────────────────────────────────
 
function PromoBanner() {
  return (
    <section className={styles.promo}>
      <div className={styles.promoInner}>
        <div className={styles.promoBg}>
          <div className={styles.promoShape} />
        </div>
        <div className={styles.promoContent}>
          <p className={styles.promoEyebrow}>Limited time offer</p>
          <h2 className={styles.promoTitle}>
            Get 20% off your
            <br />
            first order
          </h2>
          <p className={styles.promoSub}>
            Sign up for an account and use code{' '}
            <strong>WELCOME20</strong> at checkout.
          </p>
          <Link href="/register" className={styles.promoCta}>
            Create account
          </Link>
        </div>
        <div className={styles.promoVisual}>
          <div className={styles.promoTag}>
            <span className={styles.promoTagPercent}>20</span>
            <span className={styles.promoTagOff}>% OFF</span>
          </div>
        </div>
      </div>
    </section>
  );
}
 
// ─── Testimonials ─────────────────────────────────────────────────────────────
 
const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    text: 'Incredible selection and the shipping was faster than expected. Will definitely shop here again!',
    rating: 5,
    location: 'New York, NY',
  },
  {
    name: 'Marcus T.',
    text: 'The quality exceeded my expectations. Customer service was also super responsive when I had a question.',
    rating: 5,
    location: 'London, UK',
  },
  {
    name: 'Ayasha M.',
    text: 'I love how easy it is to find exactly what I\'m looking for. The category filters are a lifesaver.',
    rating: 5,
    location: 'Toronto, CA',
  },
];
 
function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Happy customers</p>
            <h2 className={styles.sectionTitle}>What people are saying</h2>
          </div>
        </div>
 
        <div className={styles.testimonialGrid}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                {'★'.repeat(t.rating)}
              </div>
              <p className={styles.testimonialText}>"{t.text}"</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <span className={styles.testimonialName}>{t.name}</span>
                  <span className={styles.testimonialLocation}>{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
 
// ─── Newsletter ───────────────────────────────────────────────────────────────
 
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };
 
  return (
    <section className={styles.newsletter}>
      <div className={styles.newsletterInner}>
        <div className={styles.newsletterContent}>
          <h2 className={styles.newsletterTitle}>Stay in the loop</h2>
          <p className={styles.newsletterSub}>
            Get new arrivals, exclusive deals, and style tips delivered to your inbox.
          </p>
        </div>
        {submitted ? (
          <div className={styles.newsletterSuccess}>
            <span>✓</span> Thanks! You're on the list.
          </div>
        ) : (
          <form className={styles.newsletterForm} onSubmit={handleSubmit}>
            <input
              type="email"
              className={styles.newsletterInput}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.newsletterBtn}>
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
 
// ─── Icons ────────────────────────────────────────────────────────────────────
 
function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}