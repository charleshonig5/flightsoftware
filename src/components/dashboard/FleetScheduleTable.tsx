"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fleet, type Aircraft, type MaintenanceItem, type StatusLevel } from "@/lib/data/aircraft";
import { Chip } from "@/components/ui/Chip";
import { Checkbox } from "@/components/ui/Checkbox";
import { CloseIcon, FilterLinesIcon } from "@/components/ui/icons";
import { MaintenanceItemModal } from "@/components/aircraft/MaintenanceItemModal";

interface Row {
  aircraft: Aircraft;
  item: MaintenanceItem;
}

/* Column proportions from the v2 Figma table (x: 24/376/490/647/846/992 @1095) */
const TABLE_COLS = "grid-cols-[352fr_114fr_157fr_199fr_146fr_79fr]";

const STATUS_ORDER: Record<StatusLevel, number> = { danger: 0, warning: 1, success: 2 };
const STATUS_LABELS: Record<StatusLevel, string> = {
  danger: "Overdue",
  warning: "Upcoming",
  success: "Current",
};

type FilterKey = "aircraft" | "status" | "type" | "lastService";

const FILTER_LABELS: Record<FilterKey, string> = {
  aircraft: "Aircraft",
  status: "Status",
  type: "Type",
  lastService: "Last Service",
};

/** The value a row exposes to a filter column (Last Service filters by year). */
function rowValue(key: FilterKey, { aircraft, item }: Row): string {
  switch (key) {
    case "aircraft":
      return aircraft.tailNumber;
    case "status":
      return STATUS_LABELS[item.status.level];
    case "type":
      return item.category;
    case "lastService":
      return item.lastDone.slice(-4);
  }
}

const EMPTY_FILTERS: Record<FilterKey, string[]> = {
  aircraft: [],
  status: [],
  type: [],
  lastService: [],
};

