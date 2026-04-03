import { PrismaClient } from './src';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      tickets: true,
    }
  });

  console.log("=== USERS IN DB ===");
  users.forEach(u => {
      console.log(`User: ${u.name} | Email: ${u.email} | ID: ${u.id}`);
      console.log(`   Tickets: ${u.tickets.map(t => t.id).join(', ')}`);
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
