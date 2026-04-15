import express from "express";
import {
  categoryCreationMiddleware,
  checkUser,
  updateCategoryMiddleware,
} from "../middlewares";
import {
  categoryCreationController,
  getAllCategoriesController,
  updateCategoryController,
} from "../controllers";

const router = express.Router();

router.post(
  "/",
  checkUser,
  categoryCreationMiddleware,
  categoryCreationController,
);
router.get("/", getAllCategoriesController);

router.patch(
  "/:category_id",
  checkUser,
  updateCategoryMiddleware,
  updateCategoryController,
);
export default router;
