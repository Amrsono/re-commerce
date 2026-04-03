import { PrismaClient, PrismaPg } from 'database';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/recommerce';
const adapter = new PrismaPg({ connectionString }, { schema: 'public' });

// Explicit `any` type annotation avoids TS2742 — the inferred PrismaClient type
// references an internal path from the `database` package that isn't portable.
export const prisma: any = new PrismaClient({ adapter });

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  retryStrategy(times) {
    if (!process.env.REDIS_URL) return null; // Don't retry if no URL configured
    return Math.min(times * 200, 2000);
  },
});
redis.on('error', (err) => {
  if (!process.env.REDIS_URL) {
    console.warn('[Redis] No REDIS_URL provided. Connection will fail (expected if not configured).');
  } else {
    console.warn('[Redis] Connection error:', err.message);
  }
});
