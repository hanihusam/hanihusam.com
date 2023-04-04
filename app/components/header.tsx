import clsxm from "@/utils/clsxm";

import { Grid } from "./grid";
import { H2, H5, H6 } from "./typography";

import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

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
          className
        )}
      >
        <div className="flex flex-col space-y-2 self-stretch">
          <H6>{subTitle}</H6>
          <H2 variant="secondary">{title}</H2>
        </div>

        {cta && ctaUrl ? (
          <Link className="group flex items-center space-x-6" to={ctaUrl}>
            <H5>{cta}</H5>
            <ArrowRightCircleIcon className="h-8 w-8 text-black duration-500 group-hover:translate-x-1.5 dark:text-light" />
          </Link>
        ) : null}
      </div>
    </Grid>
  );
}

export { Header };
