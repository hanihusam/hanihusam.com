import * as React from "react";

import { ArticleCard } from "@/components/blog/article-card";
import { HeaderSection } from "@/components/blog/header-section";
import { Tag } from "@/components/blog/tag";
import { Button } from "@/components/button";
import { ButtonOutline } from "@/components/button-outline";
import { Grid } from "@/components/grid";
import { Spacer } from "@/components/spacer";
import { H6 } from "@/components/typography";
import { filterPosts } from "@/utils/blog";
import { getContentMdxListItems } from "@/utils/mdx";
import { useUpdateQueryStringValueWithoutNavigation } from "@/utils/misc";
import { getServerTimeHeader } from "@/utils/timing.server";

import { useLoaderData, useSearchParams } from "@remix-run/react";
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

// temporary special query case
const specialQueryRegex = /(?<not>!)?leader:(?<team>\w+)(\s|$)?/g;

export default function BlogIndex() {
  const data = useLoaderData<typeof loader>();
  const { blogs: allPosts, tags } = data;

  const [searchParams] = useSearchParams();
  const [queryValue, setQuery] = React.useState<string>(
    () => searchParams.get("q") ?? ""
  );
  const query = queryValue.trim();

  useUpdateQueryStringValueWithoutNavigation("q", query);

  const [indexToShow, setIndexToShow] = React.useState(initialIndexToShow);
  // when the query changes, we want to reset the index
  React.useEffect(() => {
    setIndexToShow(initialIndexToShow);
  }, [query]);

  const visibleTags = new Set(tags);
  const regularQuery = query.replace(specialQueryRegex, "").trim();

  const matchingPosts = React.useMemo(() => {
    let filteredPosts = allPosts;

    return filterPosts(filteredPosts, regularQuery);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPosts, query, regularQuery]);

  const hasMorePosts = indexToShow < matchingPosts.length - 1;
  const posts = matchingPosts.slice(0, indexToShow);

  function toggleTag(tag: string) {
    setQuery((q) => {
      // create a regexp so that we can replace multiple occurrences (`react node react`)
      const expression = new RegExp(tag, "ig");

      const newQuery = expression.test(q)
        ? q.replace(expression, "")
        : `${q} ${tag}`;

      // trim and remove subsequent spaces (`react   node ` => `react node`)
      return newQuery.replace(/\s+/g, " ").trim();
    });
  }

  return (
    <React.Fragment>
      <HeaderSection
        title="the blog"
        subTitle="Thoughts, story, career, and anything that come from me and my mind"
      />
      <Spacer size="2xs" />
      {tags.length > 0 ? (
        <div
          className="text-gray-600 dark:text-gray-300 mt-2 flex flex-wrap items-baseline justify-start gap-2 text-sm"
          data-fade="3"
        >
          <H6 as="div">Choose topic:</H6>

          {tags.map((tag) => {
            const selected = regularQuery.includes(tag);
            return (
              <Tag
                key={tag}
                tag={tag}
                selected={selected}
                onClick={() => toggleTag(tag)}
                disabled={!visibleTags.has(tag) ? !selected : false}
              />
            );
          })}
        </div>
      ) : null}
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
            className="dark:hidden"
            variant="secondary"
            onClick={() => setIndexToShow((i) => i + PAGE_SIZE)}
          >
            Load more posts
          </ButtonOutline>
          <Button
            className="hidden dark:flex"
            variant="secondary"
            onClick={() => setIndexToShow((i) => i + PAGE_SIZE)}
          >
            Load more posts
          </Button>
        </div>
      ) : null}
    </React.Fragment>
  );
}
