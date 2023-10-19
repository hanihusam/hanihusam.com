/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  future: {
    v2_dev: true,
  },
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
  serverModuleFormat: "esm",
  serverPlatform: "node",
};
