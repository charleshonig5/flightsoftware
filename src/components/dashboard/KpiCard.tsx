import type { FleetKpi } from "@/lib/data/aircraft";
import { Chip } from "@/components/ui/Chip";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  AircraftStatusIcon,
  CurrentItemsIcon,
  InfoIcon,
  OverdueItemsIcon,
  UpcomingItemsIcon,
} from "@/components/ui/icons";

const kpiIcon = {
  aircraft: AircraftStatusIcon,
  overdue: OverdueItemsIcon,
  upcoming: UpcomingItemsIcon,
  current: CurrentItemsIcon,
} as const;

/** Fleet KPI stat card: icon label, big count, status chip. */
export function KpiCard({ kpi }: { kpi: FleetKpi }) {
  const Icon = kpiIcon[kpi.icon];
  return (
    <div className="relative rounded-card bg-card p-6 pb-4 shadow-card">
      <div className="flex items-center gap-1 text-ink-muted">
        <Icon className="size-3.5" />
        <span className="text-caption">{kpi.label}</span>
      </div>
      {/* flex kills the line-box so the icon sits exactly at top-6, level with the label row */}
      <span className="absolute top-6 right-6 flex">
        <Tooltip content={kpi.info}>
          <span className="text-ink-faint transition-colors duration-150 group-hover/tip:text-brand group-focus-visible/tip:text-brand">
            <InfoIcon className="size-3.5" />
          </span>
        </Tooltip>
      </span>
      <div className="mt-3.5 flex items-end justify-between gap-2">
        <p className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="text-headline font-semibold">{kpi.value}</span>
          <span className="text-body">{kpi.unit}</span>
        </p>
        {/* 6px lift bottom-aligns the chip with the unit word's text box */}
        <span className="mb-1.5">
          <Chip tone={kpi.status.level}>{kpi.status.label}</Chip>
        </span>
      </div>
    </div>
  );
}
