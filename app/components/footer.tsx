import { externalLinks } from "@/external-links";

import { Grid } from "./grid";
import { IconLink } from "./icon-link";
import { DribbbleIcon, GithubIcon, LinkedinIcon } from "./icons";
import { Paragraph } from "./typography";

export function Footer() {
  return (
    <Grid className="gap-8">
      <hr className="col-span-full w-full bg-accent" />
      <div className="col-span-full mb-8 flex flex-col gap-4 lg:flex-row lg:justify-between">
        <Paragraph className="text-dark dark:text-light">{`© ${new Date().getFullYear()} hanihusam. All rights reserved.`}</Paragraph>

        <div className="flex gap-6">
          <IconLink href={externalLinks.linkedin}>
            <LinkedinIcon className="h-6 w-6 text-secondary-500 dark:text-light" />
          </IconLink>
          <IconLink href={externalLinks.github}>
            <GithubIcon className="h-6 w-6 text-secondary-500 dark:text-light" />
          </IconLink>
          <IconLink href={externalLinks.dribbble}>
            <DribbbleIcon className="h-6 w-6 text-secondary-500 dark:text-light" />
          </IconLink>
        </div>
      </div>
    </Grid>
  );
}
