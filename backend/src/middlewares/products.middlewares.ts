import { Request, Response, NextFunction } from "express";

const productCreationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body) {
    res.status(400).json({ message: "Please fill all required fields!" });
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
    return res
      .status(400)
      .json({
        message:
          "Request body is empty! please provide data you want to update",
      });
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
  if (!name.trim() && !description.trim() && !image.trim()) {
    return res.status(400).json({message:"Value of data cannot be empty!"})
  }
  next();
};
export { productCreationMiddleware, productUpdateMiddleware };
