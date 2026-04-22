import { Request, Response } from "express";
import {
  updateUserService,
  getUserByIdService,
  updatePasswordService,
  getAllUsersService,
  deleteUserByIdService,
  getUserProfileService,
} from "../services";
import { comparePassword, hashPassword } from "../utils/passwdHelper";
type UpdateUserType = {
  fullname?: string;
  image?: string | null;
  isActive?: boolean;
};

const getUserProfileController = async (req: Request, res: Response) => {
  try {
    const id = req.user!.id;
    const resp = await getUserProfileService(id);
    res.status(200).json({ data: resp });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = req.user!.id;
    const image = req.file;
    const imageUrl = image
      ? `data:${image.mimetype};base64,${image.buffer.toString("base64")}`
      : null;
    const { fullname, isActive } = req.body;
    const data: UpdateUserType = {};
    if (fullname !== undefined) data.fullname = fullname;
    if (image !== undefined) data.image = imageUrl;
    if (isActive !== undefined) data.isActive = isActive;
    const resp = updateUserService(id, data);
    res.status(200).json({ message: "User updated successfully", data: resp });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const changePasswordController = async (req: Request, res: Response) => {
  try {
    const id = req.user!.id;
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

const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const resp = await getAllUsersService();
    res.status(200).json({ data: resp });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const resp = await getUserProfileService(user_id as string);
    if (!resp) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({ data: resp });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUserByIdController = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    await deleteUserByIdService(user_id as string);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "User Could not find" });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  getUserProfileController,
  updateUserController,
  changePasswordController,
  getAllUsersController,
  getUserByIdController,
  deleteUserByIdController,
};
