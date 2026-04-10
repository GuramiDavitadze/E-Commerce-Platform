import type { NextFunction, Request, Response } from "express";
import { isEmailValid, isPasswordValid } from "../utils/validators";
const registerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { fullname, email, password } = req.body;
  if (!req.body) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if ( !fullname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (fullname.trim() === "" || email.trim() === "" || password.trim() === "") {
    return res.status(400).json({ message: "Fileds cannot be empty" });
  }
  if (!isEmailValid(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!isPasswordValid(password)) {
    return res.status(400).json({
      message:
        "Password must be 8+ chars include a number, uppercase and lowercase letters",
    });
  }
  next();
};

export { registerMiddleware };
