import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@/lib/api";
import type {
  ProductsResponse,
  ProductResponse,
  ProductFilters,
  CategoriesResponse,
} from "@/types";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
};

// ─── Products ─────────────────────────────────────────────────────────────────

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => {
      const url = buildUrl("/products", {
        // search: filters.search,
        // category: filters.category,
        // minPrice: filters.minPrice,
        // maxPrice: filters.maxPrice,
        // status: filters.status,
        skip: filters.skip ?? 0,
        limit: filters.limit ?? 12,
        sortBy: filters.sortBy,
        order: filters.order,
      });
      return api.get<ProductsResponse>(url);
    },

    staleTime: 1000 * 60, // 1 min
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => api.get<ProductResponse>(`/products/${id}`),
    enabled: !!id,
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => api.get<CategoriesResponse>("/category"),
    staleTime: 1000 * 60 * 10, // 10 min — rarely changes
  });
}
