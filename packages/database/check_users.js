const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("USERS:");
  users.forEach(u => console.log(`${u.id} | ${u.email} | ${u.role}`));
}

main().finally(() => prisma.$disconnect());
