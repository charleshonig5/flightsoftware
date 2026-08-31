"use client";

import { useId, useState } from "react";
import { entranceAlreadyPlayed } from "@/lib/entrance";

/**
 * Semicircular usage gauge with the percentage centered at its base.
 * Geometry from the Figma asset: 60×30, ring outer r=30 / inner r=22.5
 * (7.5 stroke). Every end is round-capped to match the site's rounded corner
 * language: the endpoints sit one cap-radius (3.75) up the arc so the caps
 * land exactly on the gauge baseline instead of clipping. v2 arcs carry the
 * brand→brand-strong gradient (left→right, same as the primary button) on a
 * divider-grey track — status color lives in chips, not gauges.
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
  const gradientId = useId();
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative h-7.5 w-15">
      <svg viewBox="0 0 60 30" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          {/* Figma: horizontal brand gradient spanning the full 60px gauge width */}
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="30"
            x2="60"
            y2="30"
          >
            <stop stopColor="var(--color-brand)" />
            <stop offset="1" stopColor="var(--color-brand-strong)" />
          </linearGradient>
        </defs>
        <path
          d="M 4.02 26.25 A 26.25 26.25 0 0 1 55.98 26.25"
          fill="none"
          stroke="var(--color-divider)"
          strokeWidth="7.5"
          strokeLinecap="round"
          pathLength={100}
        />
        <path
          d="M 4.02 26.25 A 26.25 26.25 0 0 1 55.98 26.25"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="7.5"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${clamped} 100`}
          className={`transition-[stroke-dasharray] duration-500 ease-out ${animate ? "animate-gauge-fill" : ""}`}
          style={animate ? { animationDelay: `${delayMs}ms` } : undefined}
        />
      </svg>
      {/* 2px above the gauge base (Figma: label top-18 in the 30px box) */}
      <span className="absolute inset-x-0 bottom-0.5 text-center text-caption leading-none text-ink-muted">
        {clamped}%
      </span>
    </div>
  );
}
