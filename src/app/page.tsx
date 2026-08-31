import { fleetStats } from "@/lib/data/aircraft";
import { FleetHeader } from "@/components/layout/FleetHeader";
import { KpiBar } from "@/components/dashboard/KpiBar";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

/** v2 dashboard: one white "sheet" floating on the page background. */
export default function Dashboard() {
  return (
    /* DashboardTabs renders the whole sheet: a sticky top cap (ground strip +
       rounded sheet top + greeting/KPI/tabs) that stays locked, and the sheet
       body scrolling the page normally beneath it. */
    <div className="mr-6">
      <DashboardTabs
        header={
          /* key: RSC-passed JSX lands in an array slot client-side and needs one */
          <div key="dashboard-header">
            <FleetHeader />
            <div className="mt-8.5">
              <KpiBar kpis={fleetStats.kpis} />
            </div>
          </div>
        }
      />
    </div>
  );
}
