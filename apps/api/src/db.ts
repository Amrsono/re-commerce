import { PrismaClient, PrismaPg } from 'database';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/recommerce';
const adapter = new PrismaPg({ connectionString }, { schema: 'public' });

// Explicit `any` type annotation avoids TS2742 — the inferred PrismaClient type
// references an internal path from the `database` package that isn't portable.
export const prisma: any = new PrismaClient({ adapter });
