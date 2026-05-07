import jwt from "jsonwebtoken";
import { Role } from "../../generated/prisma";

type tokenDataTypes = {
  id: string;
  role: Role;
};
export const generateToken = ({ id, role }: tokenDataTypes) => {
  const payload = { id, role };
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(payload, secret);
};
