import { Skeleton } from "@/components/ui/Skeleton";

/** Flush meter-cell stand-in: bordered white cell, real tile padding. */
function MeterCellSkeleton({ shape }: { shape: string }) {
  return (
    <div className={`flex flex-col gap-2 border border-divider bg-card p-3.5 ${shape}`}>
      <Skeleton className="h-3 w-12 rounded-full" />
      <Skeleton className="h-5.5 w-24 rounded-full" />
      <Skeleton className="h-3 w-20 rounded-full" />
    </div>
  );
}

/* Single-row flush grid: corners rounded on the outer cells only */
const CELL_SHAPES = [
  "rounded-tl-field rounded-bl-field",
  "-ml-px",
  "-ml-px",
  "-ml-px rounded-tr-field rounded-br-field",
];

/** v2 aircraft-card stand-in: header row + flush 4-across meter grid. */
function AircraftCardSkeleton() {
  return (
    <div className="rounded-field border border-divider bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4.5 w-40 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7.5 w-26 rounded-full" />
          <Skeleton className="h-7.5 w-16 rounded-full" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-4">
        {CELL_SHAPES.map((shape, index) => (
          <MeterCellSkeleton key={index} shape={shape} />
        ))}
      </div>
    </div>
  );
}

/** v2 dashboard skeleton — sheet with greeting, KPI bar, tabs, aircraft cards. */
export default function DashboardLoading() {
  return (
    <div className="my-6 mr-6 rounded-card border border-divider bg-card px-10.75 pt-8.25 pb-10.75 shadow-card">
      {/* greeting row: headline left, two buttons right */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-72 rounded-full" />
        <div className="flex gap-3.5">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </div>

      {/* KPI bar: one bordered panel with four segmented cells */}
      <div className="mt-6 flex items-stretch rounded-field border border-divider">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className={`flex-1 p-6 ${index > 0 ? "border-l border-divider" : ""}`}
          >
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="mt-3.5 h-9 w-20 rounded-full" />
          </div>
        ))}
      </div>

      {/* tab row */}
      <div className="mt-11.5 flex gap-8.5 border-b border-divider pb-3.5">
        <Skeleton className="h-4.5 w-24 rounded-full" />
        <Skeleton className="h-4.5 w-40 rounded-full" />
        <Skeleton className="h-4.5 w-16 rounded-full" />
      </div>

      <div className="mt-8.5 flex flex-col gap-3.5">
        <AircraftCardSkeleton />
        <AircraftCardSkeleton />
      </div>
    </div>
  );
}
