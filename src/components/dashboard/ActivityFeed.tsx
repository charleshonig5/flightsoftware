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
 * brand tail-number link with a ↗. Pass `tail` to scope it to one aircraft —
 * scoped feeds drop the tail link (the plane is already the context) and
 * trim the sentence's trailing "on"/"as" connector.
 */
export function ActivityFeed({ tail }: { tail?: string }) {
  const months = tail
    ? activityMonths
        .map(({ month, items }) => ({ month, items: items.filter((item) => item.tail === tail) }))
        .filter(({ items }) => items.length > 0)
    : activityMonths;

  /* Rows cascade across the whole feed (running index spans month groups) */
  let runningIndex = 0;

  if (months.length === 0) {
    return (
      <div className="rounded-field border border-divider bg-card p-6 shadow-card">
        <p className="text-body text-ink-muted">No activity for this aircraft yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-field border border-divider bg-card p-6 shadow-card">
      <div className="flex flex-col gap-8.5">
        {months.map(({ month, items }) => (
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
                const delay = Math.min(runningIndex++, 20) * 12;
                return (
                  <li
                    key={`${item.date}-${item.time}`}
                    style={{ animationDelay: `${delay}ms` }}
                    className="flex items-start gap-3.5 animate-row-in"
                  >
                    <span className="flex size-6.5 shrink-0 items-center justify-center rounded-full border border-divider bg-brand-soft text-ink-muted shadow-card">
                      <Icon className="size-3.5" />
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <p className="flex items-center gap-3.5 text-caption text-ink-muted">
                        <span>{item.time}</span>
                        <span>{item.date}</span>
                      </p>
                      {tail ? (
                        /* Scoped feed: the plane is the context — no tail link */
                        <p className="text-body">{item.text.replace(/,? (on|as)$/, "")}</p>
                      ) : (
                        <p className="text-body">
                          {item.text}{" "}
                          <Link
                            href={`/aircraft/${item.tail}`}
                            className="group/tail inline-flex items-center gap-0.5 align-bottom text-brand hover:underline"
                          >
                            {item.tail}
                            {/* same nudge as the aircraft-card nav arrow */}
                            <ArrowUpRightIcon className="size-4 transition-transform duration-150 ease-(--ease-snap) group-hover/tail:translate-x-0.5 group-hover/tail:-translate-y-0.5" />
                          </Link>
                        </p>
                      )}
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
