import { Text } from "@/components/typography";
import { clsxm } from "@/utils/clsxm";

type TagColor = "default" | "brand" | "secondary";

interface TagProps {
  color?: TagColor;
  className?: string;
  children: React.ReactNode;
}

function Tag({ color = "default", className, children }: TagProps) {
  return (
    <span
      className={clsxm(
        "inline-flex items-center justify-center",
        "rounded-xl border px-3 py-1.5",
        {
          "border-(--tag-border-default) bg-(--tag-surface-default) text-(--tag-text-default)":
            color === "default",
          "border-(--tag-border-brand) bg-(--tag-surface-brand) text-(--tag-text-brand)":
            color === "brand",
          "border-(--tag-border-secondary) bg-(--tag-surface-secondary) text-(--tag-text-secondary)":
            color === "secondary",
        },
        className,
      )}
    >
      <Text variant="label">{children}</Text>
    </span>
  );
}

export { Tag };
export type { TagColor };
