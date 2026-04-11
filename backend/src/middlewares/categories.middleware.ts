import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

const categoryCreationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export { categoryCreationMiddleware };
