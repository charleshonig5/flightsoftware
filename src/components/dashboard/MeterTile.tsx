import type { Meter } from "@/lib/data/aircraft";
import { CountUp } from "@/components/ui/CountUp";
import { Gauge } from "@/components/ui/Gauge";
import { EditIcon } from "@/components/ui/icons";

/**
 * v2 stat tile: white surface with a hairline border. Standalone tiles keep
 * the 10px tile radius; inside a card's flush grid the parent passes corner
 * rounding + overlap margins via `shapeClassName`.
 */
export function MeterTile({
  meter,
  index = 0,
  entrance = true,
  shapeClassName = "rounded-tile",
  onEdit,
}: {
  meter: Meter;
  /** Deprecated v1 prop — v2 tiles look the same on every surface. */
  surface?: "card" | "page";
  /** Position among sibling tiles — staggers the gauge draw-in as a wave */
  index?: number;
  /** Entrance animations (gauge draw-in, count-up) — dashboard only */
  entrance?: boolean;
  /** Shape overrides for flush grids (corner-only rounding, -px overlap margins) */
  shapeClassName?: string;
  /** Opens the matching update flow with this meter focused (omit for oil) */
  onEdit?: () => void;
}) {
  return (
    /* With onEdit, the whole tile opens the update modal (Edit is the visual
       affordance); data-interactive keeps dashboard card-click from navigating */
    <div
      onClick={onEdit}
      data-interactive={onEdit ? true : undefined}
      className={`group/tile relative border border-divider bg-card p-3.5 ${shapeClassName} ${
        onEdit ? "cursor-pointer transition-colors duration-150 hover:bg-tile" : ""
      }`}
    >
      <div className="flex flex-col gap-2">
        <p className="text-caption">{meter.label}</p>
        <p className="flex items-baseline gap-2 text-title">
          {/* tabular-nums keeps digits from jittering while the value counts up */}
          <span className="tabular-nums">
            <CountUp value={meter.value} delayMs={index * 80} entrance={entrance} />
          </span>
          <span className="text-caption leading-none text-ink-muted">{meter.unit}</span>
        </p>
        <p className="text-caption text-ink-muted">{meter.meta}</p>
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onEdit?.();
        }}
        /* Edit + gauge sit at the tile's uniform 14px inset (Figma drew 24 on
           the right, but it reads uneven against the 14px left padding) */
        className="absolute top-3.5 right-3.5 flex cursor-pointer items-center gap-2 text-caption text-ink-faint transition-colors duration-150 group-hover/tile:text-ink-muted"
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
