"use client";

import { SearchIcon } from "./icons";

/** v2 keyword search field: white pill, hairline border, trailing muted icon. */
export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-69.5 rounded-full border border-divider bg-card pr-10 pl-4 text-body placeholder:text-ink-faint focus:outline-2 focus:outline-brand-soft"
      />
      <SearchIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-faint" />
    </div>
  );
}
