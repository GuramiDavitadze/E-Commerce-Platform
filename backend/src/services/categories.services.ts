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

export {
  categoryCreationService,
  getAllCategoriesService,
  updateCategoryService,
};
