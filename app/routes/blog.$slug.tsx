import * as React from "react";

import { BlogTitle } from "@/components/blog/blog-title";
import { BlurrableImage } from "@/components/blurrable-image";
import { Grid } from "@/components/grid";
import { Spacer } from "@/components/spacer";
import type { HeadingScrollSpy } from "@/components/table-of-content";
import TableOfContents from "@/components/table-of-content";
import { H5 } from "@/components/typography";
import useScrollSpy from "@/hooks/useScrollSpy";
import { getImageBuilder, getImgProps } from "@/utils/images";
import { getMdxPage, useMdxComponent } from "@/utils/mdx";
import { getServerTimeHeader } from "@/utils/timing.server";

import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { Link, useLoaderData } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import format from "date-fns/format";

export const loader = async ({ request, params }: DataFunctionArgs) => {
  if (!params.slug) {
    throw new Error("params.slug is not defined");
  }
  const timings = {};

  const page = await getMdxPage(
    { contentDir: "blog", slug: params.slug },
    { request, timings }
  );
  const headers = {
    "Cache-Control": "private, max-age=3600",
    Vary: "Cookie",
    "Server-Timing": getServerTimeHeader(timings),
  };

  if (!page) {
    throw json(null, { status: 404, headers });
  }

  return json(page, { status: 200, headers });
};

export default function Blog() {
  const data = useLoaderData<typeof loader>();
  const { frontmatter, code } = data;
  const Component = useMdxComponent(code);
  const dateDisplay = format(
    new Date(frontmatter.lastUpdated ?? frontmatter.publishedAt),
    "MMMM dd, yyyy"
  );

  //#region  //*=========== Scrollspy ===========
  const activeSection = useScrollSpy();

  const [toc, setToc] = React.useState<HeadingScrollSpy>();
  const minLevel =
    toc?.reduce((min, item) => (item.level < min ? item.level : min), 10) ?? 0;

  React.useEffect(() => {
    const headings = document.querySelectorAll(
      ".prose h1, .prose h2, .prose h3"
    );

    const headingArr: HeadingScrollSpy = [];
    headings.forEach((heading) => {
      const id = heading.id;
      const level = +heading.tagName.replace("H", "");
      const text = heading.textContent + "";

      headingArr.push({ id, level, text });
    });

    setToc(headingArr);
  }, [frontmatter.slug]);
  //#endregion  //*======== Scrollspy ===========

  return (
    <React.Fragment>
      <Spacer size="xs" />

      <Grid>
        <Link
          className="group col-span-full flex items-center space-x-6"
          to="/blog"
        >
          <ArrowLeftCircleIcon className="h-8 w-8 text-black duration-500 group-hover:-translate-x-1.5 dark:text-light" />
          <H5 className="text-black dark:text-light">Back to overview</H5>
        </Link>
      </Grid>

      <Spacer size="xs" />

      <BlogTitle
        title={frontmatter.title}
        blogInfo={`Written on ${[
          dateDisplay,
          frontmatter.readingTime?.text ?? "quick read",
        ]
          .filter(Boolean)
          .join(" — ")}`}
      />

      <Spacer size="xs" />

      {frontmatter.bannerCloudinaryId ? (
        <Grid>
          <div className="col-span-full mt-10 lg:mt-16">
            <BlurrableImage
              key={frontmatter.bannerCloudinaryId}
              blurDataUrl={frontmatter.bannerBlurDataUrl}
              className="aspect-h-4 aspect-w-3 md:aspect-h-2 md:aspect-w-3"
              img={
                <img
                  key={frontmatter.bannerCloudinaryId}
                  className="rounded-lg object-cover object-center"
                  {...getImgProps(
                    getImageBuilder(
                      frontmatter.bannerCloudinaryId,
                      `image-${frontmatter.title}`
                    ),
                    {
                      widths: [280, 560, 840, 1100, 1650, 2500, 2100, 3100],
                      sizes: [
                        "(max-width:1023px) 80vw",
                        "(min-width:1024px) and (max-width:1620px) 67vw",
                        "1100px",
                      ],
                      transformations: {
                        background: "rgb:e6e9ee",
                      },
                    }
                  )}
                />
              }
            />
          </div>
        </Grid>
      ) : null}

      <Spacer size="xs" />

      <Grid className="lg:grid lg:grid-cols-[auto,320px] lg:gap-10">
        <article className="prose prose-light mb-24 w-full break-words dark:prose-dark">
          <Component />
        </article>

        <aside className="sticky top-36">
          <TableOfContents
            toc={toc}
            minLevel={minLevel}
            activeSection={activeSection}
          />
        </aside>
      </Grid>
    </React.Fragment>
  );
}
