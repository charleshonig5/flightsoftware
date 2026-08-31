import type { Meter } from "@/lib/data/aircraft";
import { MeterTile } from "./MeterTile";

const MAX_GRID_COLS = 4;

/* Fewer than 4 meters: the tiles widen to share the full row. */
const gridColsClass = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
} as const;

/**
 * Corner rounding + border-overlap margins for a tile in the flush meter grid.
 * Every cell carries a full hairline border; -1px margins collapse shared
 * edges. Only cells actually sitting on a grid corner get rounded (a partial
 * last row leaves the bottom-right corner square, matching Figma).
 */
function tileShape(index: number, count: number, cols: number) {
  const col = index % cols;
  const row = Math.floor(index / cols);
  const lastRow = Math.floor((count - 1) / cols);
  const classes = ["rounded-none"];
  if (col > 0) classes.push("-ml-px");
  if (row > 0) classes.push("-mt-px");
  if (index === 0) classes.push("rounded-tl-field");
  if (row === 0 && (col === cols - 1 || index === count - 1)) classes.push("rounded-tr-field");
  if (col === 0 && row === lastRow) classes.push("rounded-bl-field");
  if (index === count - 1 && col === cols - 1) classes.push("rounded-br-field");
  return classes.join(" ");
}

/**
 * The v2 flush meter grid (dashboard aircraft-card pattern): 4-across cells
 * sharing single hairline borders, corner-only rounding. Used on dashboard
 * cards and the plane page's Overview tab.
 */
export function MeterGrid({
  meters,
  entrance = true,
  onEdit,
}: {
  meters: Meter[];
  /** Entrance animations (gauge draw-in, count-up) — dashboard only */
  entrance?: boolean;
  /** Opens the matching update flow with the clicked meter focused */
  onEdit?: (meter: Meter) => void;
}) {
  const cols = Math.min(meters.length, MAX_GRID_COLS) as keyof typeof gridColsClass;
  return (
    <div className={`grid ${gridColsClass[cols]}`}>
      {meters.map((meter, index) => (
        <MeterTile
          key={meter.label}
          meter={meter}
          index={index}
          entrance={entrance}
          shapeClassName={tileShape(index, meters.length, cols)}
          onEdit={onEdit ? () => onEdit(meter) : undefined}
        />
      ))}
    </div>
  );
}
