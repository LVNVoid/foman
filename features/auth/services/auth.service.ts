import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { RegisterInput } from "../schemas/auth.schema";

export async function registerUserService(data: RegisterInput) {
  const { name, email, password, phoneNumber } = data;

  const exists = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
    select: {
      email: true,
      phoneNumber: true,
    },
  });

  if (exists) {
    if (exists.email === email) {
      throw new Error("Email sudah terdaftar");
    }
    if (exists.phoneNumber === phoneNumber) {
      throw new Error("Nomor telepon sudah terdaftar");
    }
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "CUSTOMER",
      phoneNumber,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return user;
}
