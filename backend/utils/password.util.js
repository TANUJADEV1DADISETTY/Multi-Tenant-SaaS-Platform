import bcrypt from "bcrypt";

export const hashPassword = (pwd) => bcrypt.hash(pwd, 10);
export const comparePassword = (pwd, hash) => bcrypt.compare(pwd, hash);
