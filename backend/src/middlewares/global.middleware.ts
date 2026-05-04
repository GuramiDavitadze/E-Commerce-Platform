import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import rateLimit from "express-rate-limit";
const checkUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    const { role } = decoded;

    if (role !== "ADMIN") {
      return res.status(403).json({
        message:
          "Access denied. You do not have the required permissions (Admin).",
      });
    }
  } catch (error: any) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  next();
};

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  if (decoded.role !== "CUSTOMER") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = decoded;
  next();
};

const checkAPISecretKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["secret-api-key"];
  if (!apiKey) {
    return res.status(401).json({ message: "API key is required" });
  }
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "API key is invalid" });
  }
  next();
};

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { message: "Too many requests, please try again later" },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many requests, please try again later" },
});
export { checkUser, checkAuth, checkAPISecretKey, generalLimiter, authLimiter };
