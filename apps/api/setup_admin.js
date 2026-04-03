const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@test.com',
      name: 'System Admin',
      role: 'ADMIN',
    },
  });
  console.log("Admin user secured:", admin.id);
}

main().finally(() => prisma.$disconnect());
