import { XMLParser } from "fast-xml-parser";

const FEED_URL = "https://bapak2dev.substack.com/feed";
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export type SubstackPost = {
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  coverImage: string | null;
};

const parser = new XMLParser({ ignoreAttributes: false });

let cache: { data: SubstackPost[]; expires: number } | null = null;

export async function getFeaturedSubstackPosts(
  limit = 3,
): Promise<SubstackPost[]> {
  if (cache && cache.expires > Date.now()) {
    return cache.data.slice(0, limit);
  }

  try {
    const res = await fetch(FEED_URL, {
      headers: { "user-agent": "hanihusam.com" },
    });
    if (!res.ok) throw new Error(`Substack feed ${res.status}`);

    const posts = parseFeed(await res.text());
    cache = { data: posts, expires: Date.now() + CACHE_TTL };
    return posts.slice(0, limit);
  } catch (error) {
    console.error("Substack feed failed:", error);
    return cache ? cache.data.slice(0, limit) : [];
  }
}

function parseFeed(xml: string): SubstackPost[] {
  const parsed = parser.parse(xml);
  const items = parsed?.rss?.channel?.item ?? [];
  const list = Array.isArray(items) ? items : [items];

  return list.map(function toPost(item): SubstackPost {
    return {
      title: item.title ?? "",
      url: item.link ?? "",
      publishedAt: item.pubDate ?? "",
      excerpt: stripHtml(item.description ?? "").slice(0, 160),
      coverImage: item.enclosure?.["@_url"] ?? null,
    };
  });
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}
