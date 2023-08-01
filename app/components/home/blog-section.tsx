import { Grid } from "@/components/grid";
import { Header } from "@/components/header";
import { Spacer } from "@/components/spacer";
import type { BlogFrontmatter, InjectedMeta } from "@/types";
import { clsxm } from "@/utils/clsxm";

import { ArticleCard } from "../blog/article-card";

type Posts = BlogFrontmatter & InjectedMeta;

type BlogSectionProps = {
  title: string;
  subTitle: string;
  cta: string;
  posts: Posts[];
};

export function BlogSection({ title, subTitle, cta, posts }: BlogSectionProps) {
  return (
    <>
      <Header title={title} subTitle={subTitle} cta={cta} ctaUrl="/blog" />
      <Spacer size="2xs" />
      <Grid className="gap-10">
        {posts.map((post, idx) => (
          <div
            key={post.slug}
            className={clsxm("col-span-4", {
              "hidden lg:block": idx >= 2,
            })}
          >
            <ArticleCard post={post} />
          </div>
        ))}
      </Grid>
    </>
  );
}
