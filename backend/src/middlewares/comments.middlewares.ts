import { Request, Response, NextFunction } from "express";

const createCommentMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body) {
    return res.status(400).json({ message: "Please provide comment body" });
  }

  const { text } = req.body;
  if (!text?.trim()) {
    return res.status(400).json({ message: "Please provide comment body" });
  }
    
  next();
};
export { createCommentMiddleware };
