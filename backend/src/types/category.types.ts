
export type CategoryType = {
  id: string;
  content: string;
  category_slug: string;
};
export type CreateCategoryType = Omit<CategoryType, "id">;
