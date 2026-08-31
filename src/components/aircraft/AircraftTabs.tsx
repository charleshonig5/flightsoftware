"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Aircraft } from "@/lib/data/aircraft";
import { CountBadge } from "@/components/ui/Chip";
import { ChevronUpIcon } from "@/components/ui/icons";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { MeterGrid } from "@/components/dashboard/MeterGrid";
import { MaintenanceLogs } from "./MaintenanceLogs";
import { MaintenanceSchedule } from "./MaintenanceSchedule";
import { UpdateMetersModal, isUpdatableMeter } from "./UpdateMetersModal";
import { LogOilModal } from "./LogOilModal";

const TABS = [
  "Overview",
  "Maintenance Logs",
  "Maintenance Schedule",
  "Activity",
  "Oil",
  "Logbook",
  "ADs",
  "Documents",
  "Aircraft Info",
] as const;

type Tab = (typeof TABS)[number];

/** URL slug for a tab, e.g. "Maintenance Schedule" → "maintenance-schedule". */
export const tabSlug = (tab: string) => tab.toLowerCase().replace(/\s+/g, "-");

/**
 * Aircraft page header + tab bar + tab content. Deep-linkable via
 * `?tab=<slug>`. The header and tab bar live in one sticky block that pins
 * to the viewport top while tab content scrolls beneath it.
 */
