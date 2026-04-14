import { Router } from "express";
import userRouter from "./auth.routes";
import categoryRouter from "./categories.routes";
import productRouter from "./products.routes";
const rootRouter = Router();

rootRouter.use("/auth", userRouter);
rootRouter.use("/category", categoryRouter);
rootRouter.use("/product", productRouter);
export { rootRouter };
