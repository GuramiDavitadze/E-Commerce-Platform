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
router.get("/", middlewares.checkAuth, controllers.getAllOrdersController);
router.get(
  "/admin",
  middlewares.checkUser,
  controllers.getAllOrdersForAdminController,
);
export default router;
