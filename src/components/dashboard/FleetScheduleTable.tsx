"use client";

import { useMemo, useState } from "react";
import { fleet, type Aircraft, type MaintenanceItem, type StatusLevel } from "@/lib/data/aircraft";
import { Chip } from "@/components/ui/Chip";
import {
  FilterChips,
  FilterHeaderCell,
  useColumnFilters,
} from "@/components/ui/columnFilters";
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

const FILTER_KEYS = Object.keys(FILTER_LABELS) as FilterKey[];

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

/**
 * v2 maintenance schedule table: filterable per column. Fleet-wide by
 * default; pass `aircraft` to scope it to one plane (identical UI).
 */
export function FleetScheduleTable({
  aircraft,
  query,
}: {
  aircraft?: Aircraft;
  /** Optional keyword filter (plane-page search bar) — ANDs with column filters */
  query?: string;
}) {
  const filter = useColumnFilters(EMPTY_FILTERS);
  const [detail, setDetail] = useState<{ open: boolean; item: MaintenanceItem | null }>({
    open: false,
    item: null,
  });

  /* Fixed default order: overdue first, then upcoming, then current. */
  const allRows = useMemo(() => {
    const source = aircraft ? [aircraft] : fleet;
    const all: Row[] = source.flatMap((a) => a.maintenance.items.map((item) => ({ aircraft: a, item })));
    return all.sort((a, b) => STATUS_ORDER[a.item.status.level] - STATUS_ORDER[b.item.status.level]);
  }, [aircraft]);

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

  const q = (query ?? "").trim().toLowerCase();
  const rows = allRows.filter(
    (row) =>
      FILTER_KEYS.every(
        (key) =>
          filter.filters[key].length === 0 || filter.filters[key].includes(rowValue(key, row)),
      ) &&
      (q === "" ||
        [
          row.item.title,
          row.item.category,
          row.item.status.label,
          row.item.lastDone,
          row.aircraft.tailNumber,
        ].some((field) => field.toLowerCase().includes(q))),
  );

  const activeKeys = FILTER_KEYS.filter((key) => filter.filters[key].length > 0);

  /* Remounting the row list when the result set changes replays the cascade */
  const rowsKey = `${q}|${FILTER_KEYS.map((key) => filter.filters[key].join(",")).join("|")}`;

  const headerCell = (key: FilterKey) => (
    <FilterHeaderCell
      key={key}
      label={FILTER_LABELS[key]}
      options={options[key]}
      active={filter.filters[key].length > 0}
      open={filter.openKey === key}
      pending={filter.pending}
      onToggleOpen={() => filter.toggleOpen(key)}
      onTogglePending={filter.togglePending}
      onApply={() => filter.apply(key)}
      onClear={() => filter.clear(key)}
    />
  );

  return (
    <>
      <FilterChips
        activeKeys={activeKeys}
        labels={FILTER_LABELS}
        filters={filter.filters}
        onClear={filter.clear}
      />

      <div className="rounded-field border border-divider bg-card shadow-card">
        {/* sticky: pins just below the sticky cap (--cap-h measured by the
            tab components) so column labels + filters survive long scrolls */}
        <div
          style={{ top: "var(--cap-h, 0px)" }}
          className={`sticky z-10 grid ${TABLE_COLS} items-center rounded-t-field border-b border-divider bg-card px-6 py-3.25`}
        >
          <span className="text-body text-ink-muted">Service Name</span>
          {headerCell("aircraft")}
          {headerCell("status")}
          {headerCell("type")}
          {headerCell("lastService")}
          <span className="text-body text-ink-muted">Action</span>
        </div>
        <div key={rowsKey}>
        {rows.map(({ aircraft: rowAircraft, item }, index) => (
          <div
            key={`${rowAircraft.tailNumber}-${item.title}`}
            style={{ animationDelay: `${Math.min(index, 20) * 12}ms` }}
            /* whole row opens the item — interactive children exempt (card pattern) */
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("button, a")) return;
              setDetail({ open: true, item });
            }}
            className={`grid h-12 ${TABLE_COLS} cursor-pointer items-center border-b border-divider px-6 transition-colors duration-150 last:border-b-0 hover:bg-tile animate-row-in`}
          >
            <button
              type="button"
              onClick={() => setDetail({ open: true, item })}
              className="cursor-pointer truncate pr-3.5 text-left text-body text-brand hover:underline"
            >
              {item.title}
            </button>
            <span className="truncate pr-3.5 text-body">{rowAircraft.tailNumber}</span>
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
        </div>
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
