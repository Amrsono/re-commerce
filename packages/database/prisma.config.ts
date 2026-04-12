import { defineConfig } from "@prisma/config"

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || "postgresql://user:pass@localhost:5432/db"
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts"
  }
})
