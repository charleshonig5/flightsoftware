import type { MaintenanceItem as MaintenanceItemData } from "@/lib/data/aircraft";
import { Chip } from "@/components/ui/Chip";
import { ArrowUpRightIcon } from "@/components/ui/icons";

const barColor = {
  danger: "border-danger-soft",
  warning: "border-warning-soft",
  success: "border-success-soft",
} as const;

/**
 * Maintenance schedule row: status accent bar, task info, interval tags, due
 * chip. Surface inversion: gray row on a white card, white row on the gray page.
 */
export function MaintenanceItem({
  item,
  surface = "card",
  onClick,
}: {
  item: MaintenanceItemData;
  surface?: "card" | "page";
  /** Opens the item detail modal */
  onClick?: () => void;
}) {
  return (
    <div
      data-interactive
      onClick={onClick}
      className={`group/row relative cursor-pointer overflow-hidden rounded-tile border-l-4 transition-colors duration-150 hover:bg-chip-neutral/60 ${
        barColor[item.status.level]
      } ${surface === "page" ? "bg-card" : "bg-tile"}`}
    >
      {/* Accent is a true left border, so it curls around the rounded corners
          and tapers instead of getting clipped flat */}
      {/* Page rows tuck the status chip at the 14px inset; card rows use 24 */}
      <div
        className={`flex items-end justify-between py-3.5 pl-5 ${
          surface === "page" ? "pr-3.5" : "pr-6"
        }`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-caption text-ink-muted">{item.category}</p>
            <p className="text-body font-semibold">{item.title}</p>
          </div>
          {/* On white page rows the gray chips would vanish into the hover wash —
              they flip to white with the row hover to stay legible */}
          <div className="flex items-center gap-1.5">
            {[item.interval, item.lastDone].map((text) => (
              <Chip
                key={text}
                tone={surface === "page" ? "neutral-on-card" : "neutral"}
                className={
                  surface === "page"
                    ? "transition-colors duration-150 group-hover/row:bg-card"
                    : ""
                }
              >
                {text}
              </Chip>
            ))}
          </div>
        </div>
        <Chip tone={item.status.level}>{item.status.label}</Chip>
      </div>
      <ArrowUpRightIcon className="absolute top-3.5 right-3.5 size-4 text-ink-faint transition-all duration-150 ease-(--ease-snap) group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-ink-muted" />
    </div>
  );
}
