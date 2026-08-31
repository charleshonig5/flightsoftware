import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fleet, getAircraft } from "@/lib/data/aircraft";
import { AircraftHeader } from "@/components/aircraft/AircraftHeader";
import { AircraftTabs } from "@/components/aircraft/AircraftTabs";

export function generateStaticParams() {
  return fleet.map((aircraft) => ({ tail: aircraft.tailNumber }));
}

type AircraftPageProps = { params: Promise<{ tail: string }> };

export async function generateMetadata({ params }: AircraftPageProps) {
  const { tail } = await params;
  return { title: `${decodeURIComponent(tail)} — Flight` };
}

export default async function AircraftPage({ params }: AircraftPageProps) {
  const { tail } = await params;
  const aircraft = getAircraft(decodeURIComponent(tail));
  if (!aircraft) notFound();

  return (
    // v2 sheet: all page content sits on one white card, same as the dashboard
    <div className="my-6 mr-6 rounded-card border border-divider bg-card px-10.75 pt-8.25 pb-10.75 shadow-card">
      <AircraftHeader aircraft={aircraft} />
      <div className="mt-16">
        {/* Suspense: AircraftTabs reads ?tab= via useSearchParams on a prerendered page */}
        <Suspense>
          <AircraftTabs aircraft={aircraft} />
        </Suspense>
      </div>
    </div>
  );
}
