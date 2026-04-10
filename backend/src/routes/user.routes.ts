import express from "express";
import {
  getMeController,
  loginController,
  registerController,
} from "../controllers/user.controllers";
import {
  loginMiddleware,
  registerMiddleware,
} from "../middlewares/user.middlewares";

const router = express.Router();

router.post("/auth/register", registerMiddleware, registerController);
router.post("/auth/login", loginMiddleware, loginController);
router.get("/auth/me", getMeController);
export default router;
