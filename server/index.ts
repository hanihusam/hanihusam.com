import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady } from "@remix-run/node";
import compression from "compression";
import express from "express";
import * as fs from "fs";
import morgan from "morgan";
import path from "path";
import * as url from "url";

const app = express();

const here = (...d: Array<string>) => path.join(__dirname, ...d);

app.use((req, res, next) => {
  // helpful headers:
  res.set("x-fly-region", process.env.FLY_REGION ?? "unknown");
  res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);

  // /clean-urls/ -> /clean-urls
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
    return;
  }
  next();
});

// if we're not in the primary region, then we need to make sure all
// non-GET/HEAD/OPTIONS requests hit the primary region rather than read-only
// Postgres DBs.
// learn more: https://fly.io/docs/getting-started/multi-region-databases/#replay-the-request
app.all("*", function getReplayResponse(req, res, next) {
  const { method, path: pathname } = req;
  const { PRIMARY_REGION, FLY_REGION } = process.env;

  const isMethodReplayable = !["GET", "OPTIONS", "HEAD"].includes(method);
  const isReadOnlyRegion =
    FLY_REGION && PRIMARY_REGION && FLY_REGION !== PRIMARY_REGION;

  const shouldReplay = isMethodReplayable && isReadOnlyRegion;

  if (!shouldReplay) return next();

  const logInfo = {
    pathname,
    method,
    PRIMARY_REGION,
    FLY_REGION,
  };
  console.info(`Replaying:`, logInfo);
  res.set("fly-replay", `region=${PRIMARY_REGION}`);
  return res.sendStatus(409);
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" }),
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

app.use(morgan("tiny"));

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "build");
const BUILD_PATH = path.resolve("build/index.js");

const initialBuild = await reimportServer();

function reimportServer() {
  const stat = fs.statSync(BUILD_PATH);

  // convert build path to URL for Windows compatibility with dynamic `import`
  const BUILD_URL = url.pathToFileURL(BUILD_PATH).href;

  // use a timestamp query parameter to bust the import cache
  return import(BUILD_URL + "?t=" + stat.mtimeMs);
}

app.all(
  "*",
  MODE === "production"
    ? createRequestHandler({ build: initialBuild, mode: initialBuild.mode })
    : (...args) => {
        purgeRequireCache();
        const requestHandler = createRequestHandler({
          build: initialBuild,
          mode: MODE,
        });
        return requestHandler(...args);
      },
);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`✅ Express server listening on port ${port}`);
  // require the built app so we're ready when the first request comes in
  // require(BUILD_DIR);

  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(initialBuild);
  }
});

const publicAbsolutePath = here("../public");

app.use(
  express.static(publicAbsolutePath, {
    maxAge: "1w",
    setHeaders(res, resourcePath) {
      const relativePath = resourcePath.replace(`${publicAbsolutePath}/`, "");
      if (relativePath.startsWith("build/info.json")) {
        res.setHeader("cache-control", "no-cache");
        return;
      }
      // If we ever change our font (which we quite possibly never will)
      // then we'll just want to change the filename or something...
      // Remix fingerprints its assets so we can cache forever
      if (
        relativePath.startsWith("fonts") ||
        relativePath.startsWith("build")
      ) {
        res.setHeader("cache-control", "public, max-age=31536000, immutable");
      }
    },
  }),
);

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete require.cache[key];
    }
  }
}
