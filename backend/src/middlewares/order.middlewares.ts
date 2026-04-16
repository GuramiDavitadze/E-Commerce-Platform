import { Request, Response, NextFunction } from "express";
type OrderProductType = {
  product_id: string;
  quantity: number;
  price: number;
};
const checkOrderMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: "You need to provide products you want to order" });
  }

  const { products } = req.body;
  if (!products) {
    return res
      .status(400)
      .json({ message: "You need to provide products you want to order" });
  }
  if (products?.length < 1) {
    return res.status(400).json({ message: "Order data is empty" });
  }
  products.forEach((product: OrderProductType) => {
    if (!product.product_id) {
      return res.status(400).json({ message: "Product id is not provided" });
    } else if (!product.price) {
      return res.status(400).json({ message: "price is not provided" });
    } else if (!Number(product.price)) {
      return res.status(400).json({ message: "Provided data is invalid" });
    }
  });

  next();
};

const transformData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { products } = req.body;
  const productMap: any = {};

  for (const item of products) {
    const id = item.product_id;
    const qty = Math.max(item.quantity || 1, 1);

    if (productMap[id]) {
      productMap[id].quantity += qty;
    } else {
      productMap[id] = { ...item, quantity: qty };
    }
  }

  const productArrays = Object.values(productMap);
  req.body.products = productArrays;
  next();
};
export { checkOrderMiddleware, transformData };
