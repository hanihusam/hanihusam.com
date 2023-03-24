import * as React from "react";

import clsxm from "@/utils/clsxm";
import { Theme, useTheme } from "@/utils/theme-provider";

import logo from "../../public/images/hnh-logo.png";

import { Popover, Switch } from "@headlessui/react";
import { Bars3Icon, SunIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MoonIcon } from "@heroicons/react/24/solid";
import { Link, useLocation } from "@remix-run/react";

const LINKS = [
  { name: "Blog", to: "/blog" },
  { name: "Projects", to: "/projects" },
];

const MOBILE_LINKS = [{ name: "Home", to: "/" }, ...LINKS];

const navMenuClasses = (isActive?: boolean) => {
  return [
    "hover:bg-white focus:bg-white dark:hover:bg-black dark:focus:bg-black text-black dark:text-white border-b border-accent px-5vw py-9 hover:text-team-current dark:border-gray-600",
    isActive ? "font-bold" : undefined,
  ];
};

export const navMenuButtonIcon = (isOpen?: boolean) => {
  if (isOpen) {
    return XMarkIcon;
  }

  return Bars3Icon;
};

interface NavigationMenuPopoverProps {
  open: boolean;
  onClickLink: () => void;
}

export function NavigationMenuPopover({
  open,
  onClickLink,
}: NavigationMenuPopoverProps) {
  const router = useLocation();

  React.useEffect(() => {
    if (open) {
      // don't use overflow-hidden, as that toggles the scrollbar and causes layout shift
      document.body.classList.add("fixed");
      document.body.classList.add("overflow-y-scroll");
      // alternatively, get bounding box of the menu, and set body height to that.
      document.body.style.height = "100vh";
    } else {
      document.body.classList.remove("fixed");
      document.body.classList.remove("overflow-y-scroll");
      document.body.style.removeProperty("height");
    }
  }, [open]);

  return (
    <Popover.Panel className="fixed top-[104px] bottom-0 left-1/2 z-10 w-full max-w-xl -translate-x-1/2 transform">
      <nav className="flex h-full w-full flex-1 flex-col overflow-auto bg-light text-black dark:bg-dark dark:text-white">
        {MOBILE_LINKS.map((link) => {
          const isActive = link.to === router.pathname;

          return (
            <Link
              key={link.to}
              className={clsxm(...navMenuClasses(isActive))}
              onClick={onClickLink}
              to={link.to}
            >
              {link.name}
            </Link>
          );
        })}
        <div className="noscript-hidden py-9 text-center">
          <ThemeToggler />
        </div>
      </nav>
    </Popover.Panel>
  );
}

function ThemeToggler() {
  const [theme, setTheme] = useTheme();

  return (
    <Switch
      checked={theme === Theme.DARK}
      className="relative inline-flex h-10 w-[78px] shrink-0 cursor-pointer rounded-full border-2 border-base bg-base transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75"
      onChange={() => {
        setTheme((prevTheme) =>
          prevTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK
        );
      }}
    >
      <span className="sr-only">Use theme</span>
      <span
        aria-hidden="true"
        className={`${theme === "dark" ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block  transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      >
        {theme === "dark" ? (
          <MoonIcon className="h-9 w-9 text-secondary-500" />
        ) : (
          <SunIcon className="h-9 w-9 text-primary-500" />
        )}
      </span>
    </Switch>
  );
}

function NavLink({
  to,
  ...rest
}: Omit<Parameters<typeof Link>["0"], "to"> & { to: string }) {
  const location = useLocation();
  const isSelected =
    to === location.pathname || location.pathname.startsWith(`${to}/`);

  return (
    <li className="flex items-start px-5 py-2">
      <Link
        className={clsxm(
          "underlined block whitespace-nowrap text-lg font-medium focus:outline-none dark:text-white",
          {
            "active text-secondary": isSelected,
            "text-black ": !isSelected,
          }
        )}
        prefetch="intent"
        to={to}
        {...rest}
      />
    </li>
  );
}

export function Navbar() {
  const popoverButtonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-start py-6 px-6 md:px-[5vw] lg:py-12">
      <nav className="mx-auto flex w-full max-w-8xl items-center justify-between">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-light">
          <img alt="HNH logo" className="h-10 w-10" src={logo} />
        </div>

        <div className="hidden items-start md:flex">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.name}
            </NavLink>
          ))}
        </div>

        <Popover className="relative block lg:hidden">
          {({ open, close }) => (
            <>
              <Popover.Button
                className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary-500 p-1 text-primary-500 transition hover:border-primary-700 focus:border-primary-500 focus:outline-none"
                ref={popoverButtonRef}
              >
                {React.createElement(navMenuButtonIcon(open), {
                  "aria-hidden": true,
                  className: "text-primary-500 h-6 w-6",
                })}
                <span className="sr-only">Menu</span>
              </Popover.Button>
              <NavigationMenuPopover onClickLink={() => close()} open={open} />
            </>
          )}
        </Popover>

        <div className="hidden lg:block">
          <ThemeToggler />
        </div>
      </nav>
    </div>
  );
}
