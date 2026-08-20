import { Skeleton } from "@/components/ui/Skeleton";

/* Tab label widths vary like the real tab names */
const TAB_WIDTHS = ["w-16", "w-28", "w-32", "w-8", "w-16", "w-10", "w-20", "w-20"];

/** Aircraft page skeleton — header with photo/specs, tab bar, meter grid. */
export default function AircraftLoading() {
  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          {/* photo placeholder matches the real 152×105 image box */}
          <Skeleton className="h-26.25 w-38 rounded-tile" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-4.5 w-44 rounded-full" />
            <div className="mt-2.5 flex gap-2">
              <Skeleton className="h-7.5 w-24 rounded-full" />
              <Skeleton className="h-7.5 w-16 rounded-full" />
            </div>
          </div>
        </div>
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>

      <div className="mt-16 flex gap-8.5 border-b border-divider pb-3.5">
        {TAB_WIDTHS.map((width, index) => (
          <Skeleton key={index} className={`h-4.5 rounded-full ${width}`} />
        ))}
      </div>

      <div className="mt-8.5 grid grid-cols-2 items-start gap-3.5 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="flex flex-col gap-1 rounded-tile bg-card p-3.5">
            <Skeleton className="h-3 w-12 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-3 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </>
  );
}