export function AircraftTabs({
  aircraft,
  header,
}: {
  aircraft: Aircraft;
  /** The AircraftHeader — rendered inside the sticky block above the tabs */
  header?: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const requested = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<Tab>(
    TABS.find((tab) => tabSlug(tab) === requested) ?? "Overview",
  );
  const navRef = useRef<HTMLElement>(null);
  /* Counts ride in the tab badges, dashboard-style (Activity stays bare there too) */
  const tabCounts: Partial<Record<Tab, number>> = {
    "Maintenance Logs": aircraft.logs.length,
    "Maintenance Schedule": aircraft.maintenance.items.length,
  };
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const [metersModal, setMetersModal] = useState<{ open: boolean; focusMeter?: string }>({
    open: false,
  });
  const [oilModal, setOilModal] = useState<{ open: boolean; focusOilMeter?: string }>({
    open: false,
  });

  /* Mercury-style overflow: the row scrolls (scrollbar hidden) and each
     clipped edge shows a card-white fade as the affordance. */
  const [fade, setFade] = useState({ left: false, right: false });
  const updateFades = () => {
    const nav = navRef.current;
    if (!nav) return;
    setFade({
      left: nav.scrollLeft > 1,
      right: nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 1,
    });
  };

  /* One shared underline that slides to the active tab (instead of per-tab
     underlines popping in place). A ResizeObserver re-measures on any width
     change — including the Ask AI panel animating — and keeps the active tab
     scrolled into view. */
  useEffect(() => {
    const nav = navRef.current;
    const measure = () => {
      const button = nav?.querySelector<HTMLButtonElement>(`[data-tab="${tabSlug(activeTab)}"]`);
      if (button) {
        setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
        button.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
      }
      updateFades();
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (nav) observer.observe(nav);
    return () => observer.disconnect();
  }, [activeTab]);

  /* Mouse support: a vertical wheel over the row scrolls it horizontally.
     (Native listener — React registers JSX wheel handlers passively, so
     preventDefault would be ignored there.) */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onWheel = (event: WheelEvent) => {
      if (nav.scrollWidth <= nav.clientWidth) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      nav.scrollLeft += event.deltaY;
    };
    nav.addEventListener("wheel", onWheel, { passive: false });
    return () => nav.removeEventListener("wheel", onWheel);
  }, []);

  const scrollTabs = (direction: -1 | 1) =>
    navRef.current?.scrollBy({ left: direction * 240, behavior: "smooth" });

  const selectTab = (tab: Tab) => {
    setActiveTab(tab);
    // Keep the URL shareable without triggering a navigation
    const url = tab === "Overview" ? location.pathname : `${location.pathname}?tab=${tabSlug(tab)}`;
    history.replaceState(null, "", url);
  };

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
          header + tab bar — locked in place while the body scrolls.
          bg-page on the block itself keeps the rounded-corner notches ground-
          colored while white content slides behind them. */}
      <div className="sticky top-0 z-20 bg-page">
        {/* strip cover extends past the card edges so the glow's side bands
            can never peek beside the ground strip while pinned */}
        <div aria-hidden className="absolute top-0 -left-14 -right-6 h-6 bg-page" />
        <div className="h-6" />
        <div className="rounded-t-card border-x border-t border-divider bg-card px-10.75 pt-8.25">
          {header}
          {/* 46px to the tab bar — same rhythm as the dashboard's KPI → tabs gap */}
          <div className={`relative border-b border-divider ${header ? "mt-11.5" : ""}`}>
            <nav
              ref={navRef}
              onScroll={updateFades}
              className="scrollbar-none relative flex gap-8.5 overflow-x-auto"
            >
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              data-tab={tabSlug(tab)}
              onClick={() => selectTab(tab)}
              className={`flex shrink-0 cursor-pointer items-center gap-1 pb-3.5 text-body whitespace-nowrap transition-colors duration-150 ${
                activeTab === tab ? "text-brand" : "text-ink-muted hover:text-ink"
              }`}
            >
              {tab}
              {tabCounts[tab] !== undefined && (
                <CountBadge textSize="body">{tabCounts[tab]}</CountBadge>
              )}
            </button>
          ))}
          {indicator && (
            <span
              className="absolute bottom-0 h-0.5 bg-brand transition-[left,width] duration-250 ease-(--ease-snap)"
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
            </nav>
            {/* clipped-edge fades — the Mercury affordance for hidden tabs */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-card to-transparent transition-opacity duration-150 ${
                fade.left ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-card to-transparent transition-opacity duration-150 ${
                fade.right ? "opacity-100" : "opacity-0"
              }`}
            />
            {/* paddles: the 26px circular chip (activity-feed pattern) floats
                over the fade and pages the row — label-row centered */}
            {fade.left && (
              <button
                type="button"
                aria-label="Scroll tabs left"
                onClick={() => scrollTabs(-1)}
                className="absolute -top-0.5 left-0 flex size-6.5 cursor-pointer items-center justify-center rounded-full border border-divider bg-card text-ink-muted shadow-card transition-colors duration-150 hover:bg-tile hover:text-ink animate-chip-in"
              >
                <ChevronUpIcon className="size-3.5 -rotate-90" />
              </button>
            )}
            {fade.right && (
              <button
                type="button"
                aria-label="Scroll tabs right"
                onClick={() => scrollTabs(1)}
                className="absolute -top-0.5 right-0 flex size-6.5 cursor-pointer items-center justify-center rounded-full border border-divider bg-card text-ink-muted shadow-card transition-colors duration-150 hover:bg-tile hover:text-ink animate-chip-in"
              >
                <ChevronUpIcon className="size-3.5 rotate-90" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sheet body: continues the card downward, open-ended with the page scroll */}
      <div className="mb-6 flex-1 rounded-b-card border-x border-b border-divider bg-card px-10.75 pt-8.5 pb-10.75">
        {/* keyed so the entering panel fades/rises on every tab switch */}
        <div key={activeTab} className="animate-tab-in">
        {activeTab === "Overview" && (
          /* Same flush meter grid as the dashboard aircraft cards */
          <MeterGrid
            meters={aircraft.meters}
            entrance={false}
            onEdit={(meter) =>
              isUpdatableMeter(meter)
                ? setMetersModal({ open: true, focusMeter: meter.label })
                : setOilModal({ open: true, focusOilMeter: meter.label })
            }
          />
        )}
        {activeTab === "Maintenance Logs" && <MaintenanceLogs aircraft={aircraft} />}
        {activeTab === "Maintenance Schedule" && <MaintenanceSchedule aircraft={aircraft} />}
        {activeTab === "Activity" && <ActivityFeed tail={aircraft.tailNumber} />}
        {!["Overview", "Maintenance Logs", "Maintenance Schedule", "Activity"].includes(
          activeTab,
        ) && (
          <p className="text-body text-ink-muted">Nothing here yet — {activeTab} is coming soon.</p>
        )}
        </div>
      </div>

      <UpdateMetersModal
        aircraft={aircraft}
        open={metersModal.open}
        focusMeter={metersModal.focusMeter}
        onClose={() => setMetersModal({ open: false })}
      />
      <LogOilModal
        aircraft={aircraft}
        open={oilModal.open}
        focusOilMeter={oilModal.focusOilMeter}
        onClose={() => setOilModal({ open: false })}
      />
    </div>
  );
}
