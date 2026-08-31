import Link from "next/link";
import { activityMonths, type ActivityKind } from "@/lib/data/activity";
import {
  AircraftIcon,
  AlertTriangleIcon,
  ArrowUpRightIcon,
  MeterActivityIcon,
  OilDropIcon,
  RecordsActivityIcon,
  ToolboxIcon,
} from "@/components/ui/icons";

/* Every action type gets an icon that reads at a glance */
const kindIcon: Record<ActivityKind, typeof ToolboxIcon> = {
  meters: MeterActivityIcon,
  oil: OilDropIcon,
  maintenance: ToolboxIcon,
  status: AlertTriangleIcon,
  records: RecordsActivityIcon,
  fleet: AircraftIcon,
};

/**
 * v2 activity feed (Figma 117:581): one padded panel, month groups under
 * hairline rules, rows of icon chip + time/date meta + sentence ending in a
 * brand tail-number link with a ↗.
 */
export function ActivityFeed() {
  return (
    <div className="rounded-field border border-divider bg-card p-6 shadow-card">
      <div className="flex flex-col gap-8.5">
        {activityMonths.map(({ month, items }) => (
          <section key={month}>
            <div className="flex items-center gap-3.5">
              <h3 className="text-body">{month}</h3>
              <span className="text-caption text-ink-muted">
                {items.length} Item{items.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-2 border-b border-divider" />
            <ul className="mt-6 flex flex-col gap-6">
              {items.map((item) => {
                const Icon = kindIcon[item.kind];
                return (
                  <li key={`${item.date}-${item.time}`} className="flex items-start gap-3.5">
                    <span className="flex size-6.5 shrink-0 items-center justify-center rounded-full border border-divider bg-brand-soft text-ink-muted shadow-card">
                      <Icon className="size-3.5" />
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <p className="flex items-center gap-3.5 text-caption text-ink-muted">
                        <span>{item.time}</span>
                        <span>{item.date}</span>
                      </p>
                      <p className="text-body">
                        {item.text}{" "}
                        <Link
                          href={`/aircraft/${item.tail}`}
                          className="inline-flex items-center gap-0.5 align-bottom text-brand hover:underline"
                        >
                          {item.tail}
                          <ArrowUpRightIcon className="size-4" />
                        </Link>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
