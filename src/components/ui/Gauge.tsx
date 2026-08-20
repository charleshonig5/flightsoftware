"use client";

import { useState } from "react";
import type { StatusLevel } from "@/lib/data/aircraft";
import { entranceAlreadyPlayed } from "@/lib/entrance";

const arcColor: Record<StatusLevel, string> = {
  success: "var(--color-success-soft)",
  warning: "var(--color-warning-soft)",
  danger: "var(--color-danger-soft)",
};

export function gaugeLevel(percent: number): StatusLevel {
  if (percent >= 90) return "danger";
  if (percent >= 50) return "warning";
  return "success";
}

/**
 * Semicircular usage gauge with the percentage centered at its base.
 * Geometry from the Figma asset (60×30 viewBox, ring outer r=30 / inner
 * r=22.5, flat-cut ends) rendered at 48×24 so it breathes inside the
 * post-type-shrink tiles; the label sits flush with the gauge bottom.
 * Arc color derives from the percentage: <50 success, 50–89 warning, 90+ danger.
 * With `entrance`, the arc draws in on first app load only (`delayMs` staggers
 * the wave); later mounts and non-entrance surfaces render settled.
 */
export function Gauge({
  percent,
  delayMs = 0,
  entrance = true,
}: {
  percent: number;
  delayMs?: number;
  entrance?: boolean;
}) {
  const [animate] = useState(() => entrance && !entranceAlreadyPlayed());
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative h-6 w-12">
      <svg viewBox="0 0 60 30" className="absolute inset-0 size-full" aria-hidden>
        <path
          d="M 3.75 30 A 26.25 26.25 0 0 1 56.25 30"
          fill="none"
          stroke="var(--color-ink-faint)"
          strokeWidth="7.5"
          pathLength={100}
        />
        <path
          d="M 3.75 30 A 26.25 26.25 0 0 1 56.25 30"
          fill="none"
          stroke={arcColor[gaugeLevel(clamped)]}
          strokeWidth="7.5"
          pathLength={100}
          strokeDasharray={`${clamped} 100`}
          className={`transition-[stroke-dasharray] duration-500 ease-out ${animate ? "animate-gauge-fill" : ""}`}
          style={animate ? { animationDelay: `${delayMs}ms` } : undefined}
        />
      </svg>
      {/* flush with the gauge base */}
      <span className="absolute inset-x-0 bottom-0 text-center text-caption leading-none text-ink-muted">
        {clamped}%
      </span>
    </div>
  );
}
