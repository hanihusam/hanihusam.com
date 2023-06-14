import { useEffect, useState } from "react";

import { toErrorWithMessage } from "@/utils/helpers";

import type { TransformerOption } from "@cld-apis/types";
import { buildImageUrl, setConfig } from "cloudinary-build-url";

type ImageBuilder = {
  (transformations?: TransformerOption): string;
  alt: string;
  id: string;
};

const cloudName = "hanihusam";

setConfig({
  cloudName,
});

function getImageBuilder(id: string, alt: string = ""): ImageBuilder {
  function imageBuilder(transformations?: TransformerOption) {
    return buildImageUrl(id, { transformations });
  }
  imageBuilder.alt = alt;
  imageBuilder.id = id;
  return imageBuilder;
}

function getImgProps(
  imageBuilder: ImageBuilder,
  {
    widths,
    sizes,
    transformations,
  }: {
    widths: Array<number>;
    sizes: Array<string>;
    transformations?: TransformerOption;
  }
) {
  const averageSize = Math.ceil(widths.reduce((a, s) => a + s) / widths.length);

  return {
    alt: imageBuilder.alt,
    src: imageBuilder({
      quality: "auto",
      format: "auto",
      ...transformations,
      resize: { width: averageSize, ...transformations?.resize },
    }),
    srcSet: widths
      .map((width) =>
        [
          imageBuilder({
            quality: "auto",
            format: "auto",
            ...transformations,
            resize: { width, ...transformations?.resize },
          }),
          `${width}w`,
        ].join(" ")
      )
      .join(", "),
    sizes: sizes.join(", "),
  };
}

async function getBlurDataUrl(cloudinaryId: string) {
  const imageURL = buildImageUrl(cloudinaryId, {
    transformations: {
      resize: { width: 100 },
      quality: "auto",
      format: "webp",
      effect: {
        name: "blur",
        value: "1000",
      },
    },
  });
  const dataUrl = await getDataUrlForImage(imageURL);
  return dataUrl;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i] as number);
  }
  return window.btoa(binary);
}

async function getDataUrlForImage(imageUrl: string) {
  try {
    const res = await fetch(imageUrl);
    const arrayBuffer = await res.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);
    const mime = res.headers.get("Content-Type") ?? "image/webp";
    const dataUrl = `data:${mime};base64,${base64}`;
    return dataUrl;
  } catch (error: unknown) {
    const err = toErrorWithMessage(error);
    throw new Error(err.message);
  }
}

function useImageBlurDataUrl(publicId: string) {
  const [blurDataUrl, setBlurDataUrl] = useState<string>("");

  useEffect(() => {
    getBlurDataUrl(publicId)
      .then((res) => {
        if (res) setBlurDataUrl(res);
      })
      .catch((err: unknown) => {
        const error = toErrorWithMessage(err);
        throw new Error(error.message);
      });
  }, [publicId]);

  return blurDataUrl;
}

export { getBlurDataUrl, getImageBuilder, getImgProps, useImageBlurDataUrl };
export type { ImageBuilder };
