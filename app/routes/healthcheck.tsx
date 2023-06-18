import { prisma } from "@/utils/db.server";

import type { DataFunctionArgs } from "@remix-run/node";

export async function loader({ request }: DataFunctionArgs) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  console.log(`this is the ${new URL(request.url).protocol}${host}`);

  try {
    await Promise.all([prisma.contentMeta.count()]);
    return new Response("OK");
  } catch (error: unknown) {
    console.error(request.url, "healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}
