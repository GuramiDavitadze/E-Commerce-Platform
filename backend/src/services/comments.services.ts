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

const getAllCommentsByProductIdService = async (product_id: string) => {
  return await prisma.comment.findMany({
    where: {
      product_id,
    },
  });
};

const changeCommentTextService = async (
  user_id: string,
  comment_id: string,
  text: string,
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: comment_id,
    },
    select: { author_id: true },
  });
  if (comment?.author_id !== user_id) {
    const newError = new Error(
      "You don't have permission to change the comment!",
    );
    newError.name = "Unauthorized";
    throw newError;
  }
  return await prisma.comment.update({
    where: {
      id: comment_id,
      author_id: user_id,
    },
    data: {
      text,
    },
  });
};
const deleteCommentByIdService = async (
  user_id: string,
  comment_id: string,
  role: string,
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: comment_id },
    select: { author_id: true },
  });

  if (role!=="ADMIN" && comment?.author_id != user_id) {
    const newError = new Error("You don't have permission to delete comment");
    newError.name = "Unauthorized";
    throw newError;
  }
  return await prisma.comment.delete({
    where: { id: comment_id },
  });
};
export {
  createCommentService,
  getAllCommentsByProductIdService,
  changeCommentTextService,
  deleteCommentByIdService,
};
