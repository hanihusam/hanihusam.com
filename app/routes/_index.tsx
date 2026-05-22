import * as React from "react";

import { Footer } from "@/components/footer";
import { BlogSection } from "@/components/home/blog-section";
import { HeroSection } from "@/components/home/hero-section";
import LayoutSecondary from "@/components/layout/layout-secondary";
import { Spacer } from "@/components/spacer";
import { getBlogsFeatured } from "@/utils/blog.server";

import { type Route } from "./+types/_index";

import { data, type HeadersArgs } from "react-router";
// import projects from 'contents/projects'

export function headers({ actionHeaders, loaderHeaders }: HeadersArgs) {
  return actionHeaders ? actionHeaders : loaderHeaders;
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const timings = {};

  const featuredPosts = await getBlogsFeatured(
    [
      "my-first-1k-upwork",
      "for-you-who-wants-to-be-freelancer",
      "why-i-become-freelancer",
    ],
    { request, timings },
  );

  return data(
    {
      featuredPosts,
    },
    {
      headers: {
        "Cache-Control": "private, max-age=3600",
        Vary: "Cookie",
      },
    },
  );
};

export default function IndexRoute({ loaderData }: Route.ComponentProps) {
  const { featuredPosts } = loaderData;

  return (
    <React.Fragment>
      <HeroSection />

      <LayoutSecondary>
        <Spacer size="lg" />
        <BlogSection
          title="Recent Writing"
          subTitle="Find the latest of my writing here."
          cta="See more posts"
          posts={featuredPosts}
        />
        <Spacer size="lg" />
        <Footer />
      </LayoutSecondary>
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
