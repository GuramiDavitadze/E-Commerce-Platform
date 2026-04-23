import prisma from "../config/prisma";
import { UpdateUserType } from "../types/user.types";

const getUserProfileService = async (user_id: string) => {
  return await prisma.user.findUnique({
    where: { id: user_id },
    omit: { password: true },
  });
};
const updateUserService = async (id: string, data: UpdateUserType) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

const updatePasswordService = async (id: string, password: string) => {
  return await prisma.user.update({
    where: { id },
    omit: {
      password: true,
    },
    data: {
      password,
    },
  });
};

const getUserByIdService = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      password: true,
    },
  });
};

const getAllUsersService = async () => {
  return await prisma.user.findMany({
    omit: {
      password: true,
    },
  });
};

const deleteUserByIdService = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
  });
};
export {
  getUserProfileService,
  updateUserService,
  getUserByIdService,
  updatePasswordService,
  getAllUsersService,
  deleteUserByIdService,
};
