import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiClientError } from "@/lib/api";
import type {
  OrdersResponse,
  OrderResponse,
  CreateOrderPayload,
  OrderStatus,
} from "@/types";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const orderKeys = {
  all: ["orders"] as const,
  mine: () => [...orderKeys.all, "mine"] as const,
  admin: () => [...orderKeys.all, "admin"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useMyOrders() {
  return useQuery({
    queryKey: orderKeys.mine(),
    queryFn: () => api.get<OrdersResponse>("/orders/my-orders"),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => api.get<OrderResponse>(`/orders/${id}`),
    enabled: !!id,
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: orderKeys.admin(),
    queryFn: () => api.get<OrdersResponse>("/orders/admin-orders"),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      api.post<OrderResponse>("/orders", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.mine() });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      api.patch<OrderResponse>(`/orders/${id}/status`, { status }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(id) });
      qc.invalidateQueries({ queryKey: orderKeys.admin() });
      qc.invalidateQueries({ queryKey: orderKeys.mine() });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch<OrderResponse>(`/orders/${id}/cancel`),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(id) });
      qc.invalidateQueries({ queryKey: orderKeys.mine() });
    },
  });
}
