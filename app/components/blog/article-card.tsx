import { BlurrableImage } from "@/components/blurrable-image";
import { AnchorOrLink } from "@/components/links/anchor-or-link";
import { H4, Text } from "@/components/typography";
import { ClipboardCopyButton } from "@/components/ui/clipboard-copy-button";
import { type BlogFrontmatter, type InjectedMeta } from "@/types";
import { getImageBuilder, getImgProps } from "@/utils/images";

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
    bannerBlurDataUrl,
  },
  onClick,
}: ArticleCardProps) {
  const dateDisplay = format(
    new Date(lastUpdated ?? publishedAt),
    "MMMM dd, yyyy",
  );

  return (
    <div className="relative w-full" onClick={onClick}>
      <AnchorOrLink
        prefetch="intent"
        className="group peer relative block w-full focus:outline-none"
        href={`/writing/${slug}`}
      >
        <BlurrableImage
          key={bannerCloudinaryId}
          blurDataUrl={bannerBlurDataUrl}
          className="aspect-3/4 rounded-lg"
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
                },
              )}
              className="focus-ring w-full rounded-lg object-cover object-center transition"
              loading="lazy"
            />
          }
        />

        <Text as="p" variant="overline" className="mt-8">
          {[dateDisplay, readingTime?.text ?? "quick read"]
            .filter(Boolean)
            .join(" — ")}
        </Text>
        <H4 className="mt-2">{title}</H4>
      </AnchorOrLink>

      <ClipboardCopyButton
        value={slug}
        className="absolute top-6 left-6 z-10"
      />
    </div>
  );
}

export { ArticleCard };
