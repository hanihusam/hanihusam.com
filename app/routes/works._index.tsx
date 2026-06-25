import * as React from "react";

import { HeaderSection } from "@/components/blog/header-section";
import { BlurrableImage } from "@/components/blurrable-image";
import { Grid } from "@/components/grid";
import { Spacer } from "@/components/spacer";
import { H3, Paragraph } from "@/components/typography";
import { Tag } from "@/components/ui/tag";
import { clsxm } from "@/utils/clsxm";
import { getImageBuilder, getImgProps } from "@/utils/images";
import { getContentMdxListItems } from "@/utils/mdx.server";
import { getServerTimeHeader } from "@/utils/timing.server";

import { type Route } from "./+types/works._index";

import { data, type HeadersArgs, Link } from "react-router";

export function headers({ actionHeaders, loaderHeaders }: HeadersArgs) {
  return actionHeaders ? actionHeaders : loaderHeaders;
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const timings = {};
  const projects = await getContentMdxListItems("projects", {
    request,
    timings,
  });

  return data(
    { projects },
    {
      headers: {
        "Cache-Control": "private, max-age=3600",
        Vary: "Cookie",
        "Server-Timing": getServerTimeHeader(timings),
      },
    },
  );
};

export default function WorksIndex({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;

  return (
    <React.Fragment>
      <HeaderSection
        title="projects"
        subTitle="A selection of work I've built and shipped."
      />
      <Spacer size="sm" />
      <Grid className="gap-10">
        {projects.map((project, idx) => (
          <Link
            key={project.slug}
            to={`/works/${project.slug}`}
            className={clsxm(
              "group col-span-full flex flex-col gap-4 lg:flex-row lg:gap-8",
              { "lg:flex-row-reverse": idx % 2 !== 0 },
            )}
          >
            <div className="relative aspect-video shrink-0 lg:aspect-square lg:h-72">
              <figure className="pointer-events-none isolate z-1 hidden h-full overflow-hidden rounded-xl lg:block lg:aspect-square">
                <BlurrableImage
                  key={project.bannerCloudinaryId}
                  blurDataUrl={project.bannerBlurDataUrl}
                  className="aspect-square h-full overflow-hidden rounded-xl"
                  img={
                    <img
                      title={project.title}
                      {...getImgProps(
                        getImageBuilder(
                          project.bannerCloudinaryId,
                          `image-${project.title}`,
                        ),
                        {
                          widths: [288, 576],
                          sizes: ["288px"],
                          transformations: {
                            background: "rgb:e6e9ee",
                            resize: { type: "fill", aspectRatio: "1:1" },
                          },
                        },
                      )}
                      className="h-full w-full object-cover object-center will-change-transform motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-in-out motion-safe:group-hover:scale-105"
                      loading="lazy"
                    />
                  }
                />
              </figure>
              <figure className="pointer-events-none isolate z-1 aspect-video overflow-hidden rounded-xl lg:hidden">
                <BlurrableImage
                  key={project.bannerCloudinaryId}
                  blurDataUrl={project.bannerBlurDataUrl}
                  className="aspect-video overflow-hidden rounded-xl"
                  img={
                    <img
                      title={project.title}
                      {...getImgProps(
                        getImageBuilder(
                          project.bannerCloudinaryId,
                          `image-${project.title}`,
                        ),
                        {
                          widths: [280, 560, 840, 1100],
                          sizes: [
                            "(max-width:639px) 80vw",
                            "(min-width:640px) 40vw",
                          ],
                          transformations: {
                            background: "rgb:e6e9ee",
                            resize: { type: "fill", aspectRatio: "16:9" },
                          },
                        },
                      )}
                      className="h-full w-full object-cover object-center will-change-transform motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-in-out motion-safe:group-hover:scale-105"
                      loading="lazy"
                    />
                  }
                />
              </figure>
            </div>

            <div className="grow rounded-xl border border-(--border-primary) p-6 lg:p-8">
              <H3>{project.title}</H3>
              <Paragraph className="mt-4">{project.description}</Paragraph>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.techs
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tech) => (
                    <Tag key={tech} color="secondary">
                      {tech}
                    </Tag>
                  ))}
              </div>
            </div>
          </Link>
        ))}
      </Grid>
      <Spacer size="lg" />
    </React.Fragment>
  );
}
