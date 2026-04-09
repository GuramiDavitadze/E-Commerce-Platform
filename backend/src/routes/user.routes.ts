import express from "express";
import { registerController } from "../controllers/user.controllers";
import { registerMiddleware } from "../middlewares/user.middlewares";

const router = express.Router();

router.get("/auth/register", registerMiddleware, registerController);

export default router;
