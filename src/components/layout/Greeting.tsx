"use client";

import { currentUser } from "@/lib/data/aircraft";

const partOfDay = () => {
  const hour = new Date().getHours();
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
  const now = new Date();
  const today = `${now.toLocaleDateString("en-US", { weekday: "long" })}, ${now.toLocaleDateString(
    "en-US",
    { month: "long" },
  )} ${ordinal(now.getDate())}`;
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
