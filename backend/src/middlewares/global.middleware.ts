import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
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
    return res.status(401).json({ message: "Unauthorized, You are admin" });
  }
  next();
};

export { checkUser, checkAuth };
