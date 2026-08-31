"use client";

import { useMemo, useState } from "react";
import type { Aircraft, MaintenanceLog } from "@/lib/data/aircraft";
import { Button } from "@/components/ui/Button";
import {
  FilterChips,
  FilterHeaderCell,
  useColumnFilters,
} from "@/components/ui/columnFilters";
import { SearchInput } from "@/components/ui/SearchInput";
import { AddCircleIcon } from "@/components/ui/icons";

/* Column widths from the Figma table (title 278, date 131, type 128,
   component 172, hours 135, mechanic 153, actions) as fluid proportions. */
const TABLE_COLS = "grid-cols-[278fr_131fr_128fr_172fr_135fr_153fr_50px]";

type FilterKey = "date" | "type" | "component" | "mechanic";

const FILTER_LABELS: Record<FilterKey, string> = {
  date: "Date",
  type: "Type",
  component: "Component",
  mechanic: "Mechanic",
};

const FILTER_KEYS = Object.keys(FILTER_LABELS) as FilterKey[];

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${m}/${d}/${y}`;
};

const formatHours = (tt: number) =>
  `TT ${tt.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;

/** The value a log exposes to a filter column (Date filters by year). */
function rowValue(key: FilterKey, log: MaintenanceLog): string {
  switch (key) {
    case "date":
      return log.date.slice(0, 4);
    case "type":
      return log.type;
    case "component":
      return log.component;
    case "mechanic":
      return log.mechanic;
  }
}

const EMPTY_FILTERS: Record<FilterKey, string[]> = {
  date: [],
  type: [],
  component: [],
  mechanic: [],
};

/** Maintenance Logs tab — the v2 schedule-table pattern for the work history. */
export function MaintenanceLogs({ aircraft }: { aircraft: Aircraft }) {
  const filter = useColumnFilters(EMPTY_FILTERS);
  const [query, setQuery] = useState("");

  /* Fixed default order: newest first. */
  const allLogs = useMemo(
    () => [...aircraft.logs].sort((a, b) => b.date.localeCompare(a.date)),
    [aircraft.logs],
  );

  const options = useMemo(() => {
    const collect = (key: FilterKey) => [...new Set(allLogs.map((log) => rowValue(key, log)))];
    return {
      date: collect("date").sort().reverse(),
      type: collect("type"),
      component: collect("component"),
      mechanic: collect("mechanic"),
    } satisfies Record<FilterKey, string[]>;
  }, [allLogs]);

  const q = query.trim().toLowerCase();
  const logs = allLogs.filter(
    (log) =>
      FILTER_KEYS.every(
        (key) =>
          filter.filters[key].length === 0 || filter.filters[key].includes(rowValue(key, log)),
      ) &&
      (q === "" ||
        [log.title, log.type, log.component, log.mechanic, formatDate(log.date)].some((field) =>
          field.toLowerCase().includes(q),
        )),
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
    <div>
      {/* Toolbar: action + search clustered at the standard 14px control gap */}
      <div className="flex items-center gap-3.5">
        <Button variant="outline" size="lg">
          <AddCircleIcon className="size-5" />
          Log Maintenance
        </Button>
        <SearchInput value={query} onChange={setQuery} placeholder="Search Maintenance History" />
      </div>

      <div className="mt-6">
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
            <span className="text-body text-ink-muted">Title</span>
            {headerCell("date")}
            {headerCell("type")}
            {headerCell("component")}
            <span className="text-body text-ink-muted">Hours</span>
            {headerCell("mechanic")}
            <span className="text-body text-ink-muted">Photos</span>
          </div>
          <div key={rowsKey}>
          {logs.map((log, index) => (
            <div
              key={`${log.date}-${log.title}`}
              style={{ animationDelay: `${Math.min(index, 20) * 12}ms` }}
              className={`grid h-12 ${TABLE_COLS} items-center border-b border-divider px-6 transition-colors duration-150 last:border-b-0 hover:bg-tile animate-row-in`}
            >
              <button
                type="button"
                className="cursor-pointer truncate pr-3.5 text-left text-body text-brand hover:underline"
              >
                {log.title}
              </button>
              <span className="truncate pr-3.5 text-body">{formatDate(log.date)}</span>
              <span className="truncate pr-3.5 text-body">{log.type}</span>
              <span className="truncate pr-3.5 text-body">{log.component}</span>
              <span className="truncate pr-3.5 text-body">{formatHours(log.totalTime)}</span>
              <span className="truncate pr-3.5 text-body">{log.mechanic}</span>
              <button
                type="button"
                className="cursor-pointer justify-self-start rounded-card border border-divider bg-card px-2.5 py-1.5 text-caption font-medium whitespace-nowrap text-brand transition-colors duration-150 hover:bg-brand-soft"
              >
                View
              </button>
            </div>
          ))}
          </div>
          {logs.length === 0 && (
            <p className="px-6 py-6 text-body text-ink-muted">No records match the current filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
