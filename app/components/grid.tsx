import * as React from "react";

import clsxm from "@/utils/clsxm";

interface GridProps {
  children: React.ReactNode;
  overflow?: boolean;
  className?: string;
  as?: React.ElementType;
  id?: string;
  nested?: boolean;
  smFull?: boolean;
  rowGap?: boolean;
  featured?: boolean;
}

const Grid = React.forwardRef<HTMLElement, GridProps>(function Grid(
  {
    children,
    className,
    as: Tag = "div",
    featured,
    nested,
    smFull,
    rowGap,
    id,
  },
  ref
) {
  return (
    <Tag
      className={clsxm("relative", {
        "mx-10vw": !nested,
        "w-full": nested,
        "mx-0 w-full md:mx-10vw md:w-auto": smFull,
        "py-10 md:py-24 lg:pb-40 lg:pt-36": featured,
      })}
      id={id}
      ref={ref}
    >
      {featured ? (
        <div className="absolute inset-0 -mx-5vw">
          <div className="bg-secondary mx-auto h-full w-full max-w-8xl rounded-lg" />
        </div>
      ) : null}

      <div
        className={clsxm(
          "relative grid grid-cols-4 gap-x-4 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-6",
          {
            "mx-auto max-w-7xl": !nested,
            "gap-y-8": rowGap,
          },
          className
        )}
      >
        {children}
      </div>
    </Tag>
  );
});

export { Grid };
