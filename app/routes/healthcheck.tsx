// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import { prisma } from "@/utils/db.server";

import type { LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  // const host =
  //   request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    // const url = new URL("/", `http://${host}`);
    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([prisma.contentMeta.count()]);
    return new Response("OK");
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}
