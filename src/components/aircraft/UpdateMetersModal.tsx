"use client";

import { useEffect, useRef, useState } from "react";
import type { Aircraft, Meter } from "@/lib/data/aircraft";
import { todayShort } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { DateField } from "@/components/ui/DateField";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";

/** Hobbs + tach meters belong to this modal; oil has its own flow. */
export const isUpdatableMeter = (meter: Meter) => !meter.label.toLowerCase().includes("oil");

/**
 * Update Meters modal — scoped to one aircraft. Hobbs full-width on top,
 * tach fields in a 2-up grid (a lone odd tach spans full width), date last.
 * Pre-filled with the plane's current readings; opening from a tile's Edit
 * focuses and selects that meter's field.
 */
export function UpdateMetersModal({
  aircraft,
  open,
  onClose,
  focusMeter,
}: {
  aircraft: Aircraft;
  open: boolean;
  onClose: () => void;
  /** Meter label to focus on open (from a tile's Edit affordance) */
  focusMeter?: string;
}) {
  const meters = aircraft.meters.filter(isUpdatableMeter);
  const hobbs = meters.filter((m) => m.label === "Hobbs");
  const tachs = meters.filter((m) => m.label !== "Hobbs");
  const [values, setValues] = useState<Record<string, string>>({});
  const [date, setDate] = useState(todayShort());
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  /* Re-seed unformatted values each time the modal opens */
  useEffect(() => {
    if (!open) return;
    setValues(Object.fromEntries(meters.map((m) => [m.label, m.value.replace(/,/g, "")])));
    setDate(todayShort());
    const target = focusMeter && inputRefs.current[focusMeter];
    if (target) {
      requestAnimationFrame(() => {
        target.focus();
        target.select();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, focusMeter]);

  const meterField = (meter: Meter, fullWidth: boolean) => (
    <TextField
      key={meter.label}
      label={meter.label}
      unit={meter.unit}
      inputMode="decimal"
      value={values[meter.label] ?? ""}
      onChange={(value) => setValues((v) => ({ ...v, [meter.label]: value }))}
      inputRef={(el) => {
        inputRefs.current[meter.label] = el;
      }}
      className={fullWidth ? "col-span-2" : ""}
    />
  );

  return (
    <Modal open={open} onClose={onClose} title="Update Meters" subtitle={aircraft.tailNumber}>
      <div className="mt-6 grid grid-cols-2 gap-3.5">
        {hobbs.map((meter) => meterField(meter, true))}
        {tachs.map((meter, index) =>
          meterField(meter, index === tachs.length - 1 && tachs.length % 2 === 1),
        )}
        <DateField value={date} onChange={setDate} className="col-span-2" />
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
