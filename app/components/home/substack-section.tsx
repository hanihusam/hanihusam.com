import { Grid } from "@/components/grid";
import { Header } from "@/components/header";
import { Spacer } from "@/components/spacer";
import { H4, Text } from "@/components/typography";
import { ClipboardCopyButton } from "@/components/ui/clipboard-copy-button";
import { clsxm } from "@/utils/clsxm";
import { type SubstackPost } from "@/utils/substack.server";

import { format } from "date-fns";

function SubstackCard({ post }: { post: SubstackPost }) {
  const dateDisplay = post.publishedAt
    ? format(new Date(post.publishedAt), "MMMM dd, yyyy")
    : null;

  return (
    <div className="relative w-full">
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group peer relative block w-full focus:outline-none"
      >
        <div className="aspect-3/4 overflow-hidden rounded-xl bg-(--surface-secondary)">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover object-center will-change-transform motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-in-out motion-safe:group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <SubstackLogo className="h-16 w-16 text-(--text-overline)" />
            </div>
          )}
        </div>

        {dateDisplay ? (
          <Text as="p" variant="overline" className="mt-8">
            {dateDisplay}
          </Text>
        ) : null}
        <H4 className="mt-2">{post.title}</H4>
        {post.excerpt ? (
          <Text as="p" variant="caption" className="mt-2 line-clamp-3">
            {post.excerpt}
          </Text>
        ) : null}
      </a>

      <ClipboardCopyButton
        value={post.url}
        className="absolute top-6 left-6 z-10"
      />
    </div>
  );
}

function SubstackLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22.539 8.242H1.46V5.406h21.079V8.242zM1.46 10.812V13.68h21.079v-2.868H1.46zM1.46 16.476v7.341l10.54-4.579 10.54 4.579v-7.341H1.46z" />
    </svg>
  );
}

type SubstackSectionProps = {
  title: string;
  subTitle: string;
  cta: string;
  posts: SubstackPost[];
};

export function SubstackSection({
  title,
  subTitle,
  cta,
  posts,
}: SubstackSectionProps) {
  if (posts.length === 0) return null;

  return (
    <>
      <Header
        title={title}
        subTitle={subTitle}
        cta={cta}
        ctaUrl="https://bapak2dev.substack.com"
      />
      <Spacer size="lg" />
      <Grid className="gap-6">
        {posts.map((post, idx) => (
          <div
            key={post.url}
            className={clsxm("col-span-4", {
              "hidden lg:block": idx >= 2,
            })}
          >
            <SubstackCard post={post} />
          </div>
        ))}
      </Grid>
      <Spacer size="lg" />
    </>
  );
}
