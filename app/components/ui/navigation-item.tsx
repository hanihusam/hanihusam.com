import { Text } from "@/components/typography";
import { clsxm } from "@/utils/clsxm";

import {
  Arrow,
  Content,
  Provider,
  Root,
  Trigger,
} from "@radix-ui/react-tooltip";
import { NavLink } from "react-router";

type NavigationItemProps = {
  label: string;
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function NavigationItem({
  label,
  href,
  className,
  children,
}: NavigationItemProps) {
  return (
    <Provider delayDuration={100}>
      <Root>
        <Trigger asChild>
          <NavLink
            to={href}
            className={clsxm(
              "group relative my-1 mr-1 grid size-9 place-items-center rounded-md focus:outline-none",
              className,
            )}
          >
            <span className="ease absolute inset-0 rounded-md bg-(--nav-item-surface-active) opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100 group-aria-[current=page]:opacity-100" />
            <span className="relative">{children}</span>
          </NavLink>
        </Trigger>
        <Content className="TooltipContent" sideOffset={5}>
          <Text
            className="text-neutral-50 dark:text-neutral-950"
            variant="label"
          >
            {label}
          </Text>
          <Arrow className="TooltipArrow" />
        </Content>
      </Root>
    </Provider>
  );
}
