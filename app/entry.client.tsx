import { startTransition } from "react";

import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";

const hydrate = () => {
  startTransition(() => {
    hydrateRoot(document, <RemixBrowser />);
  });
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
