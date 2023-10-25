import type { RequestHandler } from "@remix-run/express";
import { createRequestHandler } from "@remix-run/express";
import type { ServerBuild } from "@remix-run/node";
import { broadcastDevReady, installGlobals } from "@remix-run/node";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import * as path from "node:path";
import sourceMapSupport from "source-map-support";

installGlobals();
sourceMapSupport.install();

const BUILD_PATH = path.resolve("build/index.js");
const VERSION_PATH = path.resolve("build/version.txt");

let initialBuild = require(BUILD_PATH);

// We'll make chokidar a dev dependency so it doesn't get bundled in production.
const chokidar =
  process.env.NODE_ENV === "development" ? require("chokidar") : null;

const remixHandler =
  process.env.NODE_ENV === "development"
    ? createDevRequestHandler()
    : createRequestHandler({
        build: initialBuild,
        mode: process.env.NODE_ENV,
      });

const app = express();

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

app.all("*", remixHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✅ Express server listening on port ${port}`);

  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(initialBuild);
  }
});

async function reimportServer(): Promise<ServerBuild> {
  // 1. manually remove the server build from the require cache
  Object.keys(require.cache).forEach((key) => {
    if (key.startsWith(BUILD_PATH)) {
      delete require.cache[key];
    }
  });

  // 2. re-import the server build
  return require(BUILD_PATH);
}

// Create a request handler that watches for changes to the server build during development.
function createDevRequestHandler(): RequestHandler {
  async function handleServerUpdate() {
    // 1. re-import the server build
    initialBuild = await reimportServer();

    // Add debugger to assist in v2 dev debugging
    if (initialBuild?.assets === undefined) {
      console.log(initialBuild.assets);
      debugger;
    }

    // 2. tell dev server that this app server is now up-to-date and ready
    broadcastDevReady(initialBuild);
  }

  chokidar
    .watch(VERSION_PATH, { ignoreInitial: true })
    .on("add", handleServerUpdate)
    .on("change", handleServerUpdate);

  // wrap request handler to make sure its recreated with the latest build for every request
  return async (req, res, next) => {
    try {
      return createRequestHandler({
        build: initialBuild,
        mode: "development",
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
