"use client";

import { useEffect, useRef, useState } from "react";
import { fleet, fleetStats } from "@/lib/data/aircraft";
import { FleetSection } from "./FleetSection";
import { FleetScheduleTable } from "./FleetScheduleTable";
import { ActivityFeed } from "./ActivityFeed";

const TABS = [
  { label: "Aircraft(s)", count: fleet.length },
  { label: "Maintenance Schedule", count: fleetStats.trackedItems },
  { label: "Activity", count: null },
] as const;

type TabLabel = (typeof TABS)[number]["label"];

/** v2 dashboard tabs: label + count badge, sliding brand underline. */
export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabLabel>("Aircraft(s)");
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const button = navRef.current?.querySelector<HTMLButtonElement>(
        `[data-tab="${activeTab}"]`,
      );
      if (button) setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeTab]);

  return (
    <div>
      <div className="border-b border-divider">
        <nav ref={navRef} className="relative flex gap-8.5">
          {TABS.map(({ label, count }) => {
            const active = activeTab === label;
            return (
              <button
                key={label}
                type="button"
                data-tab={label}
                onClick={() => setActiveTab(label)}
                className={`flex cursor-pointer items-center gap-1 pb-3.5 text-body whitespace-nowrap transition-colors duration-150 ${
                  active ? "text-brand" : "text-ink-muted hover:text-ink"
                }`}
              >
                {label}
                {count !== null && (
                  /* badge stays tile/muted even on the active tab (Figma) — 14px text */
                  <span className="inline-flex items-center rounded-full bg-tile px-2 py-1 text-body leading-none text-ink-muted">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          {indicator && (
            <span
              className="absolute bottom-0 h-0.5 bg-brand transition-[left,width] duration-250 ease-(--ease-snap)"
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
        </nav>
      </div>

      <div className="mt-8.5">
        {activeTab === "Aircraft(s)" && <FleetSection />}
        {activeTab === "Maintenance Schedule" && <FleetScheduleTable />}
        {activeTab === "Activity" && <ActivityFeed />}
      </div>
    </div>
  );
}
