import express from "express";
import {
  categoryCreationMiddleware,
  checkUser,
  updateCategoryMiddleware,
} from "../middlewares";
import {
  categoryCreationController,
  deleteCategoryController,
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
router.delete("/:category_id", checkUser, deleteCategoryController);
export default router;
