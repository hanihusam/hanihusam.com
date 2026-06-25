import * as React from "react";

import { Grid } from "@/components/grid";
import { ProjectCard } from "@/components/projects/project-card";
import { Spacer } from "@/components/spacer";
import { Paragraph } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { FilterTag } from "@/components/ui/filter-tag";
import { CallToAction } from "@/components/works/call-to-action";
import { WorksHero } from "@/components/works/works-hero";
import { clsxm } from "@/utils/clsxm";
import { getContentMdxListItems } from "@/utils/mdx.server";
import { useUpdateQueryStringValueWithoutNavigation } from "@/utils/misc";
import { getServerTimeHeader } from "@/utils/timing.server";

import { type Route } from "./+types/works._index";

import { PlusIcon } from "@heroicons/react/24/outline";
import { data, type HeadersArgs, useSearchParams } from "react-router";

export function headers({ actionHeaders, loaderHeaders }: HeadersArgs) {
  return actionHeaders ? actionHeaders : loaderHeaders;
}

function toTags(techs: string) {
  return techs
    .split(",")
    .map((tech) => tech.trim().toLowerCase())
    .filter(Boolean);
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const timings = {};
  const projects = await getContentMdxListItems("projects", {
    request,
    timings,
  });

  const tags = new Set<string>();
  for (const project of projects) {
    for (const tag of toTags(project.techs)) {
      tags.add(tag);
    }
  }

  return data(
    { projects, tags: Array.from(tags) },
    {
      headers: {
        "Cache-Control": "private, max-age=3600",
        Vary: "Cookie",
        "Server-Timing": getServerTimeHeader(timings),
      },
    },
  );
};

const PAGE_SIZE = 5;

export default function WorksIndex({ loaderData }: Route.ComponentProps) {
  const { projects, tags } = loaderData;

  const [searchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(
    () => new Set(searchParams.get("tags")?.split(",").filter(Boolean) ?? []),
  );

  useUpdateQueryStringValueWithoutNavigation(
    "tags",
    Array.from(selectedTags).join(","),
  );

  const [indexToShow, setIndexToShow] = React.useState(PAGE_SIZE);
  React.useEffect(() => {
    setIndexToShow(PAGE_SIZE);
  }, [selectedTags]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }

  const matchingProjects = React.useMemo(() => {
    if (selectedTags.size === 0) return projects;
    return projects.filter((project) =>
      toTags(project.techs).some((tag) => selectedTags.has(tag)),
    );
  }, [projects, selectedTags]);

  // Tags that still yield results given the current selection, so we can
  // disable the rest without hiding the user's active picks.
  const visibleTags =
    selectedTags.size === 0
      ? new Set(tags)
      : new Set(matchingProjects.flatMap((project) => toTags(project.techs)));

  const visibleProjects = matchingProjects.slice(0, indexToShow);
  const hasMoreProjects = indexToShow < matchingProjects.length;

  return (
    <React.Fragment>
      <WorksHero />

      <div className="bg-(--surface-secondary)">
        <Spacer size="lg" />

        {tags.length > 0 ? (
          <Grid>
            <div className="col-span-full flex flex-col gap-6">
              <Paragraph prose={false}>Search projects by tags</Paragraph>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => {
                  const selected = selectedTags.has(tag);

                  return (
                    <FilterTag
                      key={tag}
                      tag={tag}
                      selected={selected}
                      onChange={() => toggleTag(tag)}
                      disabled={!visibleTags.has(tag) ? !selected : false}
                    />
                  );
                })}
              </div>
            </div>
          </Grid>
        ) : null}

        <Spacer size="lg" />

        <Grid className="gap-6">
          {visibleProjects.map((project, idx) => (
            <ProjectCard
              key={project.slug}
              className={clsxm("col-span-full", {
                "lg:flex-row-reverse": idx % 2 !== 0,
              })}
              project={project}
            />
          ))}
        </Grid>

        {hasMoreProjects ? (
          <>
            <Spacer size="lg" />
            <Grid>
              <div className="col-span-full flex justify-center">
                <Button
                  variant="ghost"
                  iconLeft={<PlusIcon />}
                  onClick={() => setIndexToShow((i) => i + PAGE_SIZE)}
                >
                  Load more projects
                </Button>
              </div>
            </Grid>
          </>
        ) : null}

        <Spacer size="lg" />
      </div>

      <CallToAction />
    </React.Fragment>
  );
}
