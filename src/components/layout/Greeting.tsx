"use client";

import { currentUser } from "@/lib/data/aircraft";

const partOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

/** v2 page greeting — time-of-day + first name, 28px Regular, with today's
 *  date beneath (muted 14): the anchor for every relative due label. */
export function Greeting() {
  const firstName = currentUser.name.split(" ")[0];
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <div>
      <h1 className="text-headline font-normal" suppressHydrationWarning>
        Good {partOfDay()}, {firstName}
      </h1>
      <p className="mt-1.5 text-body text-ink-muted" suppressHydrationWarning>
        {today}
      </p>
    </div>
  );
}
