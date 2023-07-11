import "dotenv/config";

import { installGlobals } from "@remix-run/node";
import path from "path";
import { pathToFileURL } from "url";

installGlobals();

const { href: scriptPath } = pathToFileURL(
  path.join(process.cwd(), process.argv[2])
);

await import(scriptPath);
