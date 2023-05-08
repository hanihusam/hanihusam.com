import { Button } from "@/components/button";
import { ButtonOutline } from "@/components/button-outline";
import { Grid } from "@/components/grid";
import { H2 } from "@/components/typography";
import { externalLinks } from "@/external-links";
import { AnchorOrLink } from "@/utils/misc";

import { EnvelopeIcon } from "@heroicons/react/24/solid";

export function CtaSection() {
  return (
    <Grid smFull>
      <div className="col-span-full flex flex-col gap-6 rounded-xl bg-black px-10vw py-[72px] md:flex-row md:px-10 lg:justify-between">
        <H2 className="text-light">Interested working with me?</H2>

        <div className="flex gap-2 self-stretch">
          <ButtonOutline>See Projects</ButtonOutline>
          <AnchorOrLink href={externalLinks.email}>
            <Button icon={EnvelopeIcon} iconClassName="text-light">
              Email Me
            </Button>
          </AnchorOrLink>
        </div>
      </div>
    </Grid>
  );
}
