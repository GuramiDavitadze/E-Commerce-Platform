import prisma from "../config/prisma";

const createCommentService = async (
  text: string,
  user_id: string,
  product_id: string,
) => {
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      product_id,
      order: {
        user_id,
        status: "DELIVERED",
      },
    },
  });

  if (!hasPurchased) {
    const error = new Error("You must purchase this product to review it");
    error.name = "NotPurchased";
    throw error;
  }

  return await prisma.comment.create({
    data: {
      text,
      product_id,
      author_id: user_id,
    },
  });
};

export { createCommentService };
