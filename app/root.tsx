import fonts from "@/styles/fonts.css";
import tailwindStyles from "@/styles/tailwind.css";

import { LayoutRoot } from "@/components/layout";
import { Navbar } from "@/components/navbar";

import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const links: LinksFunction = () => {
  return [
    {
      rel: "preload",
      as: "font",
      href: "/fonts/Satoshi-Black.woff2",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/Satoshi-Bold.woff2",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/Satoshi-Italic.woff2",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/Satoshi-Light.woff2",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/Satoshi-Medium.woff2",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/Satoshi-Regular.woff2",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/favicons/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicons/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicons/favicon-16x16.png",
    },
    { rel: "icon", href: "/favicon.ico" },
    { rel: "manifest", href: "/favicons/manifest.json" },
    { rel: "stylesheet", href: tailwindStyles },
    { rel: "stylesheet", href: fonts },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Hani Husamuddin",
  description:
    "A professional freelancer who could help you solve your software engineer and UI design problem",
  viewport: "width=device-width,initial-scale=1,viewport-fit=cover",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <LayoutRoot>
          <Navbar />
          <Outlet />
        </LayoutRoot>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
