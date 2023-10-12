import type { SingleContentMeta } from "../types";

import { prisma } from "./db.server";
import type { CachifiedOptions } from "./mdx";
import { getContentMdxListItems } from "./mdx";

/**
 * Get and order frontmatters by specified array
 */
async function getBlogsFeatured(features: string[], options: CachifiedOptions) {
  const { request, timings } = options;
  const contents = await getContentMdxListItems("blog", { request, timings });
  // override as T because there is no typechecking on the features array
  return features.map((feat) =>
    contents.find((content) => content.slug === feat),
  ) as typeof contents;
}

const getUserLikeCount = async ({
  sessionId,
  slug,
}: {
  sessionId: string;
  slug: string;
}) =>
  await prisma.like.count({
    where: {
      sessionId,
      ContentMeta: {
        slug,
      },
    },
  });

async function getContentViews({
  sessionId,
  slug,
}: {
  sessionId: string;
  slug: string;
}) {
  const content = await prisma.contentMeta.findFirst({
    where: {
      slug,
    },
    include: {
      _count: {
        select: {
          views: true,
          likes: true,
        },
      },
    },
  });

  return {
    contentViews: content?._count.views ?? 0,
    contentLikes: content?._count.likes ?? 0,
    likesByUser: await getUserLikeCount({ sessionId, slug }),
  };
}

async function incrementViews({
  sessionId,
  slug,
}: {
  sessionId: string;
  slug: string;
}) {
  const content = await prisma.contentMeta.upsert({
    where: {
      slug: slug,
    },
    create: {
      slug,
      views: {
        create: {
          sessionId,
        },
      },
    },
    update: {
      views: {
        create: {
          sessionId,
        },
      },
    },
    include: {
      _count: {
        select: {
          views: true,
          likes: true,
        },
      },
    },
  });

  return {
    contentViews: content?._count.views ?? 0,
    contentLikes: content?._count.likes ?? 0,
    likesByUser: await getUserLikeCount({ sessionId, slug }),
  };
}

async function incrementLikes(slug: string) {
  const res = await fetch(`/action/like/${slug}`, { method: "POST" });

  return res.json() as Promise<SingleContentMeta>;
}

export {
  getBlogsFeatured,
  getContentViews,
  getUserLikeCount,
  incrementLikes,
  incrementViews,
};
