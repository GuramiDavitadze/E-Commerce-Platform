import prisma from "../config/prisma";
import { Role } from "../../generated/prisma";
type user = {
  fullname: string;
  password: string;
  email: string;
  image?: string | undefined;
  role: Role | undefined;
};
export const userRegisterService = async (data: user) => {
  return await prisma.user.create({ data });
};

export const userLoginService = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const getMeService = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });
};
