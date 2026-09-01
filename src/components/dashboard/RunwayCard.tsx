import { fleet, type StatusLevel } from "@/lib/data/aircraft";
import { Tooltip } from "@/components/ui/Tooltip";

/**
 * Maintenance Runway (lab prototype): the fleet's next 90 days as a
 * timeline — one row per aircraft, every schedule item due inside the
 * window plotted as a status-toned dot. The table answers "what's next";
 * this shows *density*: items clustering into one shop visit, two aircraft
 * down the same week, the clear stretches in between. KPI-bar surface
 * (hairline + `shadow-card-soft`) since it's designed to sit beside the
 * status cards.
 */

const WINDOW_DAYS = 90;
/** Nominal fleet utilization for hour-based items (hours → calendar days). */
const HOURS_PER_DAY = 1.5;

/* label column + track, mirroring the schedule table's structural col defs */
const RUNWAY_COLS = "grid-cols-[84px_1fr]";

const DOT_TONE: Record<StatusLevel, string> = {
  danger: "bg-danger",
  warning: "bg-warning",
  success: "bg-success",
};

/**
 * Day offset from today for a schedule item's status label, or null when it
 * falls outside the 90-day window. Overdue items pin to today — they're due
 * now, not in the past.
 */
function dueInDays(label: string): number | null {
  if (label.startsWith("Overdue")) return 0;
  const match = label.match(/^(?:Due in )?([\d.]+) (hours?|weeks?|months?|years?)/);
  if (!match) return null;
  const n = Number(match[1]);
  const unit = match[2];
  const days = unit.startsWith("hour")
    ? n / HOURS_PER_DAY
    : unit.startsWith("week")
      ? n * 7
      : unit.startsWith("month")
        ? n * 30
        : n * 365;
  return days <= WINDOW_DAYS ? days : null;
}

/* Month boundaries inside the window (from Aug 31, 2026): quiet gridlines.
   September starts at day 1 — Today owns the left edge, so no Sep tick. */
const MONTH_TICKS = [
  { label: "Oct", day: 31 },
  { label: "Nov", day: 62 },
];

const pct = (day: number) => `${(day / WINDOW_DAYS) * 100}%`;

export function RunwayCard() {
  const rows = fleet.map((aircraft) => ({
    tail: aircraft.tailNumber,
    items: aircraft.maintenance.items
      .map((item) => ({ item, day: dueInDays(item.status.label) }))
      .filter((entry): entry is { item: (typeof entry)["item"]; day: number } => entry.day !== null)
      .sort((a, b) => a.day - b.day),
  }));

  return (
    <div className="rounded-field border border-divider bg-card p-6 shadow-card-soft">
      <div className="flex items-center justify-between">
        <p className="text-caption leading-2.75 text-ink-muted">Maintenance Runway</p>
        <p className="text-caption leading-2.75 text-ink-muted">Next 90 days</p>
      </div>

      <div className={`mt-6 grid ${RUNWAY_COLS} gap-x-3.5`}>
        {rows.map(({ tail, items }) => (
          <div key={tail} className="col-span-2 grid grid-cols-subgrid">
            <p className="flex h-10 items-center text-body">{tail}</p>
            <div className="relative col-start-2 h-10">
              {/* month gridlines — rows stack flush, so the segments read as
                  continuous verticals down the chart */}
              {MONTH_TICKS.map(({ label, day }) => (
                <div
                  key={label}
                  aria-hidden
                  className="absolute inset-y-0 w-px bg-divider"
                  style={{ left: pct(day) }}
                />
              ))}
              {/* the track */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-divider" />
              {items.map(({ item, day }) => (
                <span
                  key={item.title}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: pct(day) }}
                >
                  <Tooltip title={item.status.label} content={item.title}>
                    {/* white ring keeps clustered dots legible (overlap reads
                        as a stack, not a blob) */}
                    <span
                      className={`block size-2.5 rounded-full ring-2 ring-card ${DOT_TONE[item.status.level]}`}
                    />
                  </Tooltip>
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* axis: Today at the left edge, month labels on their gridlines */}
        <div className="relative col-start-2 mt-2 h-3.5">
          <p className="absolute left-0 text-caption leading-2.75 text-ink-muted">Today</p>
          {MONTH_TICKS.map(({ label, day }) => (
            <p
              key={label}
              className="absolute -translate-x-1/2 text-caption leading-2.75 text-ink-muted"
              style={{ left: pct(day) }}
            >
              {label}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
