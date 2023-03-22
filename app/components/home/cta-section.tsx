import { Button } from "@/components/button";
import { Grid } from "@/components/grid";
import { H2 } from "@/components/typography";
import { useMediaQuery } from "@/utils/misc";

import { EnvelopeIcon } from "@heroicons/react/24/solid";

export function CtaSection() {
  const mobile = useMediaQuery("(max-width: 640px)");

  return (
    <Grid nested={mobile}>
      <div className="col-span-full grid grid-cols-4 gap-6 rounded-xl bg-black px-6 py-[72px] md:grid-cols-8 md:flex-row md:px-10 lg:grid-cols-12">
        <div className="col-span-full lg:col-span-6">
          <H2 className="text-light">Interested working with me?</H2>
        </div>
        <div className="col-span-full flex gap-2 self-stretch lg:col-start-10">
          <Button>See Projects</Button>
          <Button icon={EnvelopeIcon} iconClassName="text-light">
            Email Me
          </Button>
        </div>
      </div>
    </Grid>
  );
}
