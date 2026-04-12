module.exports = {
  datasource: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
  }
};
