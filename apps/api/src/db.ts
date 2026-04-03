// @ts-nocheck
import { PrismaClient, PrismaPg } from 'database';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/recommerce';
const adapter = new PrismaPg({ connectionString }, { schema: 'public' });

export const prisma = new PrismaClient({ adapter });

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
