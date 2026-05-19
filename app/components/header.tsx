import { clsxm } from "@/utils/clsxm";

import { Grid } from "./grid";
import { H2, H3, H4 } from "./typography";

import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

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
          <H4>{subTitle}</H4>
          <H2 variant="secondary">{title}</H2>
        </div>

        {cta && ctaUrl ? (
          <Link className="group flex items-center space-x-6" to={ctaUrl}>
            <H3>{cta}</H3>
            <ArrowRightCircleIcon className="dark:text-light h-8 w-8 text-black duration-500 group-hover:translate-x-1.5" />
          </Link>
        ) : null}
      </div>
    </Grid>
  );
}

export { Header };
