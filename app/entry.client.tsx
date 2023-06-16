import { startTransition } from "react";

import { handleDarkAndLightModeEls } from "./utils/theme-provider";

import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  handleDarkAndLightModeEls();
  hydrateRoot(document, <RemixBrowser />);
});
