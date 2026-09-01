import { RunwayCard } from "@/components/dashboard/RunwayCard";

/**
 * Lab route: renders the Maintenance Runway prototype in isolation on the
 * page ground — not linked from anywhere. Delete when the card lands (or
 * dies).
 */
export default function RunwayLab() {
  return (
    <main className="min-h-screen bg-page px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <RunwayCard />
      </div>
    </main>
  );
}
