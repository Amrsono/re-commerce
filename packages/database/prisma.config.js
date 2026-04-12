/** @type {import('prisma/config').Config} */
module.exports = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING,
  },
};
