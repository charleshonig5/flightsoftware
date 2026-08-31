"use client";

import { useRef } from "react";
import { CloseIcon, SearchIcon } from "./icons";

/**
 * v2 keyword search field: white pill, hairline border, trailing muted icon.
 * With a query, the search icon becomes a one-click clear (✕) that refocuses
 * the field.
 */
export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-69.5 rounded-full border border-divider bg-card pr-10 pl-4 text-body placeholder:text-ink-faint focus:outline-2 focus:outline-brand-soft"
      />
      {value === "" ? (
        <SearchIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-faint" />
      ) : (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-ink-muted transition-colors duration-150 hover:text-ink animate-chip-in"
        >
          <CloseIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
