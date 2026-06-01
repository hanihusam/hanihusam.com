import { BlurrableImage } from "@/components/blurrable-image";
import { H3, Paragraph } from "@/components/typography";
import { ButtonLink } from "@/components/ui/button";
import { type ProjectFrontmatter } from "@/types";
import { clsxm } from "@/utils/clsxm";
import { getImageBuilder, getImgProps } from "@/utils/images";

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
          <li className="size-5 text-(--icon-primary)">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_642_803)">
                <path
                  d="M10.0983 4.55477C9.92302 4.55315 9.74834 4.57558 9.57915 4.62144C9.34748 4.67727 8.99415 4.8981 8.78498 5.10727C8.44331 5.45977 8.37665 5.61477 8.23331 6.33144C8.16665 6.68394 8.57498 7.5231 8.93915 7.77644C9.31415 8.0406 9.84331 8.19477 10.66 8.2831C11.8508 8.41644 12.1933 8.8131 12.1933 10.1139C12.1933 11.2614 11.8725 11.5698 10.56 11.7023C9.13748 11.8456 8.40998 12.3973 8.25581 13.4664C8.16748 14.1173 8.59748 14.9331 9.19331 15.2089C10.5491 15.8489 11.8183 15.0439 12.0825 13.3789C12.2583 12.3089 12.6008 12.0106 13.7475 11.9231C15.0708 11.8123 15.755 11.3606 16.0083 10.4339C16.24 9.58394 15.755 8.63644 14.9275 8.3056C14.7075 8.21727 14.2 8.10727 13.8025 8.0631C12.5566 7.92977 12.2366 7.70977 12.1041 6.90477C11.9166 5.7906 11.84 5.6031 11.4425 5.1631C11.2738 4.97292 11.0669 4.82044 10.8353 4.71561C10.6036 4.61079 10.3525 4.55599 10.0983 4.55477ZM6.11081 8.1881C5.97169 8.18568 5.83274 8.1991 5.69665 8.2281C4.47248 8.4931 3.88831 9.93727 4.57165 10.9739C5.55331 12.4523 7.85831 11.7681 7.87998 9.9931C7.88998 8.99894 7.06331 8.20727 6.11081 8.1881ZM1.74081 11.8248C1.62107 11.8276 1.50189 11.8421 1.38498 11.8681C-0.413353 12.2648 -0.479186 14.8898 1.29665 15.3531C1.73831 15.4739 1.78165 15.4739 2.22248 15.3639C3.21498 15.0989 3.77748 14.1506 3.51331 13.1914C3.28165 12.3414 2.55998 11.8048 1.74081 11.8248ZM18.2608 11.8314C18.0666 11.8331 17.8633 11.8798 17.6075 11.9664C16.4491 12.3639 16.0525 13.7098 16.7908 14.7464C17.255 15.4081 18.4241 15.6281 19.1408 15.1764C20.3208 14.4481 20.2766 12.6289 19.0633 12.0548C18.7466 11.8998 18.5108 11.8289 18.2608 11.8314Z"
                  fill="#46434E"
                />
              </g>
              <defs>
                <clipPath id="clip0_642_803">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </li>
          <li className="size-5 text-(--icon-primary)">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_153_207)">
                <path
                  d="M10.0007 4C7.33407 4 5.6674 5.33333 5.00073 8C6.00073 6.66667 7.1674 6.16667 8.50073 6.5C9.26157 6.69 9.8049 7.24167 10.4074 7.85333C11.3882 8.84833 12.5224 10 15.0007 10C17.6674 10 19.3341 8.66667 20.0007 6C19.0007 7.33333 17.8341 7.83333 16.5007 7.5C15.7399 7.31 15.1966 6.75833 14.5941 6.14667C13.6141 5.15167 12.4799 4 10.0007 4ZM5.00073 10C2.33407 10 0.667399 11.3333 0.000732422 14C1.00073 12.6667 2.1674 12.1667 3.50073 12.5C4.26157 12.69 4.8049 13.2417 5.4074 13.8533C6.38823 14.8483 7.5224 16 10.0007 16C12.6674 16 14.3341 14.6667 15.0007 12C14.0007 13.3333 12.8341 13.8333 11.5007 13.5C10.7399 13.31 10.1966 12.7583 9.59406 12.1467C8.61407 11.1517 7.4799 10 5.00073 10Z"
                  fill="#46434E"
                />
              </g>
              <defs>
                <clipPath id="clip0_153_207">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </li>
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
