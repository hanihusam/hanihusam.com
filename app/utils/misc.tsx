import * as React from "react";

import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

const AnchorOrLink = React.forwardRef<
  HTMLAnchorElement,
  AnchorProps & {
    reload?: boolean;
    to?: LinkProps["to"];
    prefetch?: LinkProps["prefetch"];
  }
>(function AnchorOrLink(props, ref) {
  const { to, href, reload = false, prefetch, children, ...rest } = props;
  let toUrl = "";
  let shouldUserRegularAnchor = reload;

  if (!shouldUserRegularAnchor && typeof href === "string") {
    shouldUserRegularAnchor = href.includes(":") || href.startsWith("#");
  }

  if (!shouldUserRegularAnchor && typeof to === "string") {
    toUrl = to;
    shouldUserRegularAnchor = to.includes(":");
  }

  if (!shouldUserRegularAnchor && typeof to === "object") {
    toUrl = `${to.pathname ?? ""}${to.hash ? `#${to.hash}` : ""}${
      to.search ? `?${to.search}` : ""
    }`;
    shouldUserRegularAnchor = to.pathname?.includes(":") ?? false;
  }

  if (shouldUserRegularAnchor) {
    return (
      <a {...rest} href={href ?? toUrl} ref={ref}>
        {children}
      </a>
    );
  }

  return (
    <Link prefetch={prefetch} to={to ?? href ?? ""} {...rest} ref={ref}>
      {children}
    </Link>
  );
});

const useSSRLayoutEffect =
  typeof window === "undefined" ? () => {} : React.useLayoutEffect;

function useMediaQuery(query: string): boolean {
  const getMatches = (q: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(q).matches;
    }
    return false;
  };

  const [matches, setMatches] = React.useState<boolean>(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  React.useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}

export { AnchorOrLink, useMediaQuery, useSSRLayoutEffect };
