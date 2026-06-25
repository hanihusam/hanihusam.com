import { type ChangeEventHandler } from "react";

import { Text } from "@/components/typography";
import { clsxm } from "@/utils/clsxm";

interface FilterTagProps {
  tag: string;
  selected: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

function FilterTag({ tag, selected, onChange, disabled }: FilterTagProps) {
  return (
    <label
      className={clsxm(
        "relative inline-flex cursor-pointer items-center justify-center select-none",
        "rounded-full px-4 py-3",
        "transition-colors duration-150",
        {
          "border border-(--border-primary) bg-(--filter-tag-surface-default)":
            !selected && !disabled,
          "border border-transparent bg-(--filter-tag-surface-selected)":
            selected && !disabled,
          "cursor-not-allowed border border-(--border-primary) bg-(--filter-tag-surface-disabled)":
            disabled,
        },
        "focus-within:ring-2 focus-within:ring-(--border-focus) focus-within:ring-offset-2",
      )}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onChange}
        readOnly={!onChange}
        disabled={disabled}
        value={tag}
        className="sr-only"
      />
      <Text
        className={clsxm({
          "text-(--filter-tag-text-default)": !selected && !disabled,
          "text-(--filter-tag-text-selected)": selected && !disabled,
          "text-(--filter-tag-text-disabled)": disabled,
        })}
        variant="label"
      >
        {tag}
      </Text>
    </label>
  );
}

export { FilterTag };
