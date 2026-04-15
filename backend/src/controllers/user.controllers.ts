import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  updateUserService,
  getUserByIdService,
  updatePasswordService,
} from "../services";
import { comparePassword, hashPassword } from "../utils/passwdHelper";
type UpdateUserType = {
  fullname?: string;
  image?: string;
  isActive?: boolean;
};
const updateUserController = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const { id } = decoded;
    const { fullname, image, isActive } = req.body;
    const data: UpdateUserType = {};
    if (fullname !== undefined) data.fullname = fullname;
    if (image !== undefined) data.image = image;
    if (isActive !== undefined) data.isActive = isActive;
    const resp = updateUserService(id, data);
    res.status(200).json({ message: "User updated successfully", data: resp });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const changePasswordController = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const { id } = decoded;
    const { password, newPassword } = req.body;
    const user = await getUserByIdService(id);
    const isPasswordRight = await comparePassword(password, user?.password!);
    if (isPasswordRight) {
      const hashedPassword = await hashPassword(newPassword);
      const resp = await updatePasswordService(id, hashedPassword);
      return res
        .status(200)
        .json({ message: "Password Updated Successfully", data: resp });
    } else {
      return res.status(400).json({ message: "Password is not right" });
    }
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export { updateUserController, changePasswordController };
