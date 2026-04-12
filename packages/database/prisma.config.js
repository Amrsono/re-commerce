module.exports = {
  adapter: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
  }
};
