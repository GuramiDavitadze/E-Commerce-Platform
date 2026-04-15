import prisma from "../config/prisma";
type UpdateUserType = {
  fullname?: string;
  image?: string;
  isActive?: boolean;
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
export { updateUserService, getUserByIdService, updatePasswordService };
