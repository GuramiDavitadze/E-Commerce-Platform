import prisma from "../config/prisma";

type ProductType = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: boolean;
};
type UpdateProductType = {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  status?: boolean;
  image?: string;
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

const getAllProductsService = async (limit: number, skip: number) => {
  return await prisma.product.findMany({
    omit: {
      admin_id: true,
      category_id: true,
      update_at: true,
      created_at: true,
    },
    skip,
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

const getSingleProductService = async (product_id:string) => {
  
}

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

const updateProductByIdService = async (
  data: UpdateProductType,
  product_id: string,
) => {
  return await prisma.product.update({
    where: { id: product_id },
    data
  })
};

const deleteProductByIdService = async (product_id: string) => {
  return await prisma.product.delete({
    where: {
      id: product_id,
    },
  });
};

const getCountOfProductsService = async () => {
  return await prisma.product.count();
};
export {
  productCreationService,
  getAllProductsService,
  getProductsByCategoryService,
  deleteProductByIdService,
  getCountOfProductsService,
  updateProductByIdService,
};
