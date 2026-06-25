import { Grid } from "@/components/grid";
import { H1, H4, Text } from "@/components/typography";

interface ProjectHeaderProps {
  title: string;
  description: string;
  category?: string;
}

function ProjectHeader({ title, description, category }: ProjectHeaderProps) {
  return (
    <Grid>
      <div className="col-span-full flex flex-col gap-3 self-stretch">
        {category ? (
          <Text variant="overline" className="text-(--text-overline)">
            {category}
          </Text>
        ) : null}
        <H1>{title}</H1>
        <H4 variant="secondary">{description}</H4>
      </div>
    </Grid>
  );
}

export { ProjectHeader };
