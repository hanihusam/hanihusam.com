import * as React from "react";

import { BlogTitle } from "@/components/blog/blog-title";
import { BlurrableImage } from "@/components/blurrable-image";
import { Grid } from "@/components/grid";
import { Spacer } from "@/components/spacer";
import type { HeadingScrollSpy } from "@/components/table-of-content";
import TableOfContents from "@/components/table-of-content";
import { H5, H6 } from "@/components/typography";
import { incrementMetaFlag } from "@/constants/env";
import useScrollSpy from "@/hooks/useScrollSpy";
import { getContentViews, incrementViews } from "@/utils/blog.server";
import { getImageBuilder, getImgProps } from "@/utils/images";
import { getMdxPage, useMdxComponent } from "@/utils/mdx";
import { getSessionId } from "@/utils/session.server";
import { getServerTimeHeader } from "@/utils/timing.server";

import {
  ArrowLeftCircleIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import format from "date-fns/format";
import { motion } from "framer-motion";

export async function action({ params, request }: DataFunctionArgs) {
  if (!params.slug) {
    throw new Error("params.slug is not defined");
  }
  const formData = await request.formData();
  const intent = formData.get("intent");
  const sessionId = getSessionId(request);
  switch (intent) {
    case "mark-as-read": {
      const { slug } = params;

      if (!incrementMetaFlag) {
        await incrementViews({ slug, sessionId });

        return json({ success: true });
      }

      return null;
    }
    default: {
      throw new Error(`Unknown intent: ${intent}`);
    }
  }
}

export const loader = async ({ request, params }: DataFunctionArgs) => {
  if (!params.slug) {
    throw new Error("params.slug is not defined");
  }
  const timings = {};
  const sessionId = getSessionId(request);

  const meta = await getContentViews({ slug: params.slug, sessionId });
  const page = await getMdxPage(
    { contentDir: "blog", slug: params.slug },
    { request, timings },
  );
  const headers = {
    "Cache-Control": "private, max-age=3600",
    Vary: "Cookie",
    "Server-Timing": getServerTimeHeader(timings),
  };

  if (!page) {
    throw json(null, { status: 404, headers });
  }

  return json({ page, meta }, { status: 200, headers });
};

function useOnRead({
  parentElRef,
  time,
  onRead,
}: {
  parentElRef: React.RefObject<HTMLElement>;
  time: number | undefined;
  onRead: () => void;
}) {
  React.useEffect(() => {
    const parentEl = parentElRef.current;
    if (!parentEl || !time) return;

    const visibilityEl = document.createElement("div");

    let scrolledTheMain = false;
    const observer = new IntersectionObserver((entries) => {
      const isVisible = entries.some((entry) => {
        return entry.target === visibilityEl && entry.isIntersecting;
      });
      if (isVisible) {
        scrolledTheMain = true;
        maybeMarkAsRead();
        observer.disconnect();
        visibilityEl.remove();
      }
    });

    let startTime = new Date().getTime();
    let timeoutTime = time * 0.6;
    let timerId: ReturnType<typeof setTimeout>;
    let timerFinished = false;
    function startTimer() {
      timerId = setTimeout(() => {
        timerFinished = true;
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        maybeMarkAsRead();
      }, timeoutTime);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        clearTimeout(timerId);
        const timeElapsedSoFar = new Date().getTime() - startTime;
        timeoutTime = timeoutTime - timeElapsedSoFar;
      } else {
        startTime = new Date().getTime();
        startTimer();
      }
    }

    function maybeMarkAsRead() {
      if (timerFinished && scrolledTheMain) {
        cleanup();
        onRead();
      }
    }

    // dirty-up
    parentEl.append(visibilityEl);
    observer.observe(visibilityEl);
    startTimer();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    function cleanup() {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(timerId);
      observer.disconnect();
      visibilityEl.remove();
    }
    return cleanup;
  }, [time, onRead, parentElRef]);
}

export default function Blog() {
  const { page, meta } = useLoaderData<typeof loader>();
  const { frontmatter, code } = page;
  const Component = useMdxComponent(code);
  const dateDisplay = format(
    new Date(frontmatter.lastUpdated ?? frontmatter.publishedAt),
    "MMMM dd, yyyy",
  );
  const markAsRead = useFetcher();
  const markAsReadRef = React.useRef(markAsRead);

  React.useEffect(() => {
    markAsReadRef.current = markAsRead;
  }, [markAsRead]);

  const readMarker = React.useRef<HTMLDivElement>(null);

  useOnRead({
    parentElRef: readMarker,
    time: page.frontmatter.readingTime.time,
    onRead: React.useCallback(() => {
      markAsReadRef.current.submit(
        { intent: "mark-as-read" },
        { method: "POST" },
      );
    }, []),
  });

  //#region  //*=========== Scrollspy ===========
  const activeSection = useScrollSpy();

  const [toc, setToc] = React.useState<HeadingScrollSpy>();
  const minLevel =
    toc?.reduce((min, item) => (item.level < min ? item.level : min), 10) ?? 0;

  React.useEffect(() => {
    const headings = document.querySelectorAll(
      ".prose h1, .prose h2, .prose h3",
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
                      `image-${frontmatter.title}`,
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
                    },
                  )}
                />
              }
            />
          </div>
        </Grid>
      ) : null}

      <Spacer size="xs" />

      <div className="mx-10vw">
        <section className="mx-auto max-w-7xl lg:grid lg:grid-cols-[auto,320px] lg:gap-10">
          <article className="prose prose-light mb-24 w-full break-words dark:prose-dark">
            <Component />
          </article>

          <aside className="py-0">
            <div className="sticky top-24">
              <TableOfContents
                toc={toc}
                minLevel={minLevel}
                activeSection={activeSection}
              />
            </div>
          </aside>
        </section>

        <Spacer size="xs" />

        <div className="flex items-center justify-center space-y-5 flex-col">
          <H6 className="text-black dark:text-light">
            How do you like this article?
          </H6>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="border border-primary-300 hover:border-primary-500 p-2 text-primary-300 hover:text-primary-500 h-12 w-12 rounded-full"
          >
            <HandThumbUpIcon />
          </motion.button>
          <H6>{meta.contentLikes}</H6>
        </div>

        <Spacer size="xs" />
      </div>
    </React.Fragment>
  );
}
