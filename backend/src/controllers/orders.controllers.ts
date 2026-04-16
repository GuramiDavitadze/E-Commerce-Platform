import { Request, Response } from "express";
import { createOrderService } from "../services";
const createOrderController = async (req: Request, res: Response) => {
  try {
    const { products } = req.body;
    const { id } = req.user!;
    const resp = await createOrderService(id, products);

    res.status(201).json({ message: "Order Created Successfully", data: resp });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createOrderController };
