// Optional dotenv — not needed on Render where env vars are injected by the platform
try { require("dotenv/config"); } catch (_) {}

module.exports = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};