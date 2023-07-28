import * as React from "react";

import {
  buttonBlockStyles,
  disabledStyles,
  renderButtonIcon,
} from "@/utils/button";
import clsxm from "@/utils/clsxm";

import { Paragraph } from "./typography";

interface ButtonOutlineBaseProps {
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

type ButtonProps = ButtonOutlineBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

function buttonModifierStyle(variant: "primary" | "secondary") {
  switch (variant) {
    case "primary":
      return "hover:bg-primary-500 focus:ring-2 focus:ring-primary-500/20 active:bg-primary-600 active:border-primary-600 disabled:border-primary-300 disabled:text-primary-300";
    case "secondary":
      return "hover:bg-secondary-500 focus:ring-2 focus:ring-secondary-500/20 active:bg-secondary-600 active:border-secondary-600 disabled:border-secondary-300 disabled:text-secondary-300";
    default:
      return "hover:bg-primary-500 focus:ring-2 focus:ring-primary-500/20 active:bg-primary-600 disabled:border-primary-300 disabled:text-primary-300";
  }
}

/**
 * Button component used for any actions.
 *
 * @link https://tailwindui.com/components/application-ui/elements/buttons#component-80fd0d5ac7982f1a83b171bb0fb9e116
 */
export const ButtonOutline = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
        buttonModifierStyle(variant),
        "group items-center justify-center rounded-md border px-5 py-3 duration-200 focus:outline-none",
        `border-${variant}-500 text-${variant}-500`,
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
      <Paragraph
        prose={false}
        className={`text-${variant} group-hover:text-light group-focus:text-light group-active:text-light`}
      >
        {children}
      </Paragraph>
    </button>
  )
);

ButtonOutline.displayName = "ButtonOutline";
