import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import { Role } from "@prisma/client";
import ApiError from "../../../utils/apiErrors";

// CREATE
export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: Role;
}) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? Role.USER,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

// GET ONE
export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) throw new ApiError(404, "User not found");
  return user;
};

// UPDATE
export const updateUser = async (
  id: string,
  data: { name?: string; email?: string }
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, "User not found");

  if (data.email) {
    const emailExists = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: { id },
      },
    });

    if (emailExists) {
      throw new ApiError(409, "Email already in use");
    }
  }

  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

// DELETE
export const deleteUser = async (id: string) => {
  const deleted = await prisma.user.deleteMany({
    where: { id },
  });

  if (deleted.count === 0) {
    throw new ApiError(404, "User not found");
  }

  return { message: "User deleted successfully" };
};