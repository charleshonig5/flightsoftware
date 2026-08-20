import { Skeleton } from "@/components/ui/Skeleton";

/** Meter-tile stand-in: real tile surface + padding, so height matches (93px). */
function MeterTileSkeleton() {
  return (
    <div className="flex flex-col gap-1 rounded-tile bg-tile p-3.5">
      <Skeleton className="h-3 w-12 rounded-full" />
      <Skeleton className="h-8 w-28 rounded-full" />
      <Skeleton className="h-3 w-20 rounded-full" />
    </div>
  );
}

/** Maintenance-row stand-in mirroring the real row anatomy. */
function ScheduleRowSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-tile bg-tile py-3.5 pl-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-4.5 w-56 rounded-full" />
      </div>
      <div className="flex gap-1.5">
        <Skeleton className="h-5.5 w-20 rounded-full" />
        <Skeleton className="h-5.5 w-24 rounded-full" />
      </div>
    </div>
  );
}

function AircraftCardSkeleton() {
  return (
    <div className="rounded-card bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4.5 w-40 rounded-full" />
        </div>
        <Skeleton className="h-7.5 w-20 rounded-full" />
      </div>
      <div className="mt-3.5 grid grid-cols-2 gap-3.5">
        {Array.from({ length: 4 }, (_, index) => (
          <MeterTileSkeleton key={index} />
        ))}
      </div>
      <div className="mt-8.5 flex flex-col gap-3.5">
        {Array.from({ length: 3 }, (_, index) => (
          <ScheduleRowSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

/** Dashboard skeleton — mirrors header, KPI row, and two aircraft cards. */
export default function DashboardLoading() {
  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-44 rounded-full" />
          <div className="flex gap-3.5">
            <Skeleton className="h-5.5 w-20 rounded-full" />
            <Skeleton className="h-5.5 w-28 rounded-full" />
          </div>
        </div>
        <div className="flex gap-3.5">
          <Skeleton className="h-9 w-32 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="rounded-card bg-card p-6 pb-4">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="mt-3.5 h-10 w-28 rounded-full" />
          </div>
        ))}
      </div>

      <div className="mt-11">
        <div className="flex items-center gap-3.5">
          <Skeleton className="h-6 w-36 rounded-full" />
          <Skeleton className="h-7.5 w-16 rounded-full" />
        </div>
        <div className="mt-3.5 grid grid-cols-1 items-start gap-3.5 xl:grid-cols-2">
          <AircraftCardSkeleton />
          <AircraftCardSkeleton />
        </div>
      </div>
    </>
  );
}
