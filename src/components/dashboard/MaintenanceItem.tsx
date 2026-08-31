import type { MaintenanceItem as MaintenanceItemData } from "@/lib/data/aircraft";
import { Chip } from "@/components/ui/Chip";
import { ArrowUpRightIcon } from "@/components/ui/icons";

const barColor = {
  danger: "border-l-danger-soft",
  warning: "border-l-warning-soft",
  success: "border-l-success-soft",
} as const;

/**
 * Maintenance schedule row, v2 tile look: white with a hairline border and a
 * 4px status accent on the left edge (a true border, so it curls around the
 * rounded corners).
 */
export function MaintenanceItem({
  item,
  onClick,
}: {
  item: MaintenanceItemData;
  /** Deprecated v1 prop — v2 rows look the same on every surface. */
  surface?: "card" | "page";
  /** Opens the item detail modal */
  onClick?: () => void;
}) {
  return (
    <div
      data-interactive
      onClick={onClick}
      className={`group/row relative cursor-pointer overflow-hidden rounded-tile border border-l-4 border-divider bg-card transition-colors duration-150 hover:bg-tile ${
        barColor[item.status.level]
      }`}
    >
      <div className="flex items-end justify-between py-3.5 pr-3.5 pl-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-caption text-ink-muted">{item.category}</p>
            <p className="text-body font-semibold">{item.title}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {[item.interval, item.lastDone].map((text) => (
              <Chip key={text} tone="neutral-on-card">
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
