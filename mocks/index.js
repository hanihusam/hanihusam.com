const { setupServer } = require("msw/node");
const { rest } = require("msw");

const REMIX_DEV_PING = new URL(process.env.REMIX_DEV_ORIGIN);
REMIX_DEV_PING.pathname = "/ping";

const server = setupServer(
  rest.post(REMIX_DEV_PING.href, (req) => req.passthrough()),
  // ... other request handlers go here ...
);

server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
