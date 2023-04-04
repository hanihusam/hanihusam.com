import { Grid } from "@/components/grid";
import { Header } from "@/components/header";
import { Spacer } from "@/components/spacer";

export function BlogSection() {
  return (
    <>
      <Header
        title="Find the latest of my writing here"
        subTitle="blog"
        cta="See the full blog"
        ctaUrl="/blog"
      />
      <Spacer size="2xs" />
      <Grid>This is where the blog list belongs</Grid>
    </>
  );
}
