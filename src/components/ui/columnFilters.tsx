"use client";

import { useEffect, useRef, useState } from "react";
import { Checkbox } from "./Checkbox";
import { CloseIcon, FilterLinesIcon } from "./icons";

/**
 * State + dismissal handling for a table's per-column checkbox filters
 * (the v2 schedule-table pattern from Figma 107:9826). Pair with
 * `FilterHeaderCell` for the popovers and `FilterChips` for the active row.
 */
export function useColumnFilters<K extends string>(empty: Record<K, string[]>) {
  const [filters, setFilters] = useState(empty);
  const [openKey, setOpenKey] = useState<K | null>(null);
  const [pending, setPending] = useState<string[]>([]);

  /* Popover dismissal: outside click or Escape */
  useEffect(() => {
    if (!openKey) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target as HTMLElement).closest?.("[data-filter-open]")) setOpenKey(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenKey(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openKey]);

  return {
    filters,
    openKey,
    pending,
    toggleOpen(key: K) {
      if (openKey === key) {
        setOpenKey(null);
      } else {
        setOpenKey(key);
        setPending(filters[key]);
      }
    },
    togglePending(value: string) {
      setPending((current) =>
        current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      );
    },
    apply(key: K) {
      setFilters((current) => ({ ...current, [key]: pending }));
      setOpenKey(null);
    },
    clear(key: K) {
      setPending([]);
      setFilters((current) => ({ ...current, [key]: [] }));
    },
  };
}

/** Filterable table-header cell: label + funnel icon, checkbox popover below. */
export function FilterHeaderCell({
  label,
  options,
  active,
  open,
  pending,
  onToggleOpen,
  onTogglePending,
  onApply,
  onClear,
}: {
  label: string;
  options: string[];
  /** This column has a committed filter (label holds ink) */
  active: boolean;
  open: boolean;
  pending: string[];
  onToggleOpen: () => void;
  onTogglePending: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <div data-filter-cell data-filter-open={open ? "" : undefined} className="relative">
      <button
        type="button"
        onClick={onToggleOpen}
        className={`flex cursor-pointer items-center gap-1.5 text-body transition-colors duration-150 ${
          active || open ? "text-ink" : "text-ink-muted hover:text-ink"
        }`}
      >
        {label}
        <FilterLinesIcon className="size-4" />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-10 mt-1.5 min-w-31.5 origin-top-left rounded-field border border-divider bg-card pt-3.25 shadow-card animate-pop-in">
          <p className="px-3.25 text-caption leading-2.75 whitespace-nowrap text-ink-muted">
            Filter by {label}
          </p>
          {/* long option lists scroll inside a capped well (~6.5 rows — the
              half-cut row is the scroll cue) with card-white edge fades (the
              Mercury fade grammar); Apply/Clear stay pinned below */}
          <FilterOptionList
            options={options}
            pending={pending}
            onTogglePending={onTogglePending}
          />
          <div className="mt-3.5 border-t border-divider" />
          <div className="flex items-center gap-3.5 px-3.25 py-2">
            <button
              type="button"
              onClick={onApply}
              className="cursor-pointer text-caption font-medium whitespace-nowrap text-brand"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={onClear}
              className="cursor-pointer text-caption font-medium whitespace-nowrap text-ink-muted transition-colors duration-150 hover:text-ink"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** The popover's checkbox list: capped at `max-h-40` (~6.5 rows) with an
 *  inner scroll (scrollbar hidden) and top/bottom card-white fades that
 *  appear only when there's more content in that direction. */
function FilterOptionList({
  options,
  pending,
  onTogglePending,
}: {
  options: string[];
  pending: string[];
  onTogglePending: (value: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ top: false, bottom: false });
  const updateFades = () => {
    const list = listRef.current;
    if (!list) return;
    setFade({
      top: list.scrollTop > 1,
      bottom: list.scrollTop + list.clientHeight < list.scrollHeight - 1,
    });
  };
  /* measure on open (mount) and when the option set changes */
  useEffect(updateFades, [options.length]);

  return (
    <div className="relative mt-3.5">
      <div
        ref={listRef}
        onScroll={updateFades}
        className="scrollbar-none flex max-h-40 flex-col gap-2 overflow-y-auto px-3.25"
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onTogglePending(option)}
            className="flex shrink-0 cursor-pointer items-center gap-2"
          >
            <Checkbox checked={pending.includes(option)} />
            <span className="text-caption whitespace-nowrap text-ink">{option}</span>
          </button>
        ))}
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-6 bg-linear-to-b from-card to-transparent transition-opacity duration-150 ${
          fade.top ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-linear-to-t from-card to-transparent transition-opacity duration-150 ${
          fade.bottom ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

/** Quiet active-filter chips. Positioning belongs to the caller — tables pin
 *  these in a sticky band under the cap so filter state survives scrolling. */
export function FilterChips<K extends string>({
  activeKeys,
  labels,
  filters,
  onClear,
}: {
  activeKeys: K[];
  labels: Record<K, string>;
  filters: Record<K, string[]>;
  onClear: (key: K) => void;
}) {
  if (activeKeys.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeKeys.map((key) => (
        <span
          key={key}
          className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-2 py-1.25 text-caption leading-none whitespace-nowrap text-ink-muted animate-chip-in"
        >
          {labels[key]}: {filters[key].join(", ")}
          <button
            type="button"
            aria-label={`Clear ${labels[key]} filter`}
            onClick={() => onClear(key)}
            className="cursor-pointer transition-colors duration-150 hover:text-ink"
          >
            <CloseIcon className="size-2.5" />
          </button>
        </span>
      ))}
    </div>
  );
}
