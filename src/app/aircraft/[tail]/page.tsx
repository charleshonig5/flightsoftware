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
    // Page padding lives here now — the root layout's <main> is bare so the
    // dashboard sheet can own its margins.
    <div className="px-13.5 pt-11 pb-13.5">
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
