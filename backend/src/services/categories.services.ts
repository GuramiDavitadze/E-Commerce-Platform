import prisma from "../config/prisma";
type CategorDataType = {
  content: string;
  category_slug: string;
};
const categoryCreationService = async (data: CategorDataType) => {
  return await prisma.category.create({
    data,
  });
};

const getAllCategoriesService = async () => {
  return await prisma.category.findMany();
};
type UpdateCategoryType = {
  id: string;
  content: string;
  slug: string;
};
const updateCategoryService = async (data: UpdateCategoryType) => {
  return await prisma.category.update({
    where: { id: data.id },
    data: {
      content: data.content,
      category_slug: data.slug,
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
