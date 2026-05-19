import { Grid } from "@/components/grid";
import { H2 } from "@/components/typography";
import { ButtonLink } from "@/components/ui/button";
import { externalLinks } from "@/external-links";

import { EnvelopeIcon } from "@heroicons/react/24/solid";

export function CtaSection() {
  return (
    <Grid smFull>
      <div className="px-10vw col-span-full flex flex-col gap-6 rounded-xl bg-black py-18 md:flex-row md:px-10 lg:justify-between">
        <H2 className="text-light">Interested working with me?</H2>

        <div className="flex gap-2 self-stretch">
          <ButtonLink href={externalLinks.email} iconLeft={<EnvelopeIcon />}>
            Email Me
          </ButtonLink>
        </div>
      </div>
    </Grid>
  );
}
