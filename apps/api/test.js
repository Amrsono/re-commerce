require('ts-node').register({ transpileOnly: true });
const { prisma } = require('./src/db.ts');

const data = {brand:"Apple",model:"iPhone 14 Pro",specs:{storage:"128GB"},condition:"Good",userId:"test-user-123"};

async function test() {
  try {
    const device = await prisma.device.create({ data });
    console.log("Device:", device);
  } catch (e) {
    console.error("PRISMA ERROR:", e);
  }
}
test();
