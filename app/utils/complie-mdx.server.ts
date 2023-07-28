import type { GitHubFile } from "@/types";

import type * as H from "hast";
import type * as MDX from "mdast-util-mdx-jsx";
import { bundleMDX } from "mdx-bundler";
import type TPQueue from "p-queue";
import readingTime from "reading-time";
import rehypePrettyCode from "rehype-pretty-code";
import type * as U from "unified";

function arrayToObj<ItemType extends Record<string, unknown>>(
  array: Array<ItemType>,
  { keyName, valueName }: { keyName: keyof ItemType; valueName: keyof ItemType }
) {
  const obj: Record<string, ItemType[keyof ItemType]> = {};
  for (const item of array) {
    const key = item[keyName];
    if (typeof key !== "string") {
      throw new Error(`${String(keyName)} of item must be a string`);
    }
    const value = item[valueName];
    obj[key] = value;
  }
  return obj;
}

function trimCodeBlocks() {
  return async function transformer(tree: H.Root) {
    const { visit } = await import("unist-util-visit");

    visit(tree, "element", (preNode: H.Element) => {
      if (preNode.tagName !== "pre" || !preNode.children.length) {
        return;
      }
      const codeNode = preNode.children[0];
      if (
        !codeNode ||
        codeNode.type !== "element" ||
        codeNode.tagName !== "code"
      ) {
        return;
      }
      const [codeStringNode] = codeNode.children;
      if (!codeStringNode) return;

      if (codeStringNode.type !== "text") {
        console.warn(
          `trimCodeBlocks: Unexpected: codeStringNode type is not "text": ${codeStringNode.type}`
        );
        return;
      }
      codeStringNode.value = codeStringNode.value.trim();
    });
  };
}

const cloudinaryUrlRegex =
  /^https?:\/\/res\.cloudinary\.com\/(?<cloudName>.+?)\/image\/upload\/((?<transforms>(.+?_.+?)+?)\/)?(\/?(?<version>v\d+)\/)?(?<publicId>.+$)/;

function optimizeCloudinaryImages() {
  return async function transformer(tree: H.Root) {
    const { visit } = await import("unist-util-visit");

    visit(
      tree,
      "mdxJsxFlowElement",
      function visitor(node: MDX.MdxJsxFlowElement) {
        if (node.name !== "img") return;
        const srcAttr = node.attributes.find(
          (attr) => attr.type === "mdxJsxAttribute" && attr.name === "src"
        );
        const urlString = srcAttr?.value ? String(srcAttr.value) : null;
        if (!srcAttr || !urlString) {
          console.error("image without url?", node);
          return;
        }
        const newUrl = handleImageUrl(urlString);
        if (newUrl) {
          srcAttr.value = newUrl;
        }
      }
    );

    visit(tree, "element", function visitor(node: H.Element) {
      if (node.tagName !== "img") return;
      const urlString = node.properties?.src
        ? String(node.properties.src)
        : null;
      if (!node.properties?.src || !urlString) {
        console.error("image without url?", node);
        return;
      }
      const newUrl = handleImageUrl(urlString);
      if (newUrl) {
        node.properties.src = newUrl;
      }
    });
  };

  function handleImageUrl(urlString: string) {
    const match = urlString.match(cloudinaryUrlRegex);
    const groups = match?.groups;
    if (groups) {
      const { cloudName, transforms, version, publicId } = groups as {
        cloudName: string;
        transforms?: string;
        version?: string;
        publicId: string;
      };
      // don't add transforms if they're already included
      if (transforms) return;
      const defaultTransforms = [
        "f_auto",
        "q_auto",
        // gifs can't do dpr transforms
        publicId.endsWith(".gif") ? "" : "dpr_2.0",
        "w_1600",
      ]
        .filter(Boolean)
        .join(",");
      return [
        `https://res.cloudinary.com/${cloudName}/image/upload`,
        defaultTransforms,
        version,
        publicId,
      ]
        .filter(Boolean)
        .join("/");
    }
  }
}

function removePreContainerDivs() {
  return async function preContainerDivsTransformer(tree: H.Root) {
    const { visit } = await import("unist-util-visit");

    visit(
      tree,
      { type: "element", tagName: "pre" },
      function visitor(node, index, parent) {
        if (parent?.type !== "element") return;
        if (parent.tagName !== "div") return;
        if (parent.children.length !== 1 && index === 0) return;
        Object.assign(parent, node);
      }
    );
  };
}

const rehypePlugins: U.PluggableList = [
  optimizeCloudinaryImages,
  trimCodeBlocks,
  removePreContainerDivs,
];

async function compileMdx<FrontmatterType>(
  slug: string,
  githubFiles: Array<GitHubFile>
) {
  const { default: rehypeAutolinkHeadings } = await import(
    "rehype-autolink-headings"
  );
  const { default: rehypePrism } = await import("rehype-prism-plus");
  const { default: rehypeSlug } = await import("rehype-slug");
  const { default: gfm } = await import("remark-gfm");

  const indexRegex = new RegExp(`${slug}\\/index.mdx?$`);
  const indexFile = githubFiles.find(({ path }) => indexRegex.test(path));
  if (!indexFile) return null;

  const rootDir = indexFile.path.replace(/index.mdx?$/, "");
  const relativeFiles: Array<GitHubFile> = githubFiles.map(
    ({ path, content }) => ({
      path: path.replace(rootDir, "./"),
      content,
    })
  );
  const files = arrayToObj(relativeFiles, {
    keyName: "path",
    valueName: "content",
  });

  try {
    const { code, frontmatter } = await bundleMDX({
      source: indexFile.content,
      files,
      mdxOptions(options) {
        options.remarkPlugins = [...(options?.remarkPlugins ?? []), gfm];
        options.rehypePlugins = [
          ...(options?.rehypePlugins ?? []),
          rehypeSlug,
          rehypePrism,
          () =>
            rehypePrettyCode({
              theme: "css-variables",
            }),
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          ...rehypePlugins,
        ];

        return options;
      },
    });

    return {
      code,
      frontmatter: {
        wordCount: indexFile.content.split(/\s+/gu).length,
        readingTime: readingTime(indexFile.content),
        slug: slug || null,
        ...frontmatter,
      } as FrontmatterType,
    };
  } catch (error: unknown) {
    console.error(`Compilation error for slug: `, slug);
    throw error;
  }
}

let _queue: TPQueue | null = null;
async function getQueue() {
  const { default: PQueue } = await import("p-queue");
  if (_queue) return _queue;

  _queue = new PQueue({
    concurrency: 1,
    throwOnTimeout: true,
    timeout: 1000 * 30,
  });
  return _queue;
}

// We have to use a queue because we can't run more than one of these at a time
// or we'll hit an out of memory error because esbuild uses a lot of memory...
async function queuedCompileMdx<FrontmatterType>(
  ...args: Parameters<typeof compileMdx>
) {
  const queue = await getQueue();
  const result = await queue.add(() => compileMdx<FrontmatterType>(...args));
  return result;
}

export { queuedCompileMdx as compileMdx };
