import bcrypt from "bcrypt";
export const hashPassword = async (password: string) => {
  const saltRound = 10;
  const hashedPassword = await bcrypt.hash(password, saltRound);
  return hashedPassword;
};

export const comparePassword = (
  plainPassword: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
