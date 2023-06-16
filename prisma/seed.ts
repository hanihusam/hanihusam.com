import faunadata from "./data/fauna-backup.json";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const data = faunadata as unknown as FaunaMeta[];
  data.forEach(async (datum) => {
    let views;
    let likes;

    new Array(datum.views).forEach(async () => {
      views = await prisma.view.create({
        data: { sessionId: "5db2cdb52c8748af58d9de17ca080e77" },
      });
    });

    Object.entries(datum.likesByUser).flatMap(([sessionId, likeCount]) =>
      new Array(likeCount).forEach(async () => {
        likes = await prisma.like.create({
          data: {
            sessionId,
          },
        });
      })
    );

    await prisma.contentMeta.create({
      data: {
        slug: datum.slug,
        views,
        likes,
      },
    });
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

type FaunaMeta = {
  slug: string;
  views: number;
  likes: number;
  likesByUser: Record<string, number>;
};
