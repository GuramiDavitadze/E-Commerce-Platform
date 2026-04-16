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

export { createOrderService };
