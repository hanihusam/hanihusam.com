import fonts from "@/styles/fonts.css";
import tailwindStyles from "@/styles/tailwind.css";

import { H1 } from "@/components/typography";

import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta } from "@remix-run/react";

export const links: LinksFunction = () => {
  return [
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
    { rel: "manifest", href: "/site.webmanifest" },
    { rel: "icon", href: "/favicon.ico" },
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
        <H1 className="text-dark">Hello world</H1>
        <LiveReload />
      </body>
    </html>
  );
}
