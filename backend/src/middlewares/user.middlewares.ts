import { Request, Response, NextFunction } from "express";
import { isPasswordValid } from "../utils/validators";

const userUpdateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body && !req.file) {
    return res.status(400).json({ message: "No Data Provided" });
  }

  const { fullname, isActive } = req.body;
  const image = req.file;
  const isIsActiveBoolean = isActive && typeof isActive !== "boolean";
  if (isIsActiveBoolean) {
    return res.status(400).json({ message: "isActive must be boolean" });
  }
  const isBodyProvidedEmpty = !fullname && !image && isActive === undefined;
  if (isBodyProvidedEmpty) {
    return res.status(400).json({ message: "No Data Provided" });
  }
  const isFieldsEmpty = !fullname?.trim() && !image && isActive === undefined;
  if (isFieldsEmpty) {
    return res.status(400).json({ message: "Fields should not be empty" });
  }

  next();
};

const changePasswordMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Passwords must be provided",
    });
  }
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    return res.status(400).json({
      message: "Current and new passwords are required",
    });
  }
  if (!isPasswordValid(newPassword)) {
    return res.status(400).json({
      message:
        "Wrong password format. Password must be 8+ chars include a number, uppercase and lowercase letters",
    });
  }
  if (!isPasswordValid(password)) {
    return res.status(400).json({
      message: "Password is not right",
    });
  }
  if (newPassword === password) {
    return res.status(400).json({
      message: "Old password and new password cannot be same!",
    });
  }
  next();
};

export { userUpdateMiddleware, changePasswordMiddleware };
