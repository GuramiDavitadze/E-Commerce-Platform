import { Request, Response } from "express";
import { createCommentService } from "../services";
const createCommentController = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const id = req?.user?.id;
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

export { createCommentController };
