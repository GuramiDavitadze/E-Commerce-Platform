'use client';
 
import { useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import type { ProductFilters, Product } from '@/types';
import { ProductSidebar, ProductGrid } from './components';
import styles from './products.module.scss';
 
export default function ProductsClientPage() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
 
  const [filters, setFilters] = useState<ProductFilters>({
    search:   searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    skip:     searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    limit:    12,
    sortBy:   searchParams.get('sortBy') || 'price',
    order:    (searchParams.get('order') as 'asc' | 'desc') || 'desc',
  });
 
  const [searchInput, setSearchInput] = useState(filters.search || '');
 
  const { data, isLoading, isError } = useProducts(filters);
  const { data: categoriesData }     = useCategories();
  const addItem = useCartStore((s) => s.addItem);
 
  const products   = data?.data ?? [];
  const categories = categoriesData?.data ?? [];
 
  const updateFilter = useCallback(
    (updates: Partial<ProductFilters>) => {
      const next = { ...filters, ...updates, skip: 0 };
      setFilters(next);
      const params = new URLSearchParams();
      if (next.search)   params.set('search',   next.search);
      if (next.category) params.set('category', next.category);
      if (next.minPrice) params.set('minPrice', String(next.minPrice));
      if (next.maxPrice) params.set('maxPrice', String(next.maxPrice));
      if (next.sortBy)   params.set('sortBy',   next.sortBy);
      if (next.order)    params.set('order',     next.order);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [filters, pathname, router]
  );
 
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({ search: searchInput });
  };
 
  const handleReset = () => {
    setSearchInput('');
    router.replace(pathname);
    setFilters({ skip: 0, limit: 12, sortBy: 'price', order: 'desc', minPrice: undefined });
  };
 
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Products</h1>
        </div>
 
        <div className={styles.layout}>
          <ProductSidebar
            filters={filters}
            searchInput={searchInput}
            categories={categories}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={handleSearchSubmit}
            onFilterUpdate={updateFilter}
            onReset={handleReset}
          />
 
          <main className={styles.main}>
            <ProductGrid
              products={products}
              isLoading={isLoading}
              isError={isError}
              hasSearch={!!filters.search}
              onAddToCart={(product: Product) => addItem(product, 1)}
            />
          </main>
        </div>
      </div>
    </div>
  );
}