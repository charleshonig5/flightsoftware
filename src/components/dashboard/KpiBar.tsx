import type { FleetKpi } from "@/lib/data/aircraft";
import { Chip } from "@/components/ui/Chip";
import { CountUp } from "@/components/ui/CountUp";
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

function KpiCell({ kpi, first, index }: { kpi: FleetKpi; first: boolean; index: number }) {
  const Icon = kpiIcon[kpi.icon];
  return (
    /* pb-5: optical bottom pad — the count's 36px line box carries ~7px of
       dead leading under the 28px digits, so 20px here reads like the top's 24 */
    <div className={`relative flex-1 p-6 pb-5 ${first ? "" : "border-l border-divider"}`}>
      <div className="flex items-center gap-2 text-ink-muted">
        <Icon className="size-3.5" />
        <span className="text-caption">{kpi.label}</span>
      </div>
      {/* flex kills the line-box so the icon sits exactly at top-6, level with the label row */}
      <span className="absolute top-6 right-6 flex">
        <Tooltip title={kpi.label} content={kpi.info}>
          <span className="text-ink-faint transition-colors duration-150 group-hover/tip:text-brand group-focus-visible/tip:text-brand">
            <InfoIcon className="size-3.5" />
          </span>
        </Tooltip>
      </span>
      <div className="mt-3.5 flex items-end justify-between gap-2">
        <p className="flex items-baseline gap-2.5 whitespace-nowrap">
          {/* counts up on first app load only, like the meter tiles */}
          <span className="text-headline font-semibold tabular-nums">
            <CountUp value={kpi.value} delayMs={index * 80} />
          </span>
          <span className="text-body">{kpi.unit}</span>
        </p>
        {/* 6px lift bottom-aligns the chip with the unit word's text box */}
        <span className="mb-1.5">
          <Chip tone="quiet">{kpi.status.label}</Chip>
        </span>
      </div>
    </div>
  );
}

/** v2 KPI bar: one hairline-bordered panel, four cells split by dividers. */
export function KpiBar({ kpis }: { kpis: FleetKpi[] }) {
  return (
    <div className="flex items-stretch rounded-field border border-divider bg-card shadow-card-soft">
      {kpis.map((kpi, index) => (
        <KpiCell key={kpi.label} kpi={kpi} first={index === 0} index={index} />
      ))}
    </div>
  );
}
