import { startTransition } from "react";

import { handleDarkAndLightModeEls } from "./utils/theme-provider";

import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";

function hydrate() {
  handleDarkAndLightModeEls();
  startTransition(() => {
    hydrateRoot(document, <RemixBrowser />);
  });
}

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
