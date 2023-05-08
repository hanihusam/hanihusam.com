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

function getRequiredEnvVarFromObj(
  obj: Record<string, string | undefined>,
  key: string,
  devValue: string = `${key}-dev-value`
) {
  let value = devValue;
  const envVal = obj[key];
  if (envVal) {
    value = envVal;
  } else if (obj.NODE_ENV === "production") {
    throw new Error(`${key} is a required env variable`);
  }
  return value;
}

function getRequiredServerEnvVar(key: string, devValue?: string) {
  return getRequiredEnvVarFromObj(process.env, key, devValue);
}

export {
  AnchorOrLink,
  getRequiredEnvVarFromObj,
  getRequiredServerEnvVar,
  useSSRLayoutEffect,
};
