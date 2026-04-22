import { Router } from "express";
import * as middlewares from "../middlewares";
import * as controllers from "../controllers";
const router = Router();

router.post(
  "/my-orders",
  middlewares.checkAuth,
  middlewares.checkOrderMiddleware,
  middlewares.transformData,
  controllers.createOrderController,
);
router.get("/my-orders", middlewares.checkAuth, controllers.getAllOrdersController);
router.get(
  "/admin",
  middlewares.checkUser,
  controllers.getAllOrdersForAdminController,
);
router.patch("/:order_id/status",middlewares.checkUser,controllers.changeOrderStatusController)
export default router;
