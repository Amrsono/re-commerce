import { PrismaClient } from 'database';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Prisma singleton to prevent connection exhaustion in serverless environments.
 * Uses globalThis to persist the instance across function hot-starts.
 */
const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
