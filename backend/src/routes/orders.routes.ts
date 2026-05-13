import { Router } from "express";
import * as middlewares from "../middlewares";
import * as controllers from "../controllers";
const router = Router();

router.get(
  "/admin",
  middlewares.checkUser,
  controllers.getAllOrdersForAdminController,
);
router.post(
  "/",
  middlewares.checkAuth,
  middlewares.checkOrderMiddleware,
  middlewares.transformData,
  controllers.createOrderController,
);
router.get(
  "/my-orders",
  middlewares.checkAuth,
  controllers.getAllOrdersController,
);
router.get(
  "/:order_id",
  middlewares.checkAuth,
  controllers.getSingleOrderController,
);
router.patch(
  "/:order_id",
  middlewares.checkAuth,
  controllers.cancelOrderController,
);

router.patch(
  "/:order_id/status",
  middlewares.checkUser,
  controllers.changeOrderStatusController,
);
export default router;
