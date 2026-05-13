import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CommentsResponse, CreateCommentPayload } from "@/types";

export const commentKeys = {
  product: (productId: string) => ["comments", productId] as const,
};

export function useProductComments(productId: string) {
  return useQuery({
    queryKey: commentKeys.product(productId),
    queryFn: () =>
      api.get<CommentsResponse>(`/comments?product_id=${productId}`),
    enabled: !!productId,
  });
}

export function useCreateComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      api.post("/comments", payload),
    onSuccess: (_, { product_id }) => {
      qc.invalidateQueries({ queryKey: commentKeys.product(product_id) });
    },
  });
}

export function useDeleteComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, productId }: { id: string; productId: string }) =>
      api.delete(`/comments/${id}`),
    onSuccess: (_, { productId }) => {
      qc.invalidateQueries({ queryKey: commentKeys.product(productId) });
    },
  });
}
