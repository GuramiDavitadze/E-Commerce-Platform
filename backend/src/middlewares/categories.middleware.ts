import { Request, Response, NextFunction } from "express";

const categoryCreationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body) {
    return res.status(400).json({ message: "Category Content is required!" });
  }
  const { content } = req.body;
  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Category Content is required!" });
  }
  next();
};

const updateCategoryMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: "You need to provide new category content" });
  }
  const { content } = req.body;
  if (!content?.trim()) {
    return res
      .status(400)
      .json({ message: "Category content cannot be empty" });
  }

  
  next();
};

export { categoryCreationMiddleware, updateCategoryMiddleware };
