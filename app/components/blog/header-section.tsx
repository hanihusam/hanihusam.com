import { Grid } from "@/components/grid";
import { H1, H4 } from "@/components/typography";

interface HeaderSection {
  title: string;
  subTitle: string;
}

export function HeaderSection({ title, subTitle }: HeaderSection) {
  return (
    <Grid>
      <div className="col-span-full flex flex-col self-stretch">
        <H1 className="uppercase">{title}</H1>
        <H4 variant="secondary">{subTitle}</H4>
      </div>
    </Grid>
  );
}
