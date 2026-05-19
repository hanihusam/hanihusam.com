import * as React from "react";

import { clsxm } from "./clsxm";

function buttonBlockStyles(block?: boolean) {
  return [block ? "flex w-full" : "inline-flex", "flex-row"];
}

function renderButtonIcon({
  icon,
  additionalClasses,
}: {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  additionalClasses?: string;
}) {
  if (icon) {
    return React.createElement(icon, {
      className: clsxm(["mr-1", "h-4 w-4"], additionalClasses),
      "aria-hidden": true,
      fill: "currentColor",
    });
  }

  return null;
}

const disabledStyles = "disabled:cursor-not-allowed";

export { buttonBlockStyles, disabledStyles, renderButtonIcon };
