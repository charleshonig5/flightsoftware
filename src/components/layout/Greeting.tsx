"use client";

import { currentUser } from "@/lib/data/aircraft";

const partOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

/** v2 page greeting — time-of-day + first name, 28px Regular. */
export function Greeting() {
  const firstName = currentUser.name.split(" ")[0];
  return (
    <h1 className="text-headline font-normal" suppressHydrationWarning>
      Good {partOfDay()}, {firstName}
    </h1>
  );
}
