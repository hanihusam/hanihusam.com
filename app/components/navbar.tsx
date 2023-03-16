import { H6 } from "@/components/typography";

import logo from "../../public/images/hnh-logo.png";

import { Switch } from "@headlessui/react";
import { SunIcon } from "@heroicons/react/24/outline";
import { MoonIcon } from "@heroicons/react/24/solid";

const theme: string = "light";

export function Navbar() {
  return (
    <div className="flex items-start py-6 px-6 md:px-[5vw] lg:py-12">
      <div className="mx-auto flex w-full items-center md:justify-between">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-light">
          <img alt="HNH logo" className="h-10 w-10" src={logo} />
        </div>

        <div className="hidden items-start md:flex">
          <div className="flex items-start px-5 py-2">
            <H6 className="text-black dark:text-white">Blog</H6>
          </div>
          <div className="flex items-start px-5 py-2">
            <H6 className="text-black dark:text-white">Projects</H6>
          </div>
        </div>
        <Switch
          checked={theme === "dark"}
          className="relative hidden h-10 w-[78px] shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-base transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white  focus-visible:ring-opacity-75 md:inline-flex"
          onChange={(checked) => {
            console.log(checked);
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
      </div>
    </div>
  );
}
