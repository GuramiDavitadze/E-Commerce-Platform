import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, uploadFile } from "@/lib/api";
import type {
  Product,
  ProductsResponse,
  ProductResponse,
  CreateProductPayload,
  UpdateProductPayload,
  UsersResponse,
  UserResponse,
  CategoriesResponse,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types";
import { productKeys, categoryKeys } from "./useProducts";

// ─── User query keys ──────────────────────────────────────────────────────────

export const userKeys = {
  all: ["users"] as const,
  list: () => [...userKeys.all, "list"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

// ─── Admin: Products ──────────────────────────────────────────────────────────

export function useAdminProducts() {
  return useQuery({
    queryKey: productKeys.list({ limit: 200 }),
    queryFn: () =>
      api.get<{ success: boolean; data: Product[] }>("/products?limit=200"),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      imageFile,
    }: {
      payload: CreateProductPayload;
      imageFile?: File | null;
    }) => {
      const fd = new FormData();
      fd.append("name", payload.name);
      fd.append("description", payload.description);
      fd.append("price", String(payload.price));
      fd.append("quantity", String(payload.quantity));
      fd.append("category_id", payload.category_id);
      fd.append("status", String(payload.status));
      if (imageFile) fd.append("image", imageFile);
      return uploadFile<ProductResponse>("/products", fd, "POST");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
      imageFile,
    }: {
      id: string;
      payload: UpdateProductPayload;
      imageFile?: File | null;
    }) => {
      const fd = new FormData();
      if (payload.name !== undefined) fd.append("name", payload.name);
      if (payload.description !== undefined)
        fd.append("description", payload.description);
      if (payload.price !== undefined)
        fd.append("price", String(payload.price));
      if (payload.quantity !== undefined)
        fd.append("quantity", String(payload.quantity));
      if (payload.category_id !== undefined)
        fd.append("category_id", payload.category_id);
      if (payload.status !== undefined)
        fd.append("status", String(payload.status));
      if (imageFile) fd.append("image", imageFile);
      return uploadFile<ProductResponse>(`/products/${id}`, fd, "PUT");
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: productKeys.lists() });
      qc.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
 

// ─── Admin: Users ─────────────────────────────────────────────────────────────

export function useAdminUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => api.get<UsersResponse>("/users"),
  });
}

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch<UserResponse>(`/users/${id}/status`, { isActive }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
}

export function useChangeUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: "ADMIN" | "CUSTOMER" }) =>
      api.patch<UserResponse>(`/users/${id}/role`, { role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
}

// ─── Admin: Categories ────────────────────────────────────────────────────────

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      api.post("/categories", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => api.put(`/categories/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
