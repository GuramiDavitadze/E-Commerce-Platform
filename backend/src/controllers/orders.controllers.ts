import { Request, Response } from "express";
import {
  cancelOrderService,
  changeOrderStatusService,
  createOrderService,
  getAllOrdersForAdminService,
  getAllOrdersService,
  getSingleOrderService,
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
    const user_id = user!.id;
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
const getSingleOrderController = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.params!;
    const { id } = req.user!;
    const resp = await getSingleOrderService(order_id as string, id);
    res.status(200).json({ data: resp });
  } catch (error: any) {
    if ([404, 403].includes(error.code)) {
      return res.status(error.code).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const cancelOrderController = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.params;
    const { id } = req!.user!;
    const resp = await cancelOrderService(order_id as string, id);
    res
      .status(200)
      .json({ message: "Order Cancelled succesffully!", data: resp });
  } catch (error: any) {
    if ([409, 404, 403].includes(error.code)) {
      return res.status(error.code).json({ message: error.message });
    }
    return res.status(500).json({ meesage: "Internal Server Error" });
  }
};

const changeOrderStatusController = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.params;
    const resp = await changeOrderStatusService(order_id as string);
    res
      .status(200)
      .json({ message: "Status Updated Successfully", data: resp });
  } catch (error: any) {
    if (error.name === "AlreadyDelivered") {
      return res.status(400).json({ message: error.message });
    }
    if (error.name === "NotFound") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createOrderController,
  getAllOrdersController,
  getAllOrdersForAdminController,
  changeOrderStatusController,
  cancelOrderController,
  getSingleOrderController,
};
