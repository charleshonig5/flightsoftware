import { fleetStats } from "@/lib/data/aircraft";
import { FleetHeader } from "@/components/layout/FleetHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { FleetSection } from "@/components/dashboard/FleetSection";

export default function Dashboard() {
  return (
    <>
      <FleetHeader />
      <div className="mt-6 grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {fleetStats.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>
      <div className="mt-11">
        <FleetSection />
      </div>
    </>
  );
}
