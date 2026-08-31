import { fleetStats } from "@/lib/data/aircraft";
import { FleetHeader } from "@/components/layout/FleetHeader";
import { KpiBar } from "@/components/dashboard/KpiBar";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

/** v2 dashboard: one white "sheet" floating on the page background. */
export default function Dashboard() {
  return (
    <div className="my-6 mr-6 rounded-card border border-divider bg-card px-10.75 pt-8.25 pb-10.75 shadow-card">
      <FleetHeader />
      <div className="mt-6">
        <KpiBar kpis={fleetStats.kpis} />
      </div>
      <div className="mt-11.5">
        <DashboardTabs />
      </div>
    </div>
  );
}
