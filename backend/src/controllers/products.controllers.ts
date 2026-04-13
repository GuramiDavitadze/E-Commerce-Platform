import { Request, Response } from "express";
import {
  deleteProductByIdService,
  getAllProductsService,
  getProductsByCategoryService,
  productCreationService,
} from "../services";
const productCreationController = async (req: Request, res: Response) => {
  try {
    const { name, description, price, quantity, category_id, status } =
      req.body;
    const { user } = req;

    const data = {
      name,
      description,
      price,
      quantity,
      status,
    };

    const admin_id = user?.id;
    const resp = await productCreationService(data, admin_id, category_id);

    res
      .status(201)
      .json({ message: "Product created successfully", data: resp });
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Category with this id does not exist!" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 30
    const resp = await getAllProductsService(limit);
    res.status(200).json({ data: resp,limit });
  } catch (error: any) {
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
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProductByIdController = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;
    await deleteProductByIdService(product_id as string);
    res
      .status(200)
      .json({ message: "Product Deleted Successfully"});
  } catch (error:any) {
    if (error.code === "P2025") {
      return res.status(404).json({message:`Product Not Found`})
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export {
  productCreationController,
  getAllProductsController,
  getAllProductsByCategoryController,
  deleteProductByIdController,
};
