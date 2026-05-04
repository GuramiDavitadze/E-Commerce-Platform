'use client';
 
import { useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import type { ProductFilters, Product } from '@/types';
import Link from 'next/link';
import styles from './products.module.scss';
 
export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
 
  const [filters, setFilters] = useState<ProductFilters>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice')
      ? Number(searchParams.get('minPrice'))
      : undefined,
    maxPrice: searchParams.get('maxPrice')
      ? Number(searchParams.get('maxPrice'))
      : undefined,
    skip: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
    sortBy: searchParams.get('sortBy') || 'price',
    order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
  });
 
  const [searchInput, setSearchInput] = useState(filters.search || '');
 
  const { data, isLoading, isError } = useProducts(filters);
  const { data: categoriesData } = useCategories();
  const addItem = useCartStore((s) => s.addItem);
 
  const products = data?.data ?? [];
  // const pagination = data?.data.pagination;
  const categories = categoriesData?.data ?? [];
  console.log(data);
  
 
  const updateFilter = useCallback(
    (updates: Partial<ProductFilters>) => {
      const next = { ...filters, ...updates, page: 1 };
      setFilters(next);
      // Sync URL
      const params = new URLSearchParams();
      if (next.search) params.set('search', next.search);
      if (next.category) params.set('category', next.category);
      if (next.minPrice) params.set('minPrice', String(next.minPrice));
      if (next.maxPrice) params.set('maxPrice', String(next.maxPrice));
      if (next.sortBy) params.set('sortBy', next.sortBy);
      if (next.order) params.set('order', next.order);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [filters, pathname, router]
  );
 
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({ search: searchInput });
  };
 
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
 
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Products</h1>
          {/* {pagination && (
            <span className={styles.count}>
              {pagination.total} item{pagination.total !== 1 ? 's' : ''}
            </span>
          )} */}
        </div>
 
        <div className={styles.layout}>
          {/* ── Sidebar filters ───────────────────────────── */}
          <aside className={styles.sidebar}>
            {/* Search */}
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Search</h3>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products…"
                  className={styles.searchInput}
                />
                <button type="submit" className={styles.searchBtn}>
                  Go
                </button>
              </form>
            </div>
 
            {/* Categories */}
            {categories.length > 0 && (
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Category</h3>
                <ul className={styles.categoryList}>
                  <li>
                    <button
                      className={`${styles.categoryItem} ${!filters.category ? styles.active : ''}`}
                      onClick={() => updateFilter({ category: '' })}
                    >
                      All
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        className={`${styles.categoryItem} ${filters.category === cat.category_slug ? styles.active : ''}`}
                        onClick={() =>
                          updateFilter({ category: cat.category_slug })
                        }
                      >
                        {cat.content}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
 
            {/* Price range */}
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Price range</h3>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  min={0}
                  placeholder="Min"
                  className={styles.priceInput}
                  defaultValue={filters.minPrice}
                  onBlur={(e) =>
                    updateFilter({
                      minPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
                <span className={styles.priceSep}>—</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Max"
                  className={styles.priceInput}
                  defaultValue={filters.maxPrice}
                  onBlur={(e) =>
                    updateFilter({
                      maxPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
            </div>
 
            {/* Sort */}
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Sort by</h3>
              <select
                className={styles.select}
                value={`${filters.sortBy}-${filters.order}`}
                onChange={(e) => {
                  const [sortBy, order] = e.target.value.split('-');
                  updateFilter({
                    sortBy,
                    order: order as 'asc' | 'desc',
                  });
                }}
              >
                <option value="created_at-desc">Newest first</option>
                <option value="created_at-asc">Oldest first</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
            </div>
 
            {/* Reset */}
            {(filters.search ||
              filters.category ||
              filters.minPrice ||
              filters.maxPrice) && (
              <button
                className={styles.resetBtn}
                onClick={() => {
                  setSearchInput('');
                  setFilters({
                    skip: 0,
                    limit: 12,
                    sortBy: 'created_at',
                    order: 'desc',
                  });
                  router.replace(pathname);
                }}
              >
                Clear filters
              </button>
            )}
          </aside>
 
          {/* ── Product grid ──────────────────────────────── */}
          <main className={styles.main}>
            {isLoading && (
              <div className={styles.grid}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={styles.skeleton} />
                ))}
              </div>
            )}
 
            {isError && (
              <div className={styles.empty}>
                <p>Failed to load products. Please try again.</p>
              </div>
            )}
 
            {!isLoading && !isError && products.length === 0 && (
              <div className={styles.empty}>
                <p>No products found.</p>
                {filters.search && (
                  <p className={styles.emptySub}>
                    Try a different search term or clear your filters.
                  </p>
                )}
              </div>
            )}
 
            {!isLoading && products.length > 0 && (
              <div className={styles.grid}>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => addItem(product, 1)}
                  />
                ))}
              </div>
            )}
 
            {/* Pagination */}
            {/* {pagination && pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => handlePageChange(filters.skip! - 1)}
                  disabled={filters.skip === 1}
                >
                  ← Previous
                </button>
                <div className={styles.pageNumbers}>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === pagination.totalPages ||
                        Math.abs(p - (filters.skip ?? 1)) <= 1
                    )
                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && (arr[idx - 1] as number) < p - 1)
                        acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <span key={`ellipsis-${i}`} className={styles.ellipsis}>
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          className={`${styles.pageNum} ${filters.skip === p ? styles.pageNumActive : ''}`}
                          onClick={() => handlePageChange(p as number)}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>
                <button
                  className={styles.pageBtn}
                  onClick={() => handlePageChange(filters.skip! + 1)}
                  disabled={filters.skip === pagination.totalPages}
                >
                  Next →
                </button>
              </div>
            )} */}
          </main>
        </div>
      </div>
    </div>
  );
}
 
// ─── Product Card ─────────────────────────────────────────────────────────────
 
function ProductCard({
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
          <span className={styles.cardPrice}>
            ${product.price}
          </span>
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