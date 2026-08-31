"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Aircraft } from "@/lib/data/aircraft";
import { MeterGrid } from "@/components/dashboard/MeterGrid";
import { MaintenanceLogs } from "./MaintenanceLogs";
import { MaintenanceSchedule } from "./MaintenanceSchedule";
import { UpdateMetersModal, isUpdatableMeter } from "./UpdateMetersModal";
import { LogOilModal } from "./LogOilModal";

const TABS = [
  "Overview",
  "Maintenance Logs",
  "Maintenance Schedule",
  "Oil",
  "Logbook",
  "ADs",
  "Documents",
  "Aircraft Info",
] as const;

type Tab = (typeof TABS)[number];

/** URL slug for a tab, e.g. "Maintenance Schedule" → "maintenance-schedule". */
export const tabSlug = (tab: string) => tab.toLowerCase().replace(/\s+/g, "-");

/** Aircraft page tab bar + tab content. Deep-linkable via `?tab=<slug>`. */
export function AircraftTabs({ aircraft }: { aircraft: Aircraft }) {
  const searchParams = useSearchParams();
  const requested = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<Tab>(
    TABS.find((tab) => tabSlug(tab) === requested) ?? "Overview",
  );
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const [metersModal, setMetersModal] = useState<{ open: boolean; focusMeter?: string }>({
    open: false,
  });
  const [oilModal, setOilModal] = useState<{ open: boolean; focusOilMeter?: string }>({
    open: false,
  });

  /* One shared underline that slides to the active tab (instead of per-tab
     underlines popping in place). Re-measures on tab change and resize. */
  useEffect(() => {
    const measure = () => {
      const button = navRef.current?.querySelector<HTMLButtonElement>(
        `[data-tab="${tabSlug(activeTab)}"]`,
      );
      if (button) setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeTab]);

  const selectTab = (tab: Tab) => {
    setActiveTab(tab);
    // Keep the URL shareable without triggering a navigation
    const url = tab === "Overview" ? location.pathname : `${location.pathname}?tab=${tabSlug(tab)}`;
    history.replaceState(null, "", url);
  };

  return (
    <div>
      <div className="border-b border-divider">
        <nav ref={navRef} className="relative flex gap-8.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              data-tab={tabSlug(tab)}
              onClick={() => selectTab(tab)}
              className={`cursor-pointer pb-3.5 text-body whitespace-nowrap transition-colors duration-150 ${
                activeTab === tab ? "text-brand" : "text-ink-muted hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
          {indicator && (
            <span
              className="absolute bottom-0 h-0.5 bg-brand transition-[left,width] duration-250 ease-(--ease-snap)"
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
        </nav>
      </div>

      <div className="mt-8.5">
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
        {!["Overview", "Maintenance Logs", "Maintenance Schedule"].includes(activeTab) && (
          <p className="text-body text-ink-muted">Nothing here yet — {activeTab} is coming soon.</p>
        )}
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
