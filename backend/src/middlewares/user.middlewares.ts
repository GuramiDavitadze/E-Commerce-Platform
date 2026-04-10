import type { NextFunction, Request, Response } from "express";
import { isEmailValid, isPasswordValid } from "../utils/validators";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
const registerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { fullname, email, password } = req.body;
  if (!req.body) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!fullname || !email || !password) {
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

const loginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }
  if (!isEmailValid(email) || !isPasswordValid(password)) {
    return res.status(400).json({
      message: "Invalid cridentials",
    });
  }
  next();
};

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as JwtPayload;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export { registerMiddleware, loginMiddleware };
