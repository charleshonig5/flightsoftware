"use client";

import { useEffect, useState } from "react";
import { entranceAlreadyPlayed } from "@/lib/entrance";

/**
 * Counts a numeric string up from 0 on mount (ease-out-cubic, 450ms),
 * preserving the source formatting: thousands separators, decimal places,
 * and bare-decimal style (".06"). Ends on the exact original string.
 * Respects prefers-reduced-motion (renders the final value immediately).
 */
export function CountUp({
  value,
  delayMs = 0,
  durationMs = 450,
  entrance = true,
}: {
  value: string;
  delayMs?: number;
  durationMs?: number;
  entrance?: boolean;
}) {
  const [display, setDisplay] = useState(value);
  /* Decided at render time so it latches consistently with the gauges */
  const [shouldAnimate] = useState(() => entrance && !entranceAlreadyPlayed());

  useEffect(() => {
    const target = parseFloat(value.replace(/,/g, ""));
    if (
      !shouldAnimate ||
      !Number.isFinite(target) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(value);
      return;
    }
    const decimals = (value.split(".")[1] ?? "").length;
    const bareDecimal = value.trim().startsWith(".");
    const format = (n: number) => {
      const formatted = n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      return bareDecimal ? formatted.replace(/^0\./, ".") : formatted;
    };

    let raf: number;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now + delayMs;
      const progress = Math.min(1, Math.max(0, (now - start) / durationMs));
      const eased = 1 - Math.pow(1 - progress, 3);
      if (progress < 1) {
        setDisplay(format(target * eased));
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };
    setDisplay(format(0));
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    /* shouldAnimate is a mount-time constant (useState initializer) */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delayMs, durationMs]);

  return <>{display}</>;
}
