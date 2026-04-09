import prisma from "../config/prisma";
type user = {
  fullname: string;
  password: string;
  email: string;
};
export const userRegisterService = async (data: user) => {
  return await prisma.user.create({ data });
};
