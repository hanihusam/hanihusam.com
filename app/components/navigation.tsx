import { SubstackLogo } from "@/components/writing/substack-logo";

import NavigationItem from "./ui/navigation-item";
import ThemeSwitcher from "./ui/theme-switcher";

import { HomeIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

const links = [
  {
    href: "/",
    label: "Home",
    icon: HomeIcon,
    key: "Home",
  },
  {
    href: "/works",
    label: "Projects",
    icon: WrenchScrewdriverIcon,
  },
  {
    href: "https://bapak2dev.substack.com/",
    label: "Substack",
    icon: SubstackLogo,
  },
];

export function Navigation() {
  return (
    <nav className="fixed inset-x-0 bottom-8 z-20 mx-auto flex w-fit items-center rounded-md border border-(--border-primary) bg-(--surface-primary) shadow-lg transition-colors">
      {links.map((link, idx) => (
        <NavigationItem
          className={idx === 0 ? "ml-1" : ""}
          key={link.href}
          href={link.href}
          label={link.label}
        >
          <link.icon className="h-5 w-5" />
        </NavigationItem>
      ))}

      <div className="h-11 w-px bg-(--border-primary) transition-colors" />

      <ThemeSwitcher />
    </nav>
  );
}
