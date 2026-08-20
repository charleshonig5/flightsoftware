"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Aircraft } from "@/lib/data/aircraft";
import { Chip } from "@/components/ui/Chip";
import { PillButton } from "@/components/ui/PillButton";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { UpdateMetersModal, isUpdatableMeter } from "@/components/aircraft/UpdateMetersModal";
import { LogOilModal } from "@/components/aircraft/LogOilModal";
import { MaintenanceItemModal } from "@/components/aircraft/MaintenanceItemModal";
import { MeterTile } from "./MeterTile";
import { MaintenanceItem } from "./MaintenanceItem";

/** Meters shown while the card is collapsed; "View all" reveals the rest. */
const COLLAPSED_METER_COUNT = 4;

/** Full aircraft overview card: header, meter tiles, maintenance schedule. */
export function AircraftCard({
  aircraft,
  layout = "grid",
}: {
  aircraft: Aircraft;
  /** Dashboard view: full-width "list" cards fit 4 meter tiles per row */
  layout?: "grid" | "list";
}) {
  const { maintenance, meters } = aircraft;
  const [expanded, setExpanded] = useState(false);
  const [metersModal, setMetersModal] = useState<{ open: boolean; focusMeter?: string }>({
    open: false,
  });
  const [oilModal, setOilModal] = useState<{ open: boolean; focusOilMeter?: string }>({
    open: false,
  });
  const [itemModal, setItemModal] = useState<{ open: boolean; item: Aircraft["maintenance"]["items"][number] | null }>({
    open: false,
    item: null,
  });
  const router = useRouter();

  const editHandler = (meter: (typeof meters)[number]) =>
    isUpdatableMeter(meter)
      ? () => setMetersModal({ open: true, focusMeter: meter.label })
      : () => setOilModal({ open: true, focusOilMeter: meter.label });

  /* The whole card navigates to the aircraft page — except clicks on
     interactive children (buttons, links, maintenance rows). */
  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button, a, [data-interactive]")) return;
    router.push(`/aircraft/${aircraft.tailNumber}`);
  };
  /* List view always shows every meter — collapsing only applies to grid view */
  const collapsible = layout === "grid" && meters.length > COLLAPSED_METER_COUNT;
  const visibleMeters = collapsible ? meters.slice(0, COLLAPSED_METER_COUNT) : meters;
  const extraMeters = collapsible ? meters.slice(COLLAPSED_METER_COUNT) : [];
  const meterCols = layout === "list" ? "grid-cols-4" : "grid-cols-2";

  return (
    <section onClick={handleCardClick} className="group/card cursor-pointer rounded-card bg-card p-6 shadow-card">
      <header className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-title font-semibold">{aircraft.tailNumber}</h2>
            {aircraft.badge && <Chip tone="danger">{aircraft.badge}</Chip>}
          </div>
          <p className="text-body">{aircraft.model}</p>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2">
            <PillButton onClick={() => setMetersModal({ open: true })}>Update Meters</PillButton>
            <PillButton onClick={() => setOilModal({ open: true })}>Log Oil</PillButton>
          </div>
          <Link
            href={`/aircraft/${aircraft.tailNumber}`}
            aria-label={`View ${aircraft.tailNumber}`}
            data-nav
            className="text-ink-faint transition-all duration-150 ease-(--ease-snap) card-nav-hover:translate-x-0.5 card-nav-hover:-translate-y-0.5 card-nav-hover:text-ink-muted"
          >
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>
      </header>

      <div className={`mt-6 grid gap-3.5 ${meterCols}`}>
        {visibleMeters.map((meter, index) => (
          <MeterTile key={meter.label} meter={meter} index={index} onEdit={editHandler(meter)} />
        ))}
      </div>
      {collapsible && (
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out ${
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className={`grid gap-3.5 pt-3.5 ${meterCols}`}>
              {extraMeters.map((meter, index) => (
                <MeterTile key={meter.label} meter={meter} index={index} onEdit={editHandler(meter)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="mt-2 block cursor-pointer text-caption text-ink-muted transition-colors duration-150 hover:text-ink"
        >
          {expanded ? "Collapse" : "View all"}
        </button>
      )}

      {/* Link cards: grid → 8 → View all → 24 → header (≈45 total);
          link-less cards match with a straight 44 (mt-11) */}
      <div className={`flex items-start justify-between ${collapsible ? "mt-6" : "mt-11"}`}>
        <div className="flex flex-col gap-1">
          <h3 className="text-body">Maintenance Schedule</h3>
          <p className="text-caption text-ink-muted">
            {maintenance.overdue} overdue, {maintenance.upcoming} upcoming, {maintenance.current} current
          </p>
        </div>
        <PillButton href={`/aircraft/${aircraft.tailNumber}?tab=maintenance-schedule`}>
          Full Schedule
        </PillButton>
      </div>

      <div className="mt-3.5 flex flex-col gap-3.5">
        {maintenance.items.slice(0, 3).map((item) => (
          <MaintenanceItem
            key={item.title}
            item={item}
            onClick={() => setItemModal({ open: true, item })}
          />
        ))}
      </div>

      <UpdateMetersModal
        aircraft={aircraft}
        open={metersModal.open}
        focusMeter={metersModal.focusMeter}
        onClose={() => setMetersModal({ open: false })}
      />
      <LogOilModal
        aircraft={aircraft}
        open={oilModal.open}
        focusOilMeter={oilModal.focusOilMeter}
        onClose={() => setOilModal({ open: false })}
      />
      <MaintenanceItemModal
        item={itemModal.item}
        open={itemModal.open}
        onClose={() => setItemModal((m) => ({ ...m, open: false }))}
      />
    </section>
  );
}
