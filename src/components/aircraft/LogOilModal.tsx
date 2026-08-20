"use client";

import { useEffect, useRef, useState } from "react";
import type { Aircraft, Meter } from "@/lib/data/aircraft";
import { todayShort } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { DateField } from "@/components/ui/DateField";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";

export interface Engine {
  label: string;
  /** The oil meter this engine's log belongs to */
  oilMeter: Meter;
}

/** Engines derive from the aircraft's oil meters: (L)→Left, (R)→Right. */
export function enginesFor(aircraft: Aircraft): Engine[] {
  const oilMeters = aircraft.meters.filter((m) => m.label.toLowerCase().includes("oil"));
  return oilMeters.map((oilMeter, index) => {
    const side = /\(L\)/.test(oilMeter.label) ? " (Left)" : /\(R\)/.test(oilMeter.label) ? " (Right)" : "";
    return { label: `Engine ${index + 1}${side}`, oilMeter };
  });
}

/** Segmented option: brand gradient when selected, tile otherwise. 4px radius. */
function Segment({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex h-7.5 flex-1 cursor-pointer items-center justify-center rounded text-caption whitespace-nowrap transition-colors duration-150 ${
        selected
          ? "bg-linear-to-r/srgb from-brand to-brand-strong text-white"
          : "bg-tile text-ink-muted hover:bg-chip-neutral"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Log Oil modal — scoped to one aircraft. Engine selector (hidden for
 * single-engine planes), oil level, tach time (prefilled per engine),
 * date, added-oil toggle, optional notes.
 */
export function LogOilModal({
  aircraft,
  open,
  onClose,
  focusOilMeter,
}: {
  aircraft: Aircraft;
  open: boolean;
  onClose: () => void;
  /** Oil meter label to preselect the engine (from a tile's Edit affordance) */
  focusOilMeter?: string;
}) {
  const engines = enginesFor(aircraft);
  const tachs = aircraft.meters.filter(
    (m) => !m.label.toLowerCase().includes("oil") && m.label !== "Hobbs",
  );
  const hobbs = aircraft.meters.find((m) => m.label === "Hobbs");

  const [engineIndex, setEngineIndex] = useState(0);
  const [oilLevel, setOilLevel] = useState("");
  const [tachTime, setTachTime] = useState("");
  const [date, setDate] = useState(todayShort());
  const [addedOil, setAddedOil] = useState(false);
  const [notes, setNotes] = useState("");
  const oilLevelRef = useRef<HTMLInputElement | null>(null);

  /* Reset on open; preselect the engine when opened from an oil tile */
  useEffect(() => {
    if (!open) return;
    const focusIndex = focusOilMeter
      ? Math.max(0, engines.findIndex((e) => e.oilMeter.label === focusOilMeter))
      : 0;
    setEngineIndex(focusIndex);
    setOilLevel("");
    setDate(todayShort());
    setAddedOil(false);
    setNotes("");
    requestAnimationFrame(() => oilLevelRef.current?.focus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, focusOilMeter]);

  /* Tach time follows the selected engine (falls back to Hobbs) */
  useEffect(() => {
    const source = tachs[engineIndex] ?? hobbs ?? tachs[0];
    setTachTime(source ? source.value.replace(/,/g, "") : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, engineIndex]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log Oil"
      subtitle={aircraft.tailNumber}
      titleInfo="Oil consumption is calculated from level and tach time across entries."
    >
      <div className="mt-6 flex flex-col gap-6">
        {engines.length > 1 && (
          <div className="flex flex-col gap-2">
            <p className="text-caption text-ink-muted">Engine</p>
            <div className="flex items-center gap-3.5">
              {engines.map((engine, index) => (
                <Segment
                  key={engine.label}
                  selected={engineIndex === index}
                  onClick={() => setEngineIndex(index)}
                >
                  {engine.label}
                </Segment>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3.5">
          <TextField
            label="Oil Level"
            unit="qts"
            inputMode="decimal"
            placeholder="e.g 6.5"
            value={oilLevel}
            onChange={setOilLevel}
            inputRef={(el) => {
              oilLevelRef.current = el;
            }}
          />
          <TextField
            label="Tach Time"
            unit="hrs"
            inputMode="decimal"
            value={tachTime}
            onChange={setTachTime}
          />
          <DateField value={date} onChange={setDate} />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-caption text-ink-muted">Added Oil?</p>
          <div className="flex items-center gap-3.5">
            <Segment selected={addedOil} onClick={() => setAddedOil(true)}>
              Yes
            </Segment>
            <Segment selected={!addedOil} onClick={() => setAddedOil(false)}>
              No
            </Segment>
          </div>
        </div>

        <TextField
          label="Notes (optional)"
          placeholder="e.g. Before XC to Oshkosh"
          value={notes}
          onChange={setNotes}
        />
      </div>

      <div className="mt-11 flex items-center gap-3.5">
        <Button fullWidth onClick={onClose}>
          Save
        </Button>
        <Button fullWidth variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
