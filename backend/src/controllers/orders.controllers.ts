import { Request, Response } from "express";
import {
  createOrderService,
  getAllOrdersForAdminService,
  getAllOrdersService,
} from "../services";
const createOrderController = async (req: Request, res: Response) => {
  try {
    const { products } = req.body;
    const { id } = req.user!;
    const resp = await createOrderService(id, products);

    res.status(201).json({ message: "Order Created Successfully", data: resp });
  } catch (error: any) {
    if (error.code === "P2003") {
      return res.status(404).json({ message: "Product Not Found" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const user_id = user?.id;
    const resp = await getAllOrdersService(user_id);
    res.status(200).json({ data: resp });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllOrdersForAdminController = async (req: Request, res: Response) => {
  try {
    const resp = await getAllOrdersForAdminService();
    res.status(200).json({ data: resp });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createOrderController,
  getAllOrdersController,
  getAllOrdersForAdminController,
};
