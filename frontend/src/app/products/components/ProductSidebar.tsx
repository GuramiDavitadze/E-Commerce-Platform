'use client';
 
import type { Category, ProductFilters } from '@/types';
import styles from '../products.module.scss';
 
interface ProductSidebarProps {
  filters: ProductFilters;
  searchInput: string;
  categories: Category[];
  onSearchInputChange: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onFilterUpdate: (updates: Partial<ProductFilters>) => void;
  onReset: () => void;
}
 
export function ProductSidebar({
  filters,
  searchInput,
  categories,
  onSearchInputChange,
  onSearchSubmit,
  onFilterUpdate,
  onReset,
}: ProductSidebarProps) {
  const hasActiveFilters =
    !!filters.search || !!filters.category || !!filters.minPrice || !!filters.maxPrice;
 
  return (
    <aside className={styles.sidebar}>
      {/* Search */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Search</h3>
        <form onSubmit={onSearchSubmit} className={styles.searchForm}>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
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
                onClick={() => onFilterUpdate({ category: '' })}
              >
                All
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  className={`${styles.categoryItem} ${filters.category === cat.category_slug ? styles.active : ''}`}
                  onClick={() => onFilterUpdate({ category: cat.category_slug })}
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
              onFilterUpdate({
                minPrice: e.target.value ? Number(e.target.value) : undefined,
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
              onFilterUpdate({
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
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
            onFilterUpdate({ sortBy, order: order as 'asc' | 'desc' });
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
      {hasActiveFilters && (
        <button className={styles.resetBtn} onClick={onReset}>
          Clear filters
        </button>
      )}
    </aside>
  );
}