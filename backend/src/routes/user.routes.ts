import express from "express";
import * as UserControler from "../controllers";
import * as UserMiddleware from "../middlewares";

const router = express.Router();

router.post(
  "/register",
  UserMiddleware.registerMiddleware,
  UserControler.registerController,
);

router.post(
  "/login",
  UserMiddleware.loginMiddleware,
  UserControler.loginController,
);

router.get("/me", UserMiddleware.authMiddleware, UserControler.getMeController);
export default router;
