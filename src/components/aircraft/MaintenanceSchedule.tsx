"use client";

import { useState } from "react";
import type { Aircraft } from "@/lib/data/aircraft";
import { Button } from "@/components/ui/Button";
import { FleetScheduleTable } from "@/components/dashboard/FleetScheduleTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { AddCircleIcon } from "@/components/ui/icons";

/**
 * Maintenance Schedule tab — the exact schedule-table UI from the dashboard
 * (column filter popovers, quiet filter chips, View item pills), scoped to
 * this aircraft, with a keyword search alongside the action.
 */
export function MaintenanceSchedule({ aircraft }: { aircraft: Aircraft }) {
  const [query, setQuery] = useState("");

  return (
    <div>
      {/* Toolbar: action + search clustered at the standard 14px control gap */}
      <div className="flex items-center gap-3.5">
        <Button variant="outline" size="lg">
          <AddCircleIcon className="size-5" />
          Add Item
        </Button>
        <SearchInput value={query} onChange={setQuery} placeholder="Search Maintenance Schedule" />
      </div>

      <div className="mt-6">
        <FleetScheduleTable aircraft={aircraft} query={query} />
      </div>
    </div>
  );
}
