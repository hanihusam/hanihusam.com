import * as React from "react";

import { HeaderSection } from "@/components/blog/header-section";
import { Spacer } from "@/components/spacer";

export default function Blog() {
  return (
    <React.Fragment>
      <HeaderSection
        title="the blog"
        subTitle="Thoughts, story, career, and anything that come from me and my mind"
      />
      <Spacer size="lg" />
    </React.Fragment>
  );
}
