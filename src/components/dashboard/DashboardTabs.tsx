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

/**
 * v2 dashboard tabs: label + count badge, sliding brand underline. The
 * `header` slot (greeting + KPI bar) rides in one sticky block with the tab
 * bar, pinned to the viewport while tab content scrolls beneath.
 */
export function DashboardTabs({ header }: { header?: React.ReactNode }) {
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
    /* min-h-screen: the column already contains the 24px top strip and the
       body's 24px bottom margin, so full viewport height = equal margins. */
    <div className="relative flex min-h-screen flex-col">
      {/* The card's single glow: an empty layer on the card's exact layout
          bounds, statically clipped to sides + bottom only — its shape never
          changes with scroll, and it paints below the sticky mask. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-6 bottom-6 rounded-card shadow-card [clip-path:inset(0_-58px_-58px)]"
      />
      {/* Sticky cap: the 24px ground strip + the sheet's rounded top edge,
          greeting/KPI/tab bar — locked in place while the body scrolls.
          bg-page on the block itself keeps the rounded-corner notches ground-
          colored while white content slides behind them. */}
      <div className="sticky top-0 z-20 bg-page">
        {/* strip cover extends past the card edges so the glow's side bands
            can never peek beside the ground strip while pinned */}
        <div aria-hidden className="absolute top-0 -left-14 -right-6 h-6 bg-page" />
        <div className="h-6" />
        <div className="rounded-t-card border-x border-t border-divider bg-card px-10.75 pt-8.25">
          {header}
          <div className={`border-b border-divider ${header ? "mt-11.5" : ""}`}>
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
        </div>
      </div>

      {/* Sheet body: continues the card downward, open-ended with the page scroll */}
      <div className="mb-6 flex-1 rounded-b-card border-x border-b border-divider bg-card px-10.75 pt-8.5 pb-10.75">
        {/* keyed so the entering panel fades/rises on every tab switch */}
        <div key={activeTab} className="animate-tab-in">
          {activeTab === "Aircraft(s)" && <FleetSection />}
          {activeTab === "Maintenance Schedule" && <FleetScheduleTable />}
          {activeTab === "Activity" && <ActivityFeed />}
        </div>
      </div>
    </div>
  );
}
