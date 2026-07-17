import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const demoWorkspaceId = "11111111-1111-4111-8111-111111111111";
const demoPassword = "password123";

async function main() {
  const demoPasswordHash = await bcrypt.hash(demoPassword, 12);

  const user = await prisma.user.upsert({
    where: {
      email: "demo@example.com",
    },
    update: {
      passwordHash: demoPasswordHash,
    },
    create: {
      email: "demo@example.com",
      name: "Demo User",
      passwordHash: demoPasswordHash,
    },
  });

  await prisma.workspace.upsert({
    where: {
      id: demoWorkspaceId,
    },
    update: {
      ownerId: user.id,
      members: {
        upsert: {
          where: {
            workspaceId_userId: {
              workspaceId: demoWorkspaceId,
              userId: user.id,
            },
          },
          update: {
            role: "OWNER",
          },
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
    },
    create: {
      id: demoWorkspaceId,
      name: "Demo workspace",
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
      boards: {
        create: [
          {
            name: "Development",
            tasks: {
              create: [
                { title: "Setup project" },
                { title: "Implement auth" },
              ],
            },
          },
          {
            name: "Design",
            tasks: {
              create: [{ title: "Create UI kit" }],
            },
          },
        ],
      },
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
