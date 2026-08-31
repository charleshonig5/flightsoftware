import { CheckIcon } from "./icons";

/**
 * v2 checkbox visual (16px, 4px radius): hairline box when off,
 * brand fill with a white check when on. Presentational — wrap it in the
 * interactive row that owns the click.
 */
export function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex size-4 shrink-0 items-center justify-center rounded-check border transition-colors duration-150 ${
        checked ? "border-brand bg-brand text-white" : "border-divider bg-card"
      }`}
    >
      {checked && <CheckIcon className="size-3.5" />}
    </span>
  );
}
