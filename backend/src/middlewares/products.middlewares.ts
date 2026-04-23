import { Request, Response, NextFunction } from "express";

const productCreationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body) {
    return res.status(400).json({ message: "Please fill all required fields!" });
  }
  const { name, description, price, quantity, category_id } = req.body;

  if (
    !name?.trim() ||
    !description?.trim() ||
    !category_id?.trim() ||
    price === undefined ||
    quantity === undefined
  ) {
    return res
      .status(400)
      .json({ message: "Please fill all required fields!" });
  }

  if (isNaN(price) || isNaN(quantity)) {
    return res
      .status(400)
      .json({ message: "Price and Quantity must be valid numbers" });
  }
  if (Number(price) <= 0) {
    return res
      .status(400)
      .json({ message: "The price cannot be less than or equal to zero" });
  }
  if (Number(quantity) < 0) {
    return res
      .status(400)
      .json({ message: "The quantity cannot be less than zero" });
  }
  next();
};

const productUpdateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Request Body is empty! please provide data you want to update",
    });
  }
  const { description, name, image, price, quantity, status } = req.body;
  if (!name && !description && !image && !price && !quantity && !status) {
    return res.status(400).json({
      message: "Request body is empty! please provide data you want to update",
    });
  }

  if ((price && isNaN(price)) || (quantity && isNaN(quantity))) {
    return res
      .status(400)
      .json({ message: "Price and Quantity must be valid numbers" });
  }
  if (price && Number(price) <= 0) {
    return res
      .status(400)
      .json({ message: "The price cannot be less than or equal to zero" });
  }
  if (quantity && Number(quantity) < 0) {
    return res
      .status(400)
      .json({ message: "The quantity cannot be less than zero" });
  }
  if (!name.trim() && !description.trim() && !image.trim()) {
    return res.status(400).json({ message: "Value of data cannot be empty!" });
  }
  next();
};

const searchProductMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.query) {
    return res.status(400).json({ message: "Query param is required" });
  }
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Search query is required" });
  }
  next();
};

const productsFilterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sortBy = req.query.sortBy as string;
  const order = (req.query.order as string)?.toLowerCase() ?? "asc";
  if (!sortBy) {
    next();
  }
  if (!order) {
    next();
  }
  if (sortBy.toLowerCase() !== "price") {
    return res
      .status(400)
      .json({ message: "At this time we only have price sorting" });
  }
  if (order.toLowerCase() !== "asc" && order.toLowerCase() !== "desc") {
    return res
      .status(400)
      .json({ message: "order has only 2 possible values. asc || desc" });
  }
  next();
};

export {
  productCreationMiddleware,
  productUpdateMiddleware,
  searchProductMiddleware,
  productsFilterMiddleware,
};
