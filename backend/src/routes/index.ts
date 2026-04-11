import { Router } from "express";
import userRouter from "./user.routes";
import categoryRouter from "./categories.routes";
const rootRouter = Router();

rootRouter.use("/auth", userRouter);
// rootRouter.use("/category", categoryRouter);
export { rootRouter };
