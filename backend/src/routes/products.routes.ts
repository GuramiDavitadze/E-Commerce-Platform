import { Router } from "express";
import * as middleware from "../middlewares";
import * as controller from "../controllers";
const router = Router();

router.post(
  "/",
  middleware.checkUser,
  middleware.productCreationMiddleware,
  controller.productCreationController,
);
router.get("/", controller.getAllProductsController);
router.get("/category/:category_slug", controller.getAllProductsByCategoryController);
export default router;
