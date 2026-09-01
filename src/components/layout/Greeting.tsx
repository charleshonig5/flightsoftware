"use client";

import { useEffect, useState } from "react";
import { currentUser } from "@/lib/data/aircraft";

const partOfDay = (now: Date) => {
  const hour = now.getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

/** "31" → "31st" (handles the 11th/12th/13th exceptions). */
const ordinal = (day: number) => {
  const tens = day % 100;
  if (tens >= 11 && tens <= 13) return `${day}th`;
  const suffix = { 1: "st", 2: "nd", 3: "rd" }[day % 10] ?? "th";
  return `${day}${suffix}`;
};

/** v2 page greeting — time-of-day + first name, 28px Regular, with today's
 *  date beneath (muted 14, "Monday, August 31st"): the anchor for every
 *  relative due label. */
export function Greeting() {
  const firstName = currentUser.name.split(" ")[0];

  /* Both lines must reflect the VIEWER's clock. The prerender bakes in the
     build machine's date, and suppressHydrationWarning leaves that text
     untouched — so re-render once after mount, where new Date() is
     guaranteed to be the user's local time zone. */
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    setNow(new Date());
  }, []);

  const today = `${now.toLocaleDateString("en-US", { weekday: "long" })}, ${now.toLocaleDateString(
    "en-US",
    { month: "long" },
  )} ${ordinal(now.getDate())}`;

  return (
    <div>
      <h1 className="text-headline font-normal" suppressHydrationWarning>
        Good {partOfDay(now)}, {firstName}
      </h1>
      <p className="mt-1.5 text-body text-ink-muted" suppressHydrationWarning>
        {today}
      </p>
    </div>
  );
}
