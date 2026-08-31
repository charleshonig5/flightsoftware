"use client";

import { useEffect, useRef, useState } from "react";
import type { Aircraft, MaintenanceItem as MaintenanceItemData, StatusLevel } from "@/lib/data/aircraft";
import { Button } from "@/components/ui/Button";
import { MaintenanceItemModal } from "./MaintenanceItemModal";
import { SearchInput } from "@/components/ui/SearchInput";
import { MaintenanceItem } from "@/components/dashboard/MaintenanceItem";
import { AddCircleIcon, CheckIcon, ChevronUpIcon } from "@/components/ui/icons";

type StatusFilter = "all" | StatusLevel;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "danger", label: "Overdue" },
  { value: "warning", label: "Upcoming" },
  { value: "success", label: "Current" },
];

/** White pill dropdown for filtering by status (floating menu, shadow-pop). */
function StatusSelect({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  const active = STATUS_OPTIONS.find((option) => option.value === value)!;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-41 cursor-pointer items-center justify-between rounded-full border border-divider bg-card px-4 text-body whitespace-nowrap transition-colors duration-150 hover:bg-chip-neutral"
      >
        <span className={value === "all" ? "text-ink-faint" : "text-ink"}>
          {value === "all" ? "Select Status" : active.label}
        </span>
        <ChevronUpIcon
          className={`size-4 text-ink-muted transition-transform duration-200 ${open ? "" : "rotate-180"}`}
        />
      </button>
      {open && (
        <div className="absolute top-full right-0 z-10 mt-1.5 w-max min-w-full rounded-field border border-divider bg-card p-1.5 shadow-card animate-modal-in">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`flex w-full cursor-pointer items-center justify-between gap-6 rounded px-2.5 py-1.5 text-left text-body whitespace-nowrap transition-colors duration-150 hover:bg-tile ${
                option.value === value ? "text-brand" : "text-ink"
              }`}
            >
              {option.label}
              {option.value === value && <CheckIcon className="size-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Maintenance Schedule tab: searchable, status-filterable schedule timeline. */
export function MaintenanceSchedule({ aircraft }: { aircraft: Aircraft }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [detailItem, setDetailItem] = useState<MaintenanceItemData | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { maintenance } = aircraft;

  const q = query.trim().toLowerCase();
  const items = maintenance.items.filter((item) => {
    if (status !== "all" && item.status.level !== status) return false;
    if (!q) return true;
    return [item.title, item.category, item.interval, item.status.label].some((field) =>
      field.toLowerCase().includes(q),
    );
  });

  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body font-semibold">Maintenance Schedule</h3>
          <p className="text-body text-ink-muted">
            {maintenance.overdue} overdue, {maintenance.upcoming} upcoming
          </p>
        </div>
        <div className="flex items-center gap-3.5">
          <SearchInput value={query} onChange={setQuery} placeholder="Search Maintenance Schedule" />
          <StatusSelect value={status} onChange={setStatus} />
          <Button variant="outline" size="lg">
            <AddCircleIcon className="size-5" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Full-width schedule rows sit at the tighter 8px rhythm (per Figma) */}
      <div className="mt-6 flex flex-col gap-2">
        {items.map((item) => (
          <MaintenanceItem
            key={item.title}
            item={item}
            surface="page"
            onClick={() => {
              setDetailItem(item);
              setDetailOpen(true);
            }}
          />
        ))}
        {items.length === 0 && (
          <p className="py-8 text-body text-ink-muted">No items match the current filters.</p>
        )}
      </div>

      <MaintenanceItemModal item={detailItem} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
