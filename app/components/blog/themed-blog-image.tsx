import { Themed } from "@/utils/theme-provider";

import { CloudinaryImg } from "./cloudinary-img";

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
        <CloudinaryImg
          cloudinaryId={lightCloudinaryId}
          imgProps={imgProps}
          transparentBackground={transparentBackground}
        />
      }
      dark={
        <CloudinaryImg
          cloudinaryId={darkCloudinaryId}
          imgProps={imgProps}
          transparentBackground={transparentBackground}
        />
      }
    />
  );
}

export { ThemedBlogImage };
