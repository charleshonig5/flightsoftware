import { fleetStats } from "@/lib/data/aircraft";
import { Button } from "@/components/ui/Button";
import { CountBadge } from "@/components/ui/Chip";
import { AskAiButton } from "./AskAiButton";
import { AddCircleIcon } from "@/components/ui/icons";

/** Page header: title + fleet counts on the left, primary actions on the right. */
export function FleetHeader() {
  return (
    <header className="flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-headline font-semibold">Fleet Status</h1>
        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-1">
            <CountBadge textSize="body" surface="page">{fleetStats.aircraftCount}</CountBadge>
            <span className="text-body whitespace-nowrap text-ink-muted">Aircraft(s)</span>
          </span>
          <span className="flex items-center gap-1">
            <CountBadge textSize="body" surface="page">{fleetStats.trackedItems}</CountBadge>
            <span className="text-body whitespace-nowrap text-ink-muted">Tracked Items</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3.5">
        <Button variant="outline" size="lg">
          <AddCircleIcon className="size-5" />
          Add Aircraft
        </Button>
        <AskAiButton />
      </div>
    </header>
  );
}