/** v2 fleet-wide maintenance schedule: every item, filterable per column. */
export function FleetScheduleTable() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);
  const [pending, setPending] = useState<string[]>([]);
  const [detail, setDetail] = useState<{ open: boolean; item: MaintenanceItem | null }>({
    open: false,
    item: null,
  });
  const popoverRef = useRef<HTMLDivElement>(null);

  /* Fixed default order: overdue first, then upcoming, then current. */
  const allRows = useMemo(() => {
    const all: Row[] = fleet.flatMap((aircraft) =>
      aircraft.maintenance.items.map((item) => ({ aircraft, item })),
    );
    return all.sort((a, b) => STATUS_ORDER[a.item.status.level] - STATUS_ORDER[b.item.status.level]);
  }, []);

  /* Distinct options per column, in first-seen order (status keeps severity order) */
  const options = useMemo(() => {
    const collect = (key: FilterKey) => [...new Set(allRows.map((row) => rowValue(key, row)))];
    return {
      aircraft: collect("aircraft"),
      status: (Object.keys(STATUS_ORDER) as StatusLevel[]).map((level) => STATUS_LABELS[level]),
      type: collect("type"),
      lastService: collect("lastService").sort(),
    } satisfies Record<FilterKey, string[]>;
  }, [allRows]);

  const rows = allRows.filter((row) =>
    (Object.keys(filters) as FilterKey[]).every(
      (key) => filters[key].length === 0 || filters[key].includes(rowValue(key, row)),
    ),
  );

  const activeKeys = (Object.keys(filters) as FilterKey[]).filter((key) => filters[key].length > 0);

  /* Popover dismissal: outside click or Escape */
  useEffect(() => {
    if (!openKey) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!popoverRef.current?.closest("[data-filter-cell]")?.contains(event.target as Node)) {
        setOpenKey(null);
      }
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

  const toggleOpen = (key: FilterKey) => {
    if (openKey === key) {
      setOpenKey(null);
    } else {
      setOpenKey(key);
      setPending(filters[key]);
    }
  };

  const togglePending = (value: string) =>
    setPending((current) =>
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    );

  const headerCell = (key: FilterKey) => {
    const active = filters[key].length > 0;
    return (
      <div key={key} data-filter-cell className="relative">
        <button
          type="button"
          onClick={() => toggleOpen(key)}
          className={`flex cursor-pointer items-center gap-1.5 text-body transition-colors duration-150 ${
            active || openKey === key ? "text-ink" : "text-ink-muted hover:text-ink"
          }`}
        >
          {FILTER_LABELS[key]}
          <FilterLinesIcon className="size-4" />
        </button>
        {openKey === key && (
          <div
            ref={popoverRef}
            className="absolute top-full left-0 z-10 mt-1.5 min-w-31.5 rounded-field border border-divider bg-card pt-3.25 shadow-card"
          >
            <p className="px-3.25 text-caption leading-2.75 whitespace-nowrap text-ink-muted">
              Filter by {FILTER_LABELS[key]}
            </p>
            <div className="mt-3.5 flex flex-col gap-2 px-3.25">
              {options[key].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => togglePending(option)}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox checked={pending.includes(option)} />
                  <span className="text-caption whitespace-nowrap text-ink">{option}</span>
                </button>
              ))}
            </div>
            <div className="mt-3.5 border-t border-divider" />
            <div className="flex items-center gap-3.5 px-3.25 py-2">
              <button
                type="button"
                onClick={() => {
                  setFilters((current) => ({ ...current, [key]: pending }));
                  setOpenKey(null);
                }}
                className="cursor-pointer text-caption font-medium whitespace-nowrap text-brand"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => {
                  setPending([]);
                  setFilters((current) => ({ ...current, [key]: [] }));
                }}
                className="cursor-pointer text-caption font-medium whitespace-nowrap text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {activeKeys.length > 0 && (
        /* Active-filter chips sit 20px under the tabs (14px above the table) */
        <div className="-mt-3.5 mb-3.5 flex flex-wrap items-center gap-2">
          {activeKeys.map((key) => (
            <span
              key={key}
              className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-2 py-1.25 text-caption leading-none whitespace-nowrap text-ink-muted"
            >
              {FILTER_LABELS[key]}: {filters[key].join(", ")}
              <button
                type="button"
                aria-label={`Clear ${FILTER_LABELS[key]} filter`}
                onClick={() => setFilters((current) => ({ ...current, [key]: [] }))}
                className="cursor-pointer transition-colors duration-150 hover:text-ink"
              >
                <CloseIcon className="size-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="rounded-field border border-divider bg-card shadow-card">
        <div className={`grid ${TABLE_COLS} items-center border-b border-divider px-6 py-3.25`}>
          <span className="text-body text-ink-muted">Service Name</span>
          {headerCell("aircraft")}
          {headerCell("status")}
          {headerCell("type")}
          {headerCell("lastService")}
          <span className="text-body text-ink-muted">Action</span>
        </div>
        {rows.map(({ aircraft, item }) => (
          <div
            key={`${aircraft.tailNumber}-${item.title}`}
            className={`grid h-12 ${TABLE_COLS} items-center border-b border-divider px-6 last:border-b-0`}
          >
            <button
              type="button"
              onClick={() => setDetail({ open: true, item })}
              className="cursor-pointer truncate pr-3.5 text-left text-body text-brand hover:underline"
            >
              {item.title}
            </button>
            <span className="truncate pr-3.5 text-body">{aircraft.tailNumber}</span>
            <span className="pr-3.5">
              <Chip tone={item.status.level}>{item.status.label}</Chip>
            </span>
            <span className="truncate pr-3.5 text-body">{item.category}</span>
            <span className="truncate pr-3.5 text-body">{item.lastDone.replace(/^Last /, "")}</span>
            <button
              type="button"
              onClick={() => setDetail({ open: true, item })}
              className="cursor-pointer justify-self-start rounded-card border border-divider bg-card px-2.5 py-1.5 text-caption font-medium whitespace-nowrap text-brand transition-colors duration-150 hover:bg-brand-soft"
            >
              View item
            </button>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="px-6 py-6 text-body text-ink-muted">No items match the current filters.</p>
        )}

        <MaintenanceItemModal
          item={detail.item}
          open={detail.open}
          onClose={() => setDetail((d) => ({ ...d, open: false }))}
        />
      </div>
    </>
  );
}
