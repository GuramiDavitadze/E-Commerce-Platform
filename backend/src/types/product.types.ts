export type ProductsType = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: boolean;
  category_id: string;
  image?: string | null;
};

export type ProductType = Omit<ProductsType, "category_id">;

export type UpdateProductType = Partial<ProductType>;
