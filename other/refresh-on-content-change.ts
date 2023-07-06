import { postRefreshCache } from "./utils";

import chokidar from "chokidar";
import fs from "fs";
import path from "path";

const watchPath = path.resolve(process.cwd(), "content");
const refreshPath = path.resolve(process.cwd(), "app", "refresh.ignore.js");

chokidar.watch(watchPath).on("change", (changePath) => {
  const relativeChangePath = changePath.replace(
    `${path.resolve(process.cwd(), "contents")}/`,
    ""
  );
  console.log("🛠 content changed", relativeChangePath);

  postRefreshCache({
    http: require("http"),
    postData: {
      contentPaths: [relativeChangePath],
    },
    options: {
      // @ts-expect-error - postRefreshCache is not typed
      hostname: "localhost",
      port: 3000,
    },
  })
    .then(() => {
      console.log("🚀 Finished updating content");
      setTimeout(() => {
        fs.writeFileSync(refreshPath, `// ${new Date()}`);
      }, 250);
    })
    .catch((err) => {
      console.error(err);
    });
});
