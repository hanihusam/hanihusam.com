import clsxm from "@/utils/clsxm";

import { Grid } from "./grid";
import { H2, H5, H6 } from "./typography";

import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

interface HeaderProps {
  title: string;
  subTitle: string;
  reverse?: boolean;
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
  ctaUrl,
  cta,
  className,
}: HeaderProps) {
  return (
    <Grid as={as}>
      <div
        className={clsxm(
          "col-span-full flex flex-col space-y-6 lg:flex-row lg:items-end lg:justify-between lg:space-y-0",
          { "flex-row-reverse": reverse, "flex-col-reverse": reverse },
          className
        )}
      >
        <div className="flex flex-col space-y-2 self-stretch">
          <H6 className="text-primary-500">{title}</H6>
          <H2 className="text-secondary-500 dark:text-light">{subTitle}</H2>
        </div>

        {cta && ctaUrl ? (
          <Link
            className="flex items-center space-x-6 self-stretch"
            to={ctaUrl}
          >
            <H5>{cta}</H5>
            <ArrowRightCircleIcon className="h-8 w-8 text-black dark:text-light" />
          </Link>
        ) : null}
      </div>
    </Grid>
  );
}

export { Header };
