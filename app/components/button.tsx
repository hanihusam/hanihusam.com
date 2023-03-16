import * as React from "react";

import {
  buttonBlockStyles,
  disabledStyles,
  renderButtonIcon,
} from "@/utils/button";
import clsxm from "@/utils/clsxm";

import { Paragraph } from "./typography";

interface ButtonBaseProps {
  /** Make the button expand the width of the container. */
  block?: boolean;
  /** The base variant of the button. */
  variant?: "primary" | "secondary";
  /** Renders the loading state of button. */
  isLoading?: boolean;
  /** The icon component (from Heroicons) to use in the button. `icon={PlusIcon}` */
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconClassName?: string;
}

type ButtonProps = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Button component used for any actions.
 *
 * @link https://tailwindui.com/components/application-ui/elements/buttons#component-80fd0d5ac7982f1a83b171bb0fb9e116
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      style,
      type,
      block,
      variant = "primary",
      icon,
      isLoading,
      iconClassName,
      disabled,
      children,
      ...rest
    },
    ref
  ) => (
    <button
      className={clsxm(
        buttonBlockStyles(block),
        "items-center justify-center rounded-md px-5 py-3 focus:outline-none",
        `bg-${variant}-500 hover:bg-${variant}-600 focus:ring-2 focus:ring-${variant}-500/20 active:bg-${variant}-700 disabled:bg-${variant}-300`,
        disabledStyles,
        className
      )}
      disabled={disabled ? disabled : isLoading}
      ref={ref}
      style={style}
      type={type ?? "button"}
      {...rest}
    >
      {renderButtonIcon({
        icon,
        additionalClasses: iconClassName,
      })}
      <Paragraph className="text-light">{children}</Paragraph>
    </button>
  )
);

Button.displayName = "Button";
