import { Router } from "express";
import authRouter from "./auth.routes";
import categoryRouter from "./categories.routes";
import productRouter from "./products.routes";
import userRouter from "./user.routes";
const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/category", categoryRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/user", userRouter);
export { rootRouter };
