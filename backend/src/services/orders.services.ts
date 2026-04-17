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
  return await prisma.order.findMany();
};
export { createOrderService, getAllOrdersService, getAllOrdersForAdminService };
