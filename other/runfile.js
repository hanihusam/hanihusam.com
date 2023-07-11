require("dotenv/config");

const { installGlobals } = require("@remix-run/node");
const path = require("path");
const { pathToFileURL } = require("url");

installGlobals();

const { href: scriptPath } = pathToFileURL(
  path.join(process.cwd(), process.argv[2])
);

require(scriptPath);
