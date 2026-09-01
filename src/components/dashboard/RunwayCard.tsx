import { fleet, type MaintenanceItem } from "@/lib/data/aircraft";
import { Chip } from "@/components/ui/Chip";
import { Tooltip } from "@/components/ui/Tooltip";

/**
 * Maintenance Runway (lab prototype): the fleet's next 90 days as a
 * timeline — one band per aircraft, every schedule item due inside the
 * window rendered as a real status chip at its due position (the site's
 * status vocabulary, not abstract dots). Chips lane-stack when they'd
 * collide, so a crunch literally makes the band taller. KPI-bar surface
 * since the candidate home is beside the status cards.
 */

const WINDOW_DAYS = 90;
/** Nominal fleet utilization for hour-based items (hours → calendar days). */
const HOURS_PER_DAY = 1.5;
/** Two chips share a lane only with ~3 weeks of air between their starts
 *  (a full-width chip spans ~17 days at the design width). */
const LANE_GAP_DAYS = 21;

/** A chip's max footprint: `max-w-28` text (7rem) + the chip's 8px side
 *  paddings. Positions clamp against this so no chip can exit the card. */
const CHIP_MAX = "8rem";

/* label column + track, mirroring the schedule table's structural col defs */
const RUNWAY_COLS = "grid-cols-[84px_1fr]";

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

interface Placed {
  item: MaintenanceItem;
  day: number;
  lane: number;
}

/** First-fit lane packing: a chip drops to the next lane when the one
 *  before it in that lane started less than LANE_GAP_DAYS ago. */
function packLanes(entries: { item: MaintenanceItem; day: number }[]): {
  placed: Placed[];
  laneCount: number;
} {
  const laneEnds: number[] = [];
  const placed = entries.map(({ item, day }) => {
    let lane = laneEnds.findIndex((end) => day - end >= LANE_GAP_DAYS);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(day);
    } else {
      laneEnds[lane] = day;
    }
    return { item, day, lane };
  });
  return { placed, laneCount: Math.max(1, laneEnds.length) };
}

export function RunwayCard() {
  const rows = fleet.map((aircraft) => {
    const entries = aircraft.maintenance.items
      .map((item) => ({ item, day: dueInDays(item.status.label) }))
      .filter((entry): entry is { item: MaintenanceItem; day: number } => entry.day !== null)
      .sort((a, b) => a.day - b.day);
    return { tail: aircraft.tailNumber, ...packLanes(entries) };
  });

  return (
    <div className="rounded-field border border-divider bg-card p-6 shadow-card-soft">
      <div className="flex items-center justify-between">
        <p className="text-caption leading-2.75 text-ink-muted">Maintenance Runway</p>
        <p className="text-caption leading-2.75 text-ink-muted">Next 90 days</p>
      </div>

      <div className="relative mt-6">
        {rows.map(({ tail, placed, laneCount }) => (
          <div
            key={tail}
            className={`grid ${RUNWAY_COLS} items-center gap-x-3.5 border-b border-divider py-3.5 last:border-b-0`}
          >
            <p className="text-body">{tail}</p>
            <div className="relative" style={{ height: `${laneCount * 28 - 8}px` }}>
              {/* month gridlines, quiet and behind the chips */}
              {MONTH_TICKS.map(({ label, day }) => (
                <div
                  key={label}
                  aria-hidden
                  className="absolute -inset-y-3.5 w-px bg-divider"
                  style={{ left: pct(day) }}
                />
              ))}
              {placed.map(({ item, day, lane }) => (
                <span
                  key={item.title}
                  className="absolute"
                  style={{
                    left: `min(${pct(day)}, calc(100% - ${CHIP_MAX}))`,
                    top: `${lane * 28}px`,
                  }}
                >
                  <Tooltip title={item.status.label} content={item.title}>
                    <Chip tone={item.status.level}>
                      <span className="inline-block max-w-28 truncate">{item.title}</span>
                    </Chip>
                  </Tooltip>
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* axis: Today at the left edge, month labels on their gridlines */}
        <div className={`grid ${RUNWAY_COLS} gap-x-3.5`}>
          <div />
          <div className="relative mt-3.5 h-3.5">
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
    </div>
  );
}
