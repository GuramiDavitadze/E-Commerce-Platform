import { Request, Response } from "express";
import * as UserServices from "../services";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/passwdHelper";
import { generateToken } from "../utils/jwtHelper";
const registerController = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password, role } = req.body;
    const image = req.file;
    const imageUrl = image
      ? `data:${image.mimetype};base64,${image.buffer.toString("base64")}`
      : null;
    const hashedPassword = await hashPassword(password);
    const data = {
      fullname,
      email,
      password: hashedPassword,
      image: imageUrl,
      role,
    };
    const resp = await UserServices.userRegisterService(data);
    const token = generateToken({ id: resp.id, role: resp.role });
    res
      .status(201)
      .json({ message: "User registered successfully", token: token });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email already exist!" });
    }
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const resp = await UserServices.userLoginService(email);
    if (!resp) {
      return res.status(400).json({
        message: "Invalid cridentials",
      });
    }

    const isPasswordRight = await comparePassword(password, resp.password);

    if (!isPasswordRight) {
      return res.status(400).json({
        message: "Invalid cridentials",
      });
    }
    const { password: passwd, ...data } = resp;
    const token = jwt.sign(
      { id: resp?.id, role: resp?.role },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successful", data });
  } catch {
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const getMeController = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const data = await UserServices.getMeService(user?.id);
    res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Internal Server error" });
  }
};
const logoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "You loggedout successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
};
export {
  registerController,
  loginController,
  getMeController,
  logoutController,
};
