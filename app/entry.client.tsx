import { startTransition } from "react";

import { handleDarkAndLightModeEls } from "@/utils/theme-provider";

import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";

// fixup stuff before hydration
function hydrate() {
  handleDarkAndLightModeEls();
  startTransition(() => {
    hydrateRoot(document, <RemixBrowser />);
  });
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}
