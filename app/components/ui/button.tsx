import { AnchorOrLink } from "@/components/links/anchor-or-link";
import { clsxm } from "@/utils/clsxm";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children: React.ReactNode;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getBaseClassName({ className }: { className?: string }) {
  return clsxm(
    "group relative inline-flex items-center justify-center",
    "font-medium transition duration-150 ease-out",
    "active:scale-[0.97]",
    "focus:outline-none",
    "disabled:pointer-events-none",
    "rounded-md",
    className,
  );
}

function getVariantClassName(variant: ButtonVariant) {
  return {
    primary: clsxm(
      "bg-(--btn-primary-bg) text-(--btn-primary-text)",
      "hover:bg-(--btn-primary-bg-hover)",
      "focus-visible:ring-3 focus-visible:ring-sunset-500/40",
      "disabled:bg-(--btn-primary-bg-disabled)",
    ),
    secondary: clsxm(
      "bg-(--btn-secondary-bg) text-(--btn-secondary-text)",
      "hover:bg-(--btn-secondary-bg-hover)",
      "focus-visible:ring-3 focus-visible:ring-sky-600/40",
      "disabled:bg-(--btn-secondary-bg-disabled)",
    ),
    ghost: clsxm(
      "bg-(--btn-ghost-bg) text-(--btn-ghost-text)",
      "border border-(--border-default)",
      "hover:bg-(--btn-ghost-bg-hover) hover:text-(--btn-ghost-text-hover)",
      "focus-visible:bg-(--btn-ghost-bg-focus)",
      "disabled:opacity-40",
    ),
  }[variant];
}

function getSizeClassName(size: ButtonSize) {
  return {
    sm: "px-3 py-1.5 text-base gap-1",
    md: "px-4 py-2.5 text-lg gap-1",
    lg: "px-6 py-3 text-xl gap-1.5",
  }[size];
}

function ButtonInner({
  children,
  iconLeft,
  iconRight,
}: Pick<ButtonProps, "children" | "iconLeft" | "iconRight">) {
  return (
    <>
      {iconLeft ? <span className="size-4 shrink-0">{iconLeft}</span> : null}
      {children}
      {iconRight ? <span className="size-4 shrink-0">{iconRight}</span> : null}
    </>
  );
}

function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  className,
  ...buttonProps
}: ButtonProps & React.ComponentProps<"button">) {
  return (
    <button
      {...buttonProps}
      className={clsxm(
        getVariantClassName(variant),
        getSizeClassName(size),
        getBaseClassName({ className }),
      )}
    >
      <ButtonInner iconLeft={iconLeft} iconRight={iconRight}>
        {children}
      </ButtonInner>
    </button>
  );
}

// ─── LinkButton (looks like a link) ──────────────────────────────────────────

function LinkButton({
  className,
  underlined,
  ...buttonProps
}: { underlined?: boolean } & React.ComponentProps<"button">) {
  return (
    <button
      {...buttonProps}
      className={clsxm(
        "text-(--text-link) transition-colors duration-150",
        "hover:opacity-80 focus:outline-none focus-visible:underline",
        underlined ? "underline" : "hover:underline",
        className,
      )}
    />
  );
}

// ─── ButtonLink (looks like a button, renders as <a>) ────────────────────────

function ButtonLink({
  children,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  className,
  ref,
  ...rest
}: React.ComponentPropsWithRef<typeof AnchorOrLink> & ButtonProps) {
  return (
    <AnchorOrLink
      ref={ref}
      className={clsxm(
        getBaseClassName({ className }),
        getVariantClassName(variant),
        getSizeClassName(size),
      )}
      {...rest}
    >
      <ButtonInner iconLeft={iconLeft} iconRight={iconRight}>
        {children}
      </ButtonInner>
    </AnchorOrLink>
  );
}

export { Button, ButtonLink, LinkButton };
export type { ButtonProps, ButtonSize, ButtonVariant };
