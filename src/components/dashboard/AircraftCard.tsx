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
import { MeterGrid } from "./MeterGrid";

/** v2 aircraft card: full-width header + flush 4-across meter grid. */
export function AircraftCard({ aircraft }: { aircraft: Aircraft }) {
  const { meters } = aircraft;
  const [metersModal, setMetersModal] = useState<{ open: boolean; focusMeter?: string }>({
    open: false,
  });
  const [oilModal, setOilModal] = useState<{ open: boolean; focusOilMeter?: string }>({
    open: false,
  });
  const router = useRouter();

  const editHandler = (meter: (typeof meters)[number]) =>
    isUpdatableMeter(meter)
      ? () => setMetersModal({ open: true, focusMeter: meter.label })
      : () => setOilModal({ open: true, focusOilMeter: meter.label });

  /* The whole card navigates to the aircraft page — except clicks on
     interactive children (buttons, links, meter tiles). */
  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button, a, [data-interactive]")) return;
    router.push(`/aircraft/${aircraft.tailNumber}`);
  };

  return (
    <section
      onClick={handleCardClick}
      className="group/card cursor-pointer rounded-field border border-divider bg-card p-6 shadow-card"
    >
      <header className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
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

      <div className="mt-6">
        <MeterGrid meters={meters} onEdit={(meter) => editHandler(meter)()} />
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
    </section>
  );
}
