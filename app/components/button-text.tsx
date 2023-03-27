import * as React from "react";

import {
  buttonBlockStyles,
  disabledStyles,
  renderButtonIcon,
} from "@/utils/button";
import clsxm from "@/utils/clsxm";

interface ButtonTextBaseProps {
  /** Make the button expand the width of the container. */
  block?: boolean;
  /** Renders the loading state of button. */
  isLoading?: boolean;
  /** The icon component (from Heroicons) to use in the button. `icon={PlusIcon}` */
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconClassName?: string;
}

type ButtonTextProps = ButtonTextBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Button component used for any actions.
 *
 * @link https://tailwindui.com/components/application-ui/elements/buttons#component-80fd0d5ac7982f1a83b171bb0fb9e116
 */
export const ButtonText = React.forwardRef<HTMLButtonElement, ButtonTextProps>(
  (
    {
      className,
      style,
      type,
      block,
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
        "bg-transparent items-center justify-center rounded-md border-0 px-5 py-3 text-lg text-secondary-500 duration-200 hover:text-secondary-600 focus:text-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 active:text-secondary-700 active:focus:text-white disabled:text-secondary-300 dark:text-light dark:hover:text-white dark:focus:text-white",
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
        additionalClasses: clsxm(iconClassName),
      })}
      {children}
    </button>
  )
);

ButtonText.displayName = "ButtonText";
