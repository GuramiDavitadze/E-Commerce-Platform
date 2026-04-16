import { Router } from "express";
import * as middlewares from "../middlewares";
import * as controllers from "../controllers";
const router = Router();

router.post(
  "/",
  middlewares.checkAuth,
  middlewares.checkOrderMiddleware,
  middlewares.transformData,
  controllers.createOrderController,
);

export default router;
