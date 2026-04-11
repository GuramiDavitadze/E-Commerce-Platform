import express from "express";
import { categoryCreationMiddleware, checkUser } from "../middlewares";
import {
  categoryCreationController,
  getAllCategoriesController,
} from "../controllers";

const router = express.Router();

router.post(
  "/",
  checkUser,
  categoryCreationMiddleware,
  categoryCreationController,
);
router.get("/", getAllCategoriesController);
export default router;
