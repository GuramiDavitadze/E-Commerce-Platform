import { Router } from "express";
import * as middlewares from "../middlewares";
const router = Router();

router.post("/", middlewares.checkAuth);

export default router;
