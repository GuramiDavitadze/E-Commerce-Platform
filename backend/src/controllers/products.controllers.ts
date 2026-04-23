import { Request, Response } from "express";
import {
  createManyProductsService,
  deleteProductByIdService,
  getAllProductsService,
  getCountOfProductsService,
  getProductsByCategoryService,
  getSingleProductService,
  productCreationService,
  searchProductService,
  updateProductByIdService,
} from "../services";
import {
  UpdateProductType,
  ProductType,
  ProductsType,
} from "../types/product.types";

const productCreationController = async (req: Request, res: Response) => {
  try {
    const { name, description, price, quantity, category_id, status } =
      req.body;
    const image = req.file;
    const imageUrl = image
      ? `data:${image.mimetype};base64,${image.buffer.toString("base64")}`
      : null;
    const { user } = req;

    const data = {
      name,
      description,
      price,
      quantity,
      status,
      image: imageUrl,
    };

    const admin_id = user?.id;
    const resp = await productCreationService(data, admin_id, category_id);

    res
      .status(201)
      .json({ message: "Product created successfully", data: resp });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Category with this id does not exist!" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const createManyProdcutsController = async (req: Request, res: Response) => {
  try {
    let products: ProductsType[] = Object.values(req.body);

    const { user } = req;
    const admin_id = user?.id;

    const resp = await createManyProductsService(products, admin_id);
    res
      .status(201)
      .json({ message: "Products Created Successfully", data: resp });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 30;
    const skip = Number(req.query.skip) || 0;
    const order = (req.query.order as string) || "asc";
    const [products, totalCount] = await Promise.all([
      getAllProductsService(limit, skip, order),
      getCountOfProductsService(),
    ]);
    res.status(200).json({ data: products, limit, total: totalCount, skip });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getSingleProductController = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;
    const resp = await getSingleProductService(product_id as string);
    if (!resp) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    res.status(200).json({ data: resp });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Product Not Found" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getAllProductsByCategoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { category_slug } = req.params;
    const resp = await getProductsByCategoryService(category_slug as string);
    if (resp.length === 0) {
      return res.status(404).json({
        message: `Products on category '${category_slug}' was not found`,
      });
    }
    res.status(200).json({ data: resp });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProductByIdController = async (req: Request, res: Response) => {
  try {
    const { description, name, quantity, status, price } = req.body;
    const image = req.file;
    const imageUrl = image
      ? `data:${image.mimetype};base64,${image.buffer.toString("base64")}`
      : null;
    const { product_id } = req.params;
    const data: UpdateProductType = {};
    if (name !== undefined) data.name = name;
    if (image !== undefined) data.image = imageUrl;
    if (quantity !== undefined) data.quantity = quantity;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;
    if (price !== undefined) data.price = status;
    const resp = await updateProductByIdService(data, product_id as string);
    res
      .status(200)
      .json({ message: "Product updated successfully", data: resp });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Product Not Found" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProductByIdController = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;
    await deleteProductByIdService(product_id as string);
    res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: `Product Not Found` });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchProductController = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    const resp = await searchProductService(q as string);
    res.status(200).json({ data: resp });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  productCreationController,
  getAllProductsController,
  getSingleProductController,
  getAllProductsByCategoryController,
  updateProductByIdController,
  deleteProductByIdController,
  searchProductController,
  createManyProdcutsController,
};
