import appStyles from "@/styles/app.css";
import fonts from "@/styles/fonts.css";
import noScriptStyles from "@/styles/no-script.css";
import proseStyles from "@/styles/prose.css";
import tailwindStyles from "@/styles/tailwind.css";

import { Footer } from "@/components/footer";
import { LayoutRoot } from "@/components/layout";
import { Navbar } from "@/components/navbar";
import { getEnv } from "@/utils/env.server";
import { toErrorWithMessage } from "@/utils/helpers";
import { useNonce } from "@/utils/nonce-provider";
import { getThemeSession } from "@/utils/theme.server";
import {
  NonFlashOfWrongThemeEls,
  ThemeProvider,
  useTheme,
} from "@/utils/theme-provider";

import type {
  DataFunctionArgs,
  LinksFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
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
    { rel: "stylesheet", href: appStyles },
    { rel: "stylesheet", href: tailwindStyles },
    { rel: "stylesheet", href: proseStyles },
    { rel: "stylesheet", href: fonts },
  ];
};

export const meta = () => [
  { title: "Hani Husamuddin" },
  {
    property: "og:title",
    content: "Han Personal Website",
  },
  {
    name: "description",
    content:
      "A professional freelancer who could help you solve your software engineer and UI design problem",
  },
  {
    name: "viewport",
    content: "width=device-width,initial-scale=1,viewport-fit=cover",
  },
];

export async function loader({ request }: DataFunctionArgs) {
  const themeSession = await getThemeSession(request);

  const data = {
    ENV: getEnv(),
    requestInfo: {
      path: new URL(request.url).pathname,
      session: {
        theme: themeSession.getTheme(),
      },
    },
  };

  return json(data);
}

export type LoaderData = SerializeFrom<typeof loader>;

function App() {
  const data = useLoaderData<typeof loader>();
  const nonce = useNonce();
  const [theme] = useTheme();

  return (
    <html className={theme ?? ""} lang="en">
      <head>
        <Meta />
        <Links />
        <noscript>
          <link href={noScriptStyles} rel="stylesheet" />
        </noscript>
        <NonFlashOfWrongThemeEls
          nonce={nonce}
          ssrTheme={Boolean(data.requestInfo.session.theme)}
        />
      </head>
      <body>
        <LayoutRoot>
          <Navbar />
          <Outlet />
          <Footer />
        </LayoutRoot>

        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)};`,
          }}
        />
        {ENV.NODE_ENV === "development" ? <LiveReload nonce={nonce} /> : null}
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();

  return (
    <ThemeProvider specifiedTheme={data.requestInfo.session.theme}>
      <App />
    </ThemeProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  const errorMessage = toErrorWithMessage(error);

  return (
    <div>
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
      <pre>{errorMessage.message}</pre>
    </div>
  );
}
