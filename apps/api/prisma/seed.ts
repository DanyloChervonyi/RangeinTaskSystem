import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.workspace.upsert({
    where: {
      id: "demo-workspace",
    },
    update: {},
    create: {
      id: "demo-workspace",
      name: "Demo workspace",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
