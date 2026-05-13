import { Request, Response } from "express";
import {
  changeCommentTextService,
  createCommentService,
  deleteCommentByIdService,
  getAllCommentsByProductIdService,
} from "../services";
const createCommentController = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const id = req.user!.id;
    const { product_id } = req.params;
    const resp = await createCommentService(text, id, product_id as string);
    res
      .status(201)
      .json({ message: "Comment Created Successfully", data: resp });
  } catch (error: any) {
    if (error.name === "NotPurchased") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getAllCommentsByProductIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { product_id } = req.params;
    const resp = await getAllCommentsByProductIdService(product_id as string);
    res.status(200).json({ data: resp });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const changeCommentTextController = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const id = req.user!.id;
    const comment_id = req.params?.comment_id as string;
    const resp = await changeCommentTextService(id, comment_id, text);
    res
      .status(200)
      .json({ message: "Comment Changed Successfully!", data: resp });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Comment Not Found" });
    }
    if (error?.name === "Unauthorized") {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCommentByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.user!.id;
    const role = req.user!.role;
    const { comment_id } = req.params;
    await deleteCommentByIdService(id, comment_id as string, role);
    res.status(200).json({ message: "Comment Deleted Successfully!" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Comment Not Found" });
    }
    if (error.name === "Unauthorized") {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export {
  createCommentController,
  getAllCommentsByProductIdController,
  changeCommentTextController,
  deleteCommentByIdController,
};
