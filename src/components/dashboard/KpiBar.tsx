import type { FleetKpi } from "@/lib/data/aircraft";
import { Chip } from "@/components/ui/Chip";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  AircraftStatusIcon,
  CurrentItemsIcon,
  InfoIcon,
  OverdueItemsIcon,
  TrendUpIcon,
  UpcomingItemsIcon,
} from "@/components/ui/icons";

const kpiIcon = {
  aircraft: AircraftStatusIcon,
  overdue: OverdueItemsIcon,
  upcoming: UpcomingItemsIcon,
  current: CurrentItemsIcon,
} as const;

/** Week-over-week delta: trend glyph + amount, caption Medium, colored by
 *  SENTIMENT (overdue up = red, current up = green — the sanctioned delta
 *  exception to status-colors-only-in-chips). Hover explains the period;
 *  a no-change week renders nothing. */
function KpiDelta({ kpi }: { kpi: FleetKpi }) {
  const { change, good } = kpi.delta;
  if (change === 0) return null;
  return (
    <Tooltip content={`${change > 0 ? "Up" : "Down"} ${Math.abs(change)} vs last week`}>
      <span
        className={`flex items-center gap-1 text-caption font-medium ${
          good ? "text-success" : "text-danger"
        }`}
      >
        <TrendUpIcon className={`size-3 ${change < 0 ? "-scale-y-100" : ""}`} />
        {Math.abs(change)}
      </span>
    </Tooltip>
  );
}

function KpiCell({ kpi, first }: { kpi: FleetKpi; first: boolean }) {
  const Icon = kpiIcon[kpi.icon];
  return (
    /* pb-5: optical bottom pad — the count's 36px line box carries ~7px of
       dead leading under the 28px digits, so 20px here reads like the top's 24 */
    <div className={`relative flex-1 p-6 pb-5 ${first ? "" : "border-l border-divider"}`}>
      <div className="flex items-center gap-2 text-ink-muted">
        <Icon className="size-3.5" />
        <span className="text-caption">{kpi.label}</span>
      </div>
      {/* flex kills the line-box so the cluster sits exactly at top-6, level
          with the label row — delta first, then the info icon, at the 14px
          control gap */}
      <span className="absolute top-6 right-6 flex items-center gap-3.5">
        <KpiDelta kpi={kpi} />
        <Tooltip content={kpi.info}>
          <span className="text-ink-faint transition-colors duration-150 group-hover/tip:text-brand group-focus-visible/tip:text-brand">
            <InfoIcon className="size-3.5" />
          </span>
        </Tooltip>
      </span>
      <div className="mt-3.5 flex items-end justify-between gap-2">
        <p className="flex items-baseline gap-2.5 whitespace-nowrap">
          <span className="text-headline font-semibold">{kpi.value}</span>
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
        <KpiCell key={kpi.label} kpi={kpi} first={index === 0} />
      ))}
    </div>
  );
}
