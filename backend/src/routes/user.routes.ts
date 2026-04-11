import express from "express";
import {
  getMeController,
  loginController,
  registerController,
} from "../controllers/user.controllers";
import {
    authMiddleware,
  loginMiddleware,
  registerMiddleware,
} from "../middlewares/user.middlewares";

const router = express.Router();

router.post("/register", registerMiddleware, registerController);
router.post("/login", loginMiddleware, loginController);
router.get("/me", authMiddleware, getMeController);
export default router;
