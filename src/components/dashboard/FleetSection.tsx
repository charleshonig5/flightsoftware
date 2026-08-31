import { fleet } from "@/lib/data/aircraft";
import { AircraftCard } from "./AircraftCard";

/* Aircraft needing attention always surface to the top of the stack.
   (Display order only — the sidebar keeps registry order.) */
const sortedFleet = [...fleet].sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)));

/** v2 Aircraft(s) tab: full-width cards stacked with 14px gaps (no grid/list toggle). */
export function FleetSection() {
  return (
    <div className="flex flex-col gap-3.5">
      {sortedFleet.map((aircraft) => (
        <AircraftCard key={aircraft.tailNumber} aircraft={aircraft} />
      ))}
    </div>
  );
}
