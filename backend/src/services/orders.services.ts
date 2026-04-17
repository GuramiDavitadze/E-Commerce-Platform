import { OrderStatus } from "../../generated/prisma";
import prisma from "../config/prisma";
type OrderType = {
  product_id: string;
  quantity: number;
  price: number;
};
const createOrderService = async (user_id: string, orders: OrderType[]) => {
  return await prisma.order.create({
    data: {
      user_id,
      status: "PENDING",
      order_items: {
        createMany: {
          data: orders!,
        },
      },
    },
  });
};

const getAllOrdersService = async (user_id: string) => {
  return await prisma.order.findMany({
    where: {
      user_id,
    },
    include: {
      order_items: true,
    },
  });
};
const getAllOrdersForAdminService = async () => {
  return await prisma.order.findMany({
    include: {
      order_items: true,
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
};

const nextStatus: Record<string, OrderStatus> = {
  PENDING: "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED: "DELIVERED",
};

const changeOrderStatusService = async (order_id: string) => {
  const order = await prisma.order.findUnique({
    where: { id: order_id },
  });
  if (!order) {
    const error = new Error("Order not found");
    error.name = "NotFound";
    throw error;
  }
  const next = nextStatus[order.status];
  if (!next) {
    const error = new Error("Order is already delivered");
    error.name = "AlreadyDelivered";
    throw error;
  }
  return await prisma.order.update({
    where: { id: order_id },
    data: {
      status: next,
    },
  });
};
export { createOrderService, getAllOrdersService, getAllOrdersForAdminService,changeOrderStatusService };
