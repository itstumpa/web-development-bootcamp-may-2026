// src/bootstrap/ensureCustomers.ts

import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

import config from "../config";
import { prisma } from "../../lib/prisma";

type SeedCustomer = {
  name: string;
  email?: string;
  password?: string;
};

export const ensureCustomers = async (): Promise<void> => {
  const customers: SeedCustomer[] = [
    {
      name: "Customer One",
      email: config.customer_one_email?.toLowerCase().trim(),
      password: config.customer_one_password,
    },
    {
      name: "Customer Two",
      email: config.customer_two_email?.toLowerCase().trim(),
      password: config.customer_two_password,
    },
    {
      name: "Customer Three",
      email:
        process.env.CUSTOMER_THREE_EMAIL?.toLowerCase().trim(),
      password: process.env.CUSTOMER_THREE_PASSWORD,
    },
    {
      name: "Customer Four",
      email:
        process.env.CUSTOMER_FOUR_EMAIL?.toLowerCase().trim(),
      password: process.env.CUSTOMER_FOUR_PASSWORD,
    },
  ];

  for (const customer of customers) {
    const { name, email, password } = customer;

    if (!email || !password) {
      console.log(`⚠️ Missing credentials for ${name}. Skipping.`);
      continue;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      console.log(`ℹ️ ${name} already exists: ${email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.USER,
        isEmailVerified: true,
      },
    });

    console.log(`✅ ${name} created: ${email}`);
  }
};