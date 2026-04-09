import { Request, Response } from "express";
import { userRegisterService } from "../services/user.services";
import { hashPassword } from "../utils/passwdHelper";
import { generateToken } from "../utils/jwtHelper";
const registerController = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const data = { fullname, email, password: hashedPassword };
    const resp = await userRegisterService(data);
    const token = generateToken({ id: resp.id, role: resp.role });
    res
      .status(200)
      .json({ message: "User registered successfully", token: token });
  } catch (error:any) {
    if (error.code === "P2002") {
      return res.status(409).json({message:"Email already exist!"})
    }    
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export { registerController };
