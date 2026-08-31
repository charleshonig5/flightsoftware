import type { Aircraft } from "@/lib/data/aircraft";
import { Button } from "@/components/ui/Button";
import { FleetScheduleTable } from "@/components/dashboard/FleetScheduleTable";
import { AddCircleIcon } from "@/components/ui/icons";

/**
 * Maintenance Schedule tab — the exact schedule-table UI from the dashboard
 * (column filter popovers, quiet filter chips, View item pills), scoped to
 * this aircraft.
 */
export function MaintenanceSchedule({ aircraft }: { aircraft: Aircraft }) {
  const { maintenance } = aircraft;

  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body font-semibold">Maintenance Schedule</h3>
          <p className="text-body text-ink-muted">
            {maintenance.overdue} overdue, {maintenance.upcoming} upcoming
          </p>
        </div>
        <Button variant="outline" size="lg">
          <AddCircleIcon className="size-5" />
          Add Item
        </Button>
      </div>

      <div className="mt-6">
        <FleetScheduleTable aircraft={aircraft} />
      </div>
    </div>
  );
}
