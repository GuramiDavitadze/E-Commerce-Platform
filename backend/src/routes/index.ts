import { Router } from "express";
import authRouter from "./auth.routes";
import categoryRouter from "./categories.routes";
import productRouter from "./products.routes";
import userRouter from "./user.routes";
import orderRouter from "./orders.routes";
import commentRouter from "./comments.routes";
const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/category", categoryRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/orders", orderRouter);
rootRouter.use("/comments", commentRouter);
export { rootRouter };
