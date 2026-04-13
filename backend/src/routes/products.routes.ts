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
router.get("/:product_id",controller.getSingleProductController)
router.get(
  "/category/:category_slug",
  controller.getAllProductsByCategoryController,
);

router.patch(
  "/:product_id",
  middleware.checkUser,
  middleware.productUpdateMiddleware,
  controller.updateProductByIdController,
);

router.delete(
  "/:product_id",
  middleware.checkUser,
  controller.deleteProductByIdController,
);
export default router;
