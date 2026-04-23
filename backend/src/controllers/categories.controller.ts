import { Request, Response } from "express";
import {
  categoryCreationService,
  deleteCategoryService,
  getAllCategoriesService,
  updateCategoryService,
} from "../services";
import { CategoryType } from "../types/category.types";
const categoryCreationController = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const category_slug = content.toLowerCase().trim().split(" ").join("_");
    const data = {
      content,
      category_slug,
    };
    const resp = await categoryCreationService(data);

    res
      .status(201)
      .json({ message: "Category Created Successfully!", data: resp });
  } catch (error: any) {
    if (error.code === "P2002")
      return res.status(409).json({ message: "Category already exist!" });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllCategoriesController = async (req: Request, res: Response) => {
  try {
    const resp = await getAllCategoriesService();
    res.status(200).json({ data: resp });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const content = req.body.content as string;
    const { category_id } = req.params;
    const data: CategoryType = {
      id: category_id as string,
      content,
      category_slug: content.toLowerCase().trim().split(" ").join("_"),
    };
    const resp = await updateCategoryService(data);
    res
      .status(200)
      .json({ message: "Category Updated Successfully", data: resp });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Product Not Founded" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const { category_id } = req.params;
    await deleteCategoryService(category_id as string);
    res.status(200).json({ message: "Category Deleted Successfully!" });
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "Category Not Found" });
    if (!error.code) return res.status(400).json({ message: error.message });

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export {
  categoryCreationController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
};
