import { externalLinks } from "@/external-links";

import { Grid } from "./grid";
import { IconLink } from "./icon-link";
import { DribbbleIcon, GithubIcon, LinkedinIcon } from "./icons";
import { Paragraph } from "./typography";

export function Footer() {
  return (
    <Grid className="gap-8">
      <hr className="border-accent col-span-full w-full" />
      <div className="col-span-full mb-8 flex flex-col gap-4 lg:flex-row lg:justify-between">
        <Paragraph className="text-dark dark:text-light">{`© ${new Date().getFullYear()} hanihusam. All rights reserved.`}</Paragraph>

        <div className="flex gap-6">
          <IconLink
            aria-label="Link to Linkedin profile"
            href={externalLinks.linkedin}
          >
            <LinkedinIcon className="text-secondary-500 dark:text-light h-6 w-6" />
          </IconLink>
          <IconLink
            aria-label="Link to Github repository"
            href={externalLinks.github}
          >
            <GithubIcon className="text-secondary-500 dark:text-light h-6 w-6" />
          </IconLink>
          <IconLink
            aria-label="Link to Dribbble profile"
            href={externalLinks.dribbble}
          >
            <DribbbleIcon className="text-secondary-500 dark:text-light h-6 w-6" />
          </IconLink>
        </div>
      </div>
    </Grid>
  );
}
