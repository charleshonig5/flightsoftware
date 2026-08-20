"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { fleet } from "@/lib/data/aircraft";
import { AircraftCard } from "./AircraftCard";
import { GridIcon, ListIcon } from "@/components/ui/icons";

type View = "grid" | "list";

/** "Your Aircraft(s)" section: title, grid/list view toggle, aircraft cards. */
/* Aircraft needing attention always surface to the top of the stack.
   (Display order only — the sidebar keeps registry order.) */
const sortedFleet = [...fleet].sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)));

export function FleetSection() {
  const [view, setView] = useState<View>("grid");

  /** Morph the cards between layouts (View Transitions API, instant fallback). */
  const switchView = (next: View) => {
    if (next === view) return;
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => flushSync(() => setView(next)));
      // Skipped transitions (e.g. hidden tab) reject `ready`; the view still updates.
      transition.ready.catch(() => {});
    } else {
      setView(next);
    }
  };

  return (
    <section>
      <div className="flex items-center gap-3.5">
        <h2 className="text-title font-semibold">Your Aircraft(s)</h2>
        <div className="relative flex h-7.5 items-center rounded-full bg-card px-1">
          {/* sliding indicator behind the two segments */}
          <span
            className={`absolute left-1 h-5.5 w-7.5 rounded-full bg-tile transition-transform duration-200 ease-(--ease-snap) ${
              view === "list" ? "translate-x-full" : ""
            }`}
          />
          {(
            [
              { key: "grid", icon: GridIcon, label: "Grid view" },
              { key: "list", icon: ListIcon, label: "List view" },
            ] as const
          ).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              type="button"
              aria-label={label}
              aria-pressed={view === key}
              onClick={() => switchView(key)}
              className={`relative flex h-5.5 w-7.5 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ${
                view === key ? "text-brand" : "text-ink-muted hover:text-ink"
              }`}
            >
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>
      </div>
      {view === "grid" ? (
        /* Two independent stacks (masonry): expanding a card only pushes down
           its own column, not the neighboring one. */
        <div className="mt-3.5 grid grid-cols-1 items-start gap-3.5 xl:grid-cols-2">
          {[0, 1].map((column) => (
            <div key={column} className="flex flex-col gap-3.5">
              {sortedFleet
                .filter((_, index) => index % 2 === column)
                .map((aircraft) => (
                  <div
                    key={aircraft.tailNumber}
                    style={{ viewTransitionName: `card-${aircraft.tailNumber}` }}
                  >
                    <AircraftCard aircraft={aircraft} layout={view} />
                  </div>
                ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3.5 flex flex-col gap-3.5">
          {sortedFleet.map((aircraft) => (
            <div
              key={aircraft.tailNumber}
              style={{ viewTransitionName: `card-${aircraft.tailNumber}` }}
            >
              <AircraftCard aircraft={aircraft} layout={view} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
