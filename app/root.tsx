import fonts from "@/styles/fonts.css";
import tailwindStyles from "@/styles/tailwind.css";

import { Button } from "@/components/button";
import { ButtonText } from "@/components/button-text";
import { IconLink } from "@/components/icon-link";
import { DribbbleIcon, GithubIcon, LinkedinIcon } from "@/components/icons";
import { LayoutRoot } from "@/components/layout";
import { Navbar } from "@/components/navbar";
import { H1, H2, H4, Paragraph } from "@/components/typography";

import avatar from "../public/images/avatar-hani.png";
import avatarMemoji from "../public/images/avatar-memoji.png";

import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";

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

function Root() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <LayoutRoot>
          <Navbar />
          <div className="flex flex-col items-start">
            <div className="flex flex-col items-start space-y-6 self-stretch px-6 pt-6 md:flex-row md:justify-between md:px-[5vw] md:pt-12">
              <div className="hidden flex-col space-y-16 md:flex">
                <div className="flex flex-col space-y-6">
                  <div className="flex flex-col">
                    <H4 className="text-primary-500">Hi, I am</H4>
                    <H1 className="text-secondary-500 dark:text-light">Han</H1>
                  </div>

                  <div className="h-2 w-20 bg-primary-500" />
                </div>

                <div className="flex items-start space-x-6">
                  <IconLink
                    href="https://linkedin.com/in/hanihusam/"
                    target="_blank"
                  >
                    <LinkedinIcon className="text-secondary-500" />
                  </IconLink>
                  <IconLink href="https://github.com/hanihusam" target="_blank">
                    <GithubIcon className="text-secondary-500" />
                  </IconLink>
                  <IconLink
                    href="https://dribbble.com/hanihusam"
                    target="_blank"
                  >
                    <DribbbleIcon className="text-secondary-500" />
                  </IconLink>
                </div>
              </div>

              <img
                alt="Avatar of Han"
                className="hidden md:block"
                src={avatar}
                width={523}
              />
              <img
                alt="Avatar of Han"
                className="block md:hidden"
                src={avatarMemoji}
                width={380}
              />

              <div className="flex w-[370px] flex-col space-y-8 self-stretch">
                <div className="flex flex-col space-y-4">
                  <H4 className="block text-primary-500 md:hidden">
                    Hi{" "}
                    <span aria-labelledby="hi emoji" role="img">
                      👋
                    </span>
                    , I am Han
                  </H4>
                  <H2 className="text-secondary-500 dark:text-light">
                    UI Engineer based on Yogyakarta, Indonesia
                  </H2>
                </div>

                <Paragraph className="text-body">
                  I am a multi-disciplinary Frontend Developer and UI Designer
                  who have experience creating projects in a various industry
                  and have worked with diverse clients from all over the world.
                  I merge technical and design skills to create innovative
                  product with beautiful and functional user experiences.
                </Paragraph>

                <div className="flex space-x-2">
                  <Button>Reach Me</Button>
                  <ButtonText
                    className="group"
                    icon={ArrowDownTrayIcon}
                    iconClassName="duration-500 group-hover:translate-y-1.5"
                  >
                    Download CV
                  </ButtonText>
                </div>
              </div>
            </div>
          </div>
        </LayoutRoot>

        <Outlet />
        <Scripts />
        <LiveReload port={8002} />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  return <Root />;
}
