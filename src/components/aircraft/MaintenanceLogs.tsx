"use client";

import { useMemo, useState } from "react";
import type { Aircraft, MaintenanceLog } from "@/lib/data/aircraft";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { AddCircleIcon, FilterLinesIcon } from "@/components/ui/icons";

type SortKey = "date" | "type" | "component" | "totalTime" | "mechanic";

/* Column widths from the Figma table (title 278, date 131, type 128,
   component 172, hours 135, mechanic 153, actions) as fluid proportions. */
const TABLE_COLS = "grid-cols-[278fr_131fr_128fr_172fr_135fr_153fr_50px]";

const SORTABLE: { key: SortKey; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "type", label: "Type" },
  { key: "component", label: "Component" },
  { key: "totalTime", label: "Hours" },
  { key: "mechanic", label: "Mechanic" },
];

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${m}/${d}/${y}`;
};

const formatHours = (tt: number) =>
  `TT ${tt.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;

/** Maintenance Logs tab: searchable, sortable work-history table. */
export function MaintenanceLogs({ aircraft }: { aircraft: Aircraft }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);

  const logs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? aircraft.logs.filter((log) =>
          [log.title, log.type, log.component, log.mechanic, formatDate(log.date)].some((field) =>
            field.toLowerCase().includes(q),
          ),
        )
      : aircraft.logs;
    const dir = sortAsc ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      return (typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv))) * dir;
    });
  }, [aircraft.logs, query, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortAsc((asc) => !asc);
    } else {
      setSortKey(key);
      setSortAsc(key !== "date" && key !== "totalTime");
    }
  };

  const headerCell = (key: SortKey, label: string) => (
    <button
      key={key}
      type="button"
      onClick={() => toggleSort(key)}
      className={`flex cursor-pointer items-center gap-1.5 text-body transition-colors duration-150 ${
        sortKey === key ? "text-ink" : "text-ink-muted hover:text-ink"
      }`}
    >
      {label}
      <FilterLinesIcon
        className={`size-4 transition-transform duration-200 ${sortKey === key && sortAsc ? "rotate-180" : ""}`}
      />
    </button>
  );

  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body font-semibold">Maintenance Logs</h3>
          <p className="text-body text-ink-muted">
            {logs.length} record{logs.length === 1 ? "" : "s"} showing
          </p>
        </div>
        <div className="flex items-center gap-3.5">
          <SearchInput value={query} onChange={setQuery} placeholder="Search Maintenance History" />
          <Button variant="outline" size="lg">
            <AddCircleIcon className="size-5" />
            Log Maintenance
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-card bg-card">
        <div className={`grid ${TABLE_COLS} items-center border-b border-divider py-3.5 pr-6 pl-6`}>
          <span className="text-body text-ink-muted">Title</span>
          {SORTABLE.map(({ key, label }) => headerCell(key, label))}
          <span className="text-body text-ink-muted">Photos</span>
        </div>
        {logs.map((log) => (
          <LogRow key={`${log.date}-${log.title}`} log={log} />
        ))}
        {logs.length === 0 && (
          <p className="px-6 py-8 text-body text-ink-muted">No records match “{query}”.</p>
        )}
      </div>
    </div>
  );
}

function LogRow({ log }: { log: MaintenanceLog }) {
  return (
    <div
      className={`grid h-[51px] ${TABLE_COLS} items-center border-b border-divider px-6 transition-colors duration-150 last:border-b-0 hover:bg-tile/60`}
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
        className="cursor-pointer justify-self-start rounded-full bg-tile px-2 py-1 text-body text-ink-muted transition-colors duration-150 hover:bg-chip-neutral"
      >
        View
      </button>
    </div>
  );
}
