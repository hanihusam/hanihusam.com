import * as React from "react";

import { HeroSection } from "@/components/home/hero-section";
import { ProjectSection } from "@/components/home/project-section";
import { SubstackSection } from "@/components/home/substack-section";
import { Spacer } from "@/components/spacer";
import { getContentMdxListItems } from "@/utils/mdx.server";
import { getFeaturedSubstackPosts } from "@/utils/substack.server";

import { type Route } from "./+types/_index";

import { data, type HeadersArgs } from "react-router";

export const handle = { surface: "secondary" as const };

export function headers({ actionHeaders, loaderHeaders }: HeadersArgs) {
  return actionHeaders ? actionHeaders : loaderHeaders;
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [substackPosts, projects] = await Promise.all([
    getFeaturedSubstackPosts(3),
    getContentMdxListItems("projects", { request }),
  ]);

  return data(
    {
      substackPosts,
      projects: projects.slice(0, 4),
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
  const { substackPosts, projects } = loaderData;

  return (
    <React.Fragment>
      <HeroSection />

      <Spacer id="projects" size="lg" />
      <Spacer size="lg" />
      <ProjectSection
        title="Featured Projects"
        subTitle="A bunch of projects that I worked on."
        cta="See more projects"
        posts={projects}
      />
      <Spacer size="lg" />
      <Spacer size="lg" />
      <SubstackSection
        title="Recent Writing"
        subTitle="Find the latest of my writing here."
        cta="Read on Substack"
        posts={substackPosts}
      />
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
