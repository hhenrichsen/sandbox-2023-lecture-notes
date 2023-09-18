// eslint-disable-next-line -- need to import the generated code
import { PrismaClient } from "./generated/client";

const globalForPrisma: { prisma?: PrismaClient } = global as unknown as {
  prisma: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// eslint-disable-next-line import/no-default-export -- need to get dev mode working correctly
export default prisma;
