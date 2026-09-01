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
 * edges. A corner rounds whenever BOTH edges meeting at it are exposed (no
 * neighbor beyond either edge) — so a partial last row rounds its stepped
 * outer corners too, while the step's inner junctions stay square.
 */
function tileShape(index: number, count: number, cols: number) {
  const col = index % cols;
  const row = Math.floor(index / cols);
  const noRight = col === cols - 1 || index === count - 1;
  const noBelow = index + cols >= count;
  const classes = ["rounded-none"];
  if (col > 0) classes.push("-ml-px");
  if (row > 0) classes.push("-mt-px");
  if (index === 0) classes.push("rounded-tl-field");
  if (row === 0 && noRight) classes.push("rounded-tr-field");
  if (col === 0 && noBelow) classes.push("rounded-bl-field");
  if (noRight && noBelow) classes.push("rounded-br-field");
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
  glow = false,
  onEdit,
}: {
  meters: Meter[];
  /** Entrance animations (gauge draw-in, count-up) — dashboard only */
  entrance?: boolean;
  /** The site glow behind the block (plane Overview, where the grid sits
   *  directly on the sheet) — off inside already-glowing dashboard cards */
  glow?: boolean;
  /** Opens the matching update flow with the clicked meter focused */
  onEdit?: (meter: Meter) => void;
}) {
  const cols = Math.min(meters.length, MAX_GRID_COLS) as keyof typeof gridColsClass;
  return (
    /* drop-shadow traces the tiles' painted silhouette, so a partial last
       row casts a stepped shadow, never the empty bounding rectangle */
    <div className={`grid ${gridColsClass[cols]} ${glow ? "drop-shadow-card" : ""}`}>
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
