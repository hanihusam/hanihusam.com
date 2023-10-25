const closeWithGrace = require("close-with-grace");
const { passthrough, http } = require("msw");
const { setupServer } = require("msw/node");

const miscHandlers = [
  process.env.REMIX_DEV_ORIGIN
    ? http.post(`${process.env.REMIX_DEV_ORIGIN}ping`, passthrough)
    : null,
].filter(Boolean);

const server = setupServer(...miscHandlers);

server.listen({ onUnhandledRequest: "warn" });

if (process.env.NODE_ENV !== "test") {
  console.info("🔶 Mock server installed");

  closeWithGrace(() => {
    server.close();
  });
}

exports.modules = { server };
