import { Router } from "express";
import * as middlewares from "../middlewares";
import * as controller from "../controllers";
const router = Router();
import { upload } from "../config/multer";
router.get(
  "/profile",
  middlewares.authMiddleware,
  controller.getUserProfileController,
);

router.patch(
  "/profile",
  upload.single("image"),
  middlewares.authMiddleware,
  middlewares.userUpdateMiddleware,
  controller.updateUserController,
);
router.patch(
  "/password",
  middlewares.authMiddleware,
  middlewares.changePasswordMiddleware,
  controller.changePasswordController,
);

router.get("/all", middlewares.checkUser, controller.getAllUsersController);

router.get(
  "/:user_id",
  middlewares.checkUser,
  controller.getUserByIdController,
);
router.delete(
  "/:user_id",
  middlewares.checkUser,
  controller.deleteUserByIdController,
);

export default router;
