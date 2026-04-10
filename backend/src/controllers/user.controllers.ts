import { Request, Response } from "express";
import {
  userLoginService,
  userRegisterService,
} from "../services/user.services";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/passwdHelper";
import { generateToken } from "../utils/jwtHelper";
const registerController = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password, image, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const data = { fullname, email, password: hashedPassword, image, role };
    const resp = await userRegisterService(data);
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
    const resp = await userLoginService(email);
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
  } catch (error: any) {
    console.log(error);
  }
};

const getMeController = async (req: Request, res: Response) => {
  
}

export { registerController, loginController,getMeController };
