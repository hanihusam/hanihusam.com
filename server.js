import { createRequestHandler } from "@react-router/express";
import compression from "compression";
import express from "express";
import { getInstanceInfo } from "litefs-js";
import morgan from "morgan";

const BUILD_PATH = "./build/server/index.js";
const DEVELOPMENT = process.env.NODE_ENV === "development";
const PORT = Number.parseInt(process.env.PORT || "3000");
const primaryHost = "hanihusam.com";

const app = express();

app.use(compression());
app.disable("x-powered-by");

// Helper middleware
app.use((req, res, next) => {
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

app.use(async (req, res, next) => {
  const { currentInstance, primaryInstance } = await getInstanceInfo();
  res.set("X-Powered-By", "Bapak2dev by Han");
  res.set("X-Fly-Region", process.env.FLY_REGION ?? "unknown");
  res.set("X-Fly-App", process.env.FLY_APP_NAME ?? "unknown");
  res.set("X-Fly-Instance", currentInstance);
  res.set("X-Fly-Primary-Instance", primaryInstance);
  res.set("X-Frame-Options", "SAMEORIGIN");
  const proto = req.get("X-Forwarded-Proto") ?? req.protocol;

  const host = req.get("X-Forwarded-Host") ?? req.get("host") ?? "";
  if (!host.endsWith(primaryHost)) {
    res.set("X-Robots-Tag", "noindex");
  }
  res.set("Access-Control-Allow-Origin", `${proto}://${host}`);
  res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);
  next();
});

if (DEVELOPMENT) {
  console.log("Starting development server");
  const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    }),
  );
  app.use(viteDevServer.middlewares);
  app.use(
    createRequestHandler({
      build: () =>
        viteDevServer.ssrLoadModule("virtual:react-router/server-build"),
    }),
  );
} else {
  console.log("Starting production server");
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );
  app.use(morgan("tiny"));
  app.use(express.static("build/client", { maxAge: "1h" }));

  const build = await import(BUILD_PATH);
  app.use(createRequestHandler({ build }));
}

app.listen(PORT, () => {
  console.log(`✅ Express server listening on port ${PORT}`);
});
