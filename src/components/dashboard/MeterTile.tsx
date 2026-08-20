import type { Meter } from "@/lib/data/aircraft";
import { CountUp } from "@/components/ui/CountUp";
import { Gauge } from "@/components/ui/Gauge";
import { EditIcon } from "@/components/ui/icons";

/**
 * Stat tile: meter label, big reading, last-updated meta, usage gauge.
 * Fill follows the surface inversion rule: gray on a white card, white on the gray page.
 */
export function MeterTile({
  meter,
  surface = "card",
  index = 0,
  entrance = true,
  onEdit,
}: {
  meter: Meter;
  surface?: "card" | "page";
  /** Position among sibling tiles — staggers the gauge draw-in as a wave */
  index?: number;
  /** Entrance animations (gauge draw-in, count-up) — dashboard only */
  entrance?: boolean;
  /** Opens the matching update flow with this meter focused (omit for oil) */
  onEdit?: () => void;
}) {
  return (
    /* With onEdit, the whole tile opens the update modal (Edit is the visual
       affordance); data-interactive keeps dashboard card-click from navigating */
    <div
      onClick={onEdit}
      data-interactive={onEdit ? true : undefined}
      className={`group/tile relative rounded-tile p-3.5 ${surface === "page" ? "bg-card" : "bg-tile"} ${
        onEdit ? "cursor-pointer transition-colors duration-150 hover:bg-chip-neutral/60" : ""
      }`}
    >
      <div className="flex flex-col gap-1">
        <p className="text-caption">{meter.label}</p>
        <p className="flex items-baseline gap-2 text-stat font-semibold">
          {/* tabular-nums keeps digits from jittering while the value counts up */}
          <span className="tabular-nums">
            <CountUp value={meter.value} delayMs={index * 80} entrance={entrance} />
          </span>
          <span className="text-caption leading-none font-normal text-ink-muted">{meter.unit}</span>
        </p>
        <p className="text-caption text-ink-muted">{meter.meta}</p>
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onEdit?.();
        }}
        className="absolute top-3.5 right-3.5 flex cursor-pointer items-center gap-1 text-caption text-ink-faint transition-colors duration-150 group-hover/tile:text-ink-muted"
      >
        Edit
        <EditIcon className="size-3.5" />
      </button>
      <div className="absolute right-3.5 bottom-3.5">
        <Gauge percent={meter.percent} delayMs={index * 80} entrance={entrance} />
      </div>
    </div>
  );
}
