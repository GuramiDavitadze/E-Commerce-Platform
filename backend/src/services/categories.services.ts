import prisma from "../config/prisma";
import { CreateCategoryType, CategoryType } from "../types/category.types";

const categoryCreationService = async (data: CreateCategoryType) => {
  return await prisma.category.create({
    data,
  });
};

const getAllCategoriesService = async () => {
  return await prisma.category.findMany();
};

const updateCategoryService = async (data: CategoryType) => {
  return await prisma.category.update({
    where: { id: data.id },
    data: {
      content: data.content,
      category_slug: data.category_slug,
    },
  });
};

const deleteCategoryService = async (category_id: string) => {
  const products = await prisma.product.count({
    where: { category_id },
  });
  if (products > 0) {
    throw new Error("Cannot delete category with existing products");
  }
  return await prisma.category.delete({
    where: { id: category_id },
  });
};

export {
  categoryCreationService,
  getAllCategoriesService,
  updateCategoryService,
  deleteCategoryService,
};
