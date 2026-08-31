"use client";

import { useState } from "react";
import Image from "next/image";
import type { Aircraft } from "@/lib/data/aircraft";

import { Chip } from "@/components/ui/Chip";
import { PillButton } from "@/components/ui/PillButton";
import { ImageIcon } from "@/components/ui/icons";
import { UpdateMetersModal } from "./UpdateMetersModal";
import { LogOilModal } from "./LogOilModal";
import { AskAiButton } from "@/components/layout/AskAiButton";

/** Aircraft page header: photo placeholder, identity, quick actions, Ask AI. */
export function AircraftHeader({ aircraft }: { aircraft: Aircraft }) {
  const [metersOpen, setMetersOpen] = useState(false);
  const [oilOpen, setOilOpen] = useState(false);
  return (
    <header className="flex items-start justify-between">
      <div className="flex items-center gap-6">
        <div className="flex h-26.25 w-38 shrink-0 items-center justify-center overflow-hidden rounded-tile border border-divider bg-tile">
          {aircraft.photo ? (
            <Image
              src={aircraft.photo}
              alt={aircraft.model}
              width={152}
              height={105}
              className="size-full object-cover"
            />
          ) : (
            <ImageIcon className="size-6 text-ink-faint" />
          )}
        </div>
        {/* Identity block matches the aircraft-card pattern (scaled up):
            SemiBold tail + chip, ink model line at the 6px gap */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-headline font-semibold">{aircraft.tailNumber}</h1>
            {aircraft.badge && <Chip tone="danger">{aircraft.badge}</Chip>}
          </div>
          <p className="text-body">{aircraft.model}</p>
          <div className="mt-4.5 flex items-center gap-2">
            <PillButton surface="page" onClick={() => setMetersOpen(true)}>
              Update Meters
            </PillButton>
            <PillButton surface="page" onClick={() => setOilOpen(true)}>
              Log Oil
            </PillButton>
          </div>
        </div>
      </div>
      <AskAiButton />

      <UpdateMetersModal aircraft={aircraft} open={metersOpen} onClose={() => setMetersOpen(false)} />
      <LogOilModal aircraft={aircraft} open={oilOpen} onClose={() => setOilOpen(false)} />
    </header>
  );
}
