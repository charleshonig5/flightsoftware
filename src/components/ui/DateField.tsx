"use client";

import { useEffect, useRef, useState } from "react";
import { TextField } from "./TextField";
import { CalendarIcon, ChevronUpIcon } from "./icons";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const parseShort = (value: string): Date | null => {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, mm, dd, yy] = match.map(Number);
  const date = new Date(2000 + yy, mm - 1, dd);
  return date.getMonth() === mm - 1 ? date : null;
};

const formatShort = (date: Date) =>
  `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/**
 * Date form field with the system calendar picker. The input stays typeable
 * (MM/DD/YY); the calendar toggle opens a floating month grid above the field
 * (white card + `shadow-pop`, `animate-modal-in`). Escape or outside-click
 * closes the picker without touching the surrounding modal.
 */
export function DateField({
  label = "Date",
  value,
  onChange,
  className = "",
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => parseShort(value) ?? new Date());
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = parseShort(value);
  const today = new Date();

  useEffect(() => {
    if (!open) return;
    setView(parseShort(value) ?? new Date());
    const onDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    /* capture-phase so Escape closes the picker, not the modal behind it */
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        rightIcon={
          <button
            type="button"
            aria-label="Open calendar"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className={`flex cursor-pointer transition-colors duration-150 ${
              open ? "text-brand" : "text-ink-muted hover:text-brand"
            }`}
          >
            <CalendarIcon className="size-4" />
          </button>
        }
      />
      {open && (
        <div className="absolute bottom-full left-0 z-10 mb-1.5 w-max rounded-tile bg-card p-3.5 shadow-pop animate-modal-in">
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setView(new Date(year, month - 1, 1))}
              className="flex size-6 cursor-pointer items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-chip-neutral/60"
            >
              <ChevronUpIcon className="size-4 -rotate-90" />
            </button>
            <span className="text-body font-semibold">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setView(new Date(year, month + 1, 1))}
              className="flex size-6 cursor-pointer items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-chip-neutral/60"
            >
              <ChevronUpIcon className="size-4 rotate-90" />
            </button>
          </div>
          <div className="mt-2.5 grid grid-cols-7 gap-0.5">
            {WEEKDAYS.map((day, index) => (
              <span
                key={index}
                className="flex size-8 items-center justify-center text-caption text-ink-muted"
              >
                {day}
              </span>
            ))}
            {Array.from({ length: firstWeekday }, (_, index) => (
              <span key={`blank-${index}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const date = new Date(year, month, index + 1);
              const isSelected = selected ? sameDay(date, selected) : false;
              const isToday = sameDay(date, today);
              return (
                <button
                  key={index + 1}
                  type="button"
                  onClick={() => {
                    onChange(formatShort(date));
                    setOpen(false);
                  }}
                  className={`flex size-8 cursor-pointer items-center justify-center rounded-full text-body transition-colors duration-150 ${
                    isSelected
                      ? "bg-linear-to-r/srgb from-brand to-brand-strong text-white"
                      : `hover:bg-chip-neutral/60 ${isToday ? "text-brand" : ""}`
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
