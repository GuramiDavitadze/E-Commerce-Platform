import type { OrderStatus } from "@/types";

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const STATUS_STEPS: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export const STATUS_META: Record<OrderStatus, { icon: string; desc: string }> =
  {
    PENDING: {
      icon: "🕐",
      desc: "Your order has been placed and is awaiting confirmation.",
    },
    PROCESSING: {
      icon: "📦",
      desc: "We are preparing your order for shipment.",
    },
    SHIPPED: { icon: "🚚", desc: "Your order is on its way!" },
    DELIVERED: { icon: "✅", desc: "Your order has been delivered. Enjoy!" },
    CANCELLED: { icon: "❌", desc: "This order was cancelled." },
  };
