import { Grid } from "@/components/grid";
import { H1, Text } from "@/components/typography";
import { ConcentricCircles } from "@/components/ui/concentric-circles";
import { DotGrid } from "@/components/ui/dot-grid";

export function WorksHero() {
  return (
    <div className="relative flex min-h-120 items-center justify-center overflow-hidden pt-32 pb-20 lg:py-0">
      <ConcentricCircles
        accent
        size={485}
        className="absolute top-50 -left-36 hidden lg:block"
      />
      <ConcentricCircles
        size={250}
        ringGap={34}
        className="absolute -top-28 -right-20 hidden lg:block"
      />
      <DotGrid
        color="sky"
        rows={9}
        cols={7}
        className="absolute top-32 left-[63%] hidden lg:block"
      />

      <Grid className="relative">
        <div className="col-span-full flex flex-col items-center justify-center gap-2 text-center">
          <H1>
            Curated <span className="text-sunset-400">Projects</span>
          </H1>
          <Text variant="lead">Work that speaks for itself</Text>
        </div>
      </Grid>
    </div>
  );
}
