import { clsxm } from "@/utils/clsxm";

import { ButtonLink } from "./ui/button";
import { Grid } from "./grid";
import { H2, Text } from "./typography";

import { ArrowCircleRightIcon } from "@phosphor-icons/react";

interface HeaderProps {
  title: string;
  subTitle: string;
  reverse?: boolean;
  nested?: boolean;
  ctaUrl?: string;
  cta?: string;
  as?: React.ElementType;
  className?: string;
}

function Header({
  title,
  subTitle,
  as,
  reverse = false,
  nested = false,
  ctaUrl,
  cta,
  className,
}: HeaderProps) {
  return (
    <Grid as={as} nested={nested}>
      <div
        className={clsxm(
          "col-span-full flex flex-col space-y-6 lg:flex-row lg:items-end lg:justify-between lg:space-y-0",
          { "flex-row-reverse": reverse, "flex-col-reverse": reverse },
          className,
        )}
      >
        <div className="flex flex-col space-y-2 self-stretch">
          <H2 variant="primary">{title}</H2>
          <Text variant="lead">{subTitle}</Text>
        </div>

        {cta && ctaUrl ? (
          <ButtonLink
            variant="ghost"
            href={ctaUrl}
            iconRight={<ArrowCircleRightIcon />}
          >
            {cta}
          </ButtonLink>
        ) : null}
      </div>
    </Grid>
  );
}

export { Header };
