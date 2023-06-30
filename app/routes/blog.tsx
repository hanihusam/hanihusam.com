import * as React from "react";

import { ArticleCard } from "@/components/article-card";
import { HeaderSection } from "@/components/blog/header-section";
import { ButtonOutline } from "@/components/button-outline";
import { Grid } from "@/components/grid";
import { Spacer } from "@/components/spacer";
import { getContentMdxListItems } from "@/utils/mdx";
import { getServerTimeHeader } from "@/utils/timing.server";

import { useLoaderData } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

export const loader = async ({ request }: DataFunctionArgs) => {
  const timings = {};
  const blogs = await getContentMdxListItems("blog", { request, timings });

  const tags = new Set<string>();
  for (const blog of blogs) {
    for (const category of blog.tags ?? []) {
      tags.add(category);
    }
  }

  const data = {
    blogs,
    tags: Array.from(tags),
  };

  return json(data, {
    headers: {
      "Cache-Control": "private, max-age=3600",
      Vary: "Cookie",
      "Server-Timing": getServerTimeHeader(timings),
    },
  });
};

// should be divisible by 3 and 2 (large screen, and medium screen).
const PAGE_SIZE = 12;
const initialIndexToShow = PAGE_SIZE;

export default function Blog() {
  const data = useLoaderData<typeof loader>();
  const { blogs } = data;
  const [indexToShow, setIndexToShow] = React.useState(initialIndexToShow);

  const posts = blogs.slice(0, indexToShow);
  const hasMorePosts = indexToShow < posts.length - 1;

  return (
    <React.Fragment>
      <HeaderSection
        title="the blog"
        subTitle="Thoughts, story, career, and anything that come from me and my mind"
      />
      <Spacer size="xs" />
      <Grid className="mb-64 gap-10">
        {posts.map((post) => (
          <div key={post.slug} className="col-span-4">
            <ArticleCard post={post} />
          </div>
        ))}
      </Grid>

      {hasMorePosts ? (
        <div className="mb-64 flex w-full justify-center">
          <ButtonOutline
            variant="secondary"
            onClick={() => setIndexToShow((i) => i + PAGE_SIZE)}
          >
            Load more posts
          </ButtonOutline>
        </div>
      ) : null}
    </React.Fragment>
  );
}
