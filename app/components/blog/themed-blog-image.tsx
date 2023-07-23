import { Themed } from "@/utils/theme-provider";

import { BlogImage } from "./blog-image";

function ThemedBlogImage({
  darkCloudinaryId,
  lightCloudinaryId,
  imgProps,
  transparentBackground,
}: {
  darkCloudinaryId: string;
  lightCloudinaryId: string;
  imgProps: JSX.IntrinsicElements["img"];
  transparentBackground?: boolean;
}) {
  return (
    <Themed
      light={
        <BlogImage
          cloudinaryId={lightCloudinaryId}
          imgProps={imgProps}
          transparentBackground={transparentBackground}
        />
      }
      dark={
        <BlogImage
          cloudinaryId={darkCloudinaryId}
          imgProps={imgProps}
          transparentBackground={transparentBackground}
        />
      }
    />
  );
}

export { ThemedBlogImage };
