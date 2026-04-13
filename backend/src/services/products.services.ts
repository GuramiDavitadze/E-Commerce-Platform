import prisma from "../config/prisma";

type ProductType = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: boolean;
};
const productCreationService = async (
  data: ProductType,
  admin_id: string,
  category_id: string,
) => {
  return await prisma.product.create({
    data: {
      ...data,
      category: {
        connect: { id: category_id },
      },
      admin: {
        connect: {
          id: admin_id,
        },
      },
    },
  });
};

const getAllProductsService = async (limit: number) => {
  return await prisma.product.findMany({
    omit: {
      admin_id: true,
      category_id: true,
      update_at: true,
      created_at: true,
    },
    take: limit,
    include: {
      category: {
        select: {
          content: true,
        },
      },
    },
  });
};

const getProductsByCategoryService = async (category_slug: string) => {
  return await prisma.product.findMany({
    where: {
      category: {
        category_slug,
      },
    },
    omit: {
      admin_id: true,
      category_id: true,
      update_at: true,
      created_at: true,
    },
    include: {
      category: {
        select: {
          content: true,
        },
      },
    },
  });
};

const deleteProductByIdService = async (product_id: string) => {
  return await prisma.product.delete({
    where: {
      id: product_id,
    },
  });
};
export {
  productCreationService,
  getAllProductsService,
  getProductsByCategoryService,
  deleteProductByIdService,
};
