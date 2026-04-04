const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Ensure Admin User exists
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {
      role: 'ADMIN',
      name: 'System Admin',
    },
    create: {
      email: 'admin@test.com',
      name: 'System Admin',
      role: 'ADMIN',
    },
  })

  console.log(`✅ Admin user ensured: ${admin.email}`)
  console.log('✨ Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
