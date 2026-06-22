import { BlurrableImage } from "@/components/blurrable-image";
import { H3, Paragraph } from "@/components/typography";
import { ButtonLink } from "@/components/ui/button";
import { type ProjectFrontmatter } from "@/types";
import { clsxm } from "@/utils/clsxm";
import { getImageBuilder, getImgProps } from "@/utils/images";

import { TechIcon } from "./tech-icon";

import { ArrowRightCircleIcon, LinkIcon } from "@heroicons/react/24/outline";

type ProjectCardProps = {
  project: ProjectFrontmatter;
} & React.ComponentPropsWithoutRef<"div">;

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <div
      className={clsxm("flex flex-col gap-4 lg:flex-row lg:gap-8", className)}
    >
      <div className="relative aspect-video shrink-0 lg:aspect-square lg:h-full">
        <figure className="pointer-events-none isolate z-1 hidden h-full overflow-hidden rounded-xl lg:block lg:aspect-square">
          <BlurrableImage
            key={project.bannerCloudinaryId}
            blurDataUrl={project.bannerBlurDataUrl}
            className="aspect-square overflow-hidden rounded-xl"
            img={
              <img
                title={project.title}
                {...getImgProps(
                  getImageBuilder(
                    project.bannerCloudinaryId,
                    `image-${project.title}`,
                  ),
                  {
                    widths: [284, 568],
                    sizes: ["284px"],
                    transformations: {
                      background: "rgb:e6e9ee",
                      resize: {
                        type: "fill",
                        aspectRatio: "1:1",
                      },
                    },
                  },
                )}
                className="focus-ring w-full object-cover object-center will-change-transform motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-in-out motion-safe:group-hover:scale-105"
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
                    sizes: ["(max-width:639px) 80vw", "(min-width:640px) 40vw"],
                    transformations: {
                      background: "rgb:e6e9ee",
                      resize: {
                        type: "fill",
                        aspectRatio: "16:9",
                      },
                    },
                  },
                )}
                className="focus-ring w-full object-cover object-center will-change-transform motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-in-out motion-safe:group-hover:scale-105"
                loading="lazy"
              />
            }
          />
        </figure>
      </div>
      <div className="grow rounded-xl border border-(--border-primary) p-6 lg:p-8">
        <H3>{project.title}</H3>
        <Paragraph className="mt-6">{project.description}</Paragraph>
        <ul className="mt-6 flex items-center gap-2">
          {project.techs.split(",").map((tech) => (
            <TechIcon key={tech.trim()} tech={tech} />
          ))}
        </ul>
        <div className="mt-10 flex w-full flex-wrap items-center justify-between gap-4">
          <ButtonLink
            to={`/projects/${project.slug}`}
            iconRight={<ArrowRightCircleIcon />}
          >
            View Project
          </ButtonLink>
          <div className="flex items-center gap-4">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-base leading-(--paragraph-leading) text-(--text-paragraph) transition-colors hover:text-(--text-link)"
            >
              <LinkIcon className="size-4" />
              Open Live Site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
