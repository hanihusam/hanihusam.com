import * as React from "react";

import { clsxm } from "@/utils/clsxm";

/**
 * Fixed progressive-blur overlay pinned to the top of the viewport.
 * Content scrolling underneath ramps from sharp to blurred toward the top
 * edge. The overlay fades in once the page is scrolled away from the top.
 */
export function TopBlurOverlay() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className={clsxm(
        "top-blur pointer-events-none fixed inset-x-0 top-0 z-30 h-24 transition-opacity duration-300",
        scrolled ? "opacity-100" : "opacity-0",
      )}
    >
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}
