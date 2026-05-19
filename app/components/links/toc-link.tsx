import { clsxm } from "@/utils/clsxm";

import { AnchorOrLink } from "./anchor-or-link";

type TOCLinkProps = {
  id: string;
  text: string;
  level: number;
  minLevel: number;
  activeSection: string | null;
};

export default function TOCLink({
  id,
  text,
  level,
  minLevel,
  activeSection,
}: TOCLinkProps) {
  return (
    <AnchorOrLink
      to={`#${id}`}
      id={`link-${id}`}
      style={{ marginLeft: (level - minLevel) * 16 }}
    >
      <h5
        className={clsxm(
          "hover:text-secondary-500 text-[20px] leading-7 font-medium focus:outline-none dark:hover:text-white",
          "focus-visible:text-secondary-500 dark:focus-visible:text-white",
          activeSection === id
            ? "text-secondary-500 dark:text-light"
            : "text-body",
        )}
      >
        {text}
      </h5>
    </AnchorOrLink>
  );
}
