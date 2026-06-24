import { BlurrableImage } from "@/components/blurrable-image";
import { AnchorOrLink } from "@/components/links/anchor-or-link";
import { H4, Text } from "@/components/typography";
import { ClipboardCopyButton } from "@/components/ui/clipboard-copy-button";
import { type SubstackPost } from "@/types";
import { getFetchImageBuilder, getImgProps } from "@/utils/images";

import { SubstackLogo } from "./substack-logo";

import { format } from "date-fns";

type ArticleCardProps = {
  post: SubstackPost;
} & React.ComponentPropsWithoutRef<"div">;

function ArticleCard({
  post: { title, url, publishedAt, readingTime, coverImage, coverBlurDataUrl },
  onClick,
}: ArticleCardProps) {
  const dateDisplay = publishedAt
    ? format(new Date(publishedAt), "MMMM dd, yyyy")
    : null;

  return (
    <div className="relative w-full" onClick={onClick}>
      <AnchorOrLink
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group peer relative block w-full focus:outline-none"
      >
        {coverImage ? (
          <BlurrableImage
            key={coverImage}
            blurDataUrl={coverBlurDataUrl}
            className="aspect-3/4 overflow-hidden rounded-xl"
            img={
              <img
                title={title}
                {...getImgProps(getFetchImageBuilder(coverImage, title), {
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
                })}
                className="focus-ring w-full object-cover object-center will-change-transform motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-in-out motion-safe:group-hover:scale-105"
                loading="lazy"
              />
            }
          />
        ) : (
          <div className="flex aspect-3/4 items-center justify-center overflow-hidden rounded-xl bg-(--surface-secondary)">
            <SubstackLogo className="h-16 w-16 text-(--text-overline)" />
          </div>
        )}

        <Text as="p" variant="overline" className="mt-8">
          {[dateDisplay, readingTime?.text ?? "quick read"]
            .filter(Boolean)
            .join(" — ")}
        </Text>
        <H4 className="mt-2">{title}</H4>
      </AnchorOrLink>

      <ClipboardCopyButton value={url} className="absolute top-6 left-6 z-10" />
    </div>
  );
}

export { ArticleCard };
