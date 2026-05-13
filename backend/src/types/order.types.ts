import { OrderStatus } from "../../generated/prisma";
export type OrderType = {
  product_id: string;
  quantity: number;
  price: number;
};

export const nextStatus: Record<string, OrderStatus> = {
  PENDING: "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED: "DELIVERED",
};
