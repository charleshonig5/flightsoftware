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
    // AircraftTabs renders the whole sheet: a sticky top cap (ground strip +
    // rounded sheet top + header/tabs) that stays locked, and the sheet body
    // scrolling the page normally beneath it.
    <div className="mr-6">
      {/* Suspense: AircraftTabs reads ?tab= via useSearchParams on a prerendered page */}
      <Suspense>
        {/* key: RSC-passed JSX lands in an array slot client-side and needs one */}
        <AircraftTabs
          aircraft={aircraft}
          header={<AircraftHeader key="aircraft-header" aircraft={aircraft} />}
        />
      </Suspense>
    </div>
  );
}
