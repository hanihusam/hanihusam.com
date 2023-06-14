import { Grid } from "@/components/grid";
import { Header } from "@/components/header";
import { Spacer } from "@/components/spacer";
import type { BlogFrontmatter, InjectedMeta } from "@/types";

import { ArticleCard } from "../article-card";

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
      <Grid>
        <div className="col-span-full flex gap-10">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </Grid>
    </>
  );
}
