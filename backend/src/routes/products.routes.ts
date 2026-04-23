import { Router } from "express";
import * as middleware from "../middlewares";
import * as controller from "../controllers";
import { upload } from "../config/multer";
const router = Router();

router.post(
  "/",
  middleware.checkUser,
  upload.single("image"),

  middleware.productCreationMiddleware,
  controller.productCreationController,
);

router.post(
  "/many",
  middleware.checkUser,
  upload.single("image"),
  controller.createManyProdcutsController,
);

router.get(
  "/",
  middleware.productsFilterMiddleware,
  controller.getAllProductsController,
);
router.get("/:product_id", controller.getSingleProductController);
router.get(
  "/category/:category_slug",
  controller.getAllProductsByCategoryController,
);

router.get(
  "/search",
  middleware.searchProductMiddleware,
  controller.searchProductController,
);

router.patch(
  "/product/:product_id",
  middleware.checkUser,
  middleware.productUpdateMiddleware,
  controller.updateProductByIdController,
);

router.delete(
  "/product/:product_id",
  middleware.checkUser,
  controller.deleteProductByIdController,
);
export default router;
