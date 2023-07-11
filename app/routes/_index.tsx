import * as React from "react";

import { AboutSection } from "@/components/home/about-section";
import { BlogSection } from "@/components/home/blog-section";
import { CtaSection } from "@/components/home/cta-section";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesSection } from "@/components/home/services-section";
import { Spacer } from "@/components/spacer";
import type { BlogFrontmatter } from "@/types";
import { getFeatured } from "@/utils/blog.server";
import { getContentMdxListItems } from "@/utils/mdx.server";

import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

type LoaderData = {
  featuredPosts: BlogFrontmatter[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const timings = {};
  const blogs = await getContentMdxListItems("blog", { request, timings });

  const featuredPosts = getFeatured(blogs, [
    "my-first-1000-upwork",
    "2020-retrospective",
    "why-i-become-freelancer",
  ]);

  const data: LoaderData = {
    featuredPosts,
  };

  return json(data, {
    headers: {
      "Cache-Control": "private, max-age=3600",
      Vary: "Cookie",
    },
  });
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <React.Fragment>
      <HeroSection />
      <AboutSection />
      <Spacer size="lg" />
      <ServicesSection />
      <Spacer size="lg" />
      <BlogSection
        title="Find the latest of my writing here"
        subTitle="blog"
        cta="See the full blog"
        posts={data.featuredPosts}
      />
      <Spacer size="lg" />
      <CtaSection />
      <Spacer size="lg" />
    </React.Fragment>
  );
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
