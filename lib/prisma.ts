import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton Prisma client instance
export const prisma = globalThis.prisma || new PrismaClient();

// In development, we want to preserve the connection between HMR
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
