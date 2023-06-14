import type { BlogFrontmatter, InjectedMeta } from "@/types";
import {
  getImageBuilder,
  getImgProps,
  useImageBlurDataUrl,
} from "@/utils/images";

import { BlurrableImage } from "./blurrable-image";
import { H4, H6 } from "./typography";

import { Link } from "@remix-run/react";
import { format } from "date-fns";

type ArticleCardProps = {
  post: BlogFrontmatter & InjectedMeta;
} & React.ComponentPropsWithoutRef<"div">;

function ArticleCard({
  post: {
    title,
    lastUpdated,
    publishedAt,
    readingTime,
    slug,
    bannerCloudinaryId,
  },
  onClick,
}: ArticleCardProps) {
  const dateDisplay = format(
    new Date(lastUpdated ?? publishedAt),
    "MMMM dd, yyyy"
  );
  const bannerBlurDataUrl = useImageBlurDataUrl(bannerCloudinaryId);

  return (
    <div className="relative w-full" onClick={onClick}>
      <Link
        prefetch="intent"
        className="group peer relative block w-full focus:outline-none"
        to={`/blog/${slug}`}
      >
        <BlurrableImage
          key={bannerCloudinaryId}
          blurDataUrl={bannerBlurDataUrl}
          className="aspect-h-4 aspect-w-3 rounded-lg"
          img={
            <img
              title={title}
              {...getImgProps(
                getImageBuilder(bannerCloudinaryId, `image-${title}`),
                {
                  widths: [280, 560, 840, 1100, 1300, 1650],
                  sizes: [
                    "(max-width:639px) 80vw",
                    "(min-width:640px) and (max-width:1023px) 40vw",
                    "(min-width:1024px) and (max-width:1620px) 25vw",
                    "420px",
                  ],
                  transformations: {
                    background: "rgb:e6e9ee",
                    resize: {
                      type: "fill",
                      aspectRatio: "3:4",
                    },
                  },
                }
              )}
              className="focus-ring w-full rounded-lg object-cover object-center transition"
              loading="lazy"
            />
          }
        />

        <H6 className="mt-8 text-accent">
          {[dateDisplay, readingTime?.text ?? "quick read"]
            .filter(Boolean)
            .join(" — ")}
        </H6>
        <H4 as="div" variant="secondary" className="mt-2">
          {title}
        </H4>
      </Link>
    </div>
  );
}

export { ArticleCard };
