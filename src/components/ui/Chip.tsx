import type { StatusLevel } from "@/lib/data/aircraft";

export type ChipTone = StatusLevel | "neutral" | "neutral-on-card" | "tile" | "quiet";

const toneClasses: Record<ChipTone, string> = {
  danger: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-warning",
  success: "bg-success-soft text-success",
  /* neutral chips sit on a tile surface, so they read as white */
  neutral: "bg-card text-ink-muted",
  /* neutral chips on a white card use the gray fill instead */
  "neutral-on-card": "bg-chip-neutral text-ink-muted",
  /* info chips on modals use the tile fill */
  tile: "bg-tile text-ink-muted",
  /* v2 quiet badge: brand tint fill, muted text (KPI labels) */
  quiet: "bg-brand-soft text-ink-muted",
};

/**
 * Compact count pill (`px-2 py-1`, tile fill): the "3" next to Aircraft(s) in
 * the sidebar (caption) and the counts under the page title (body).
 */
export function CountBadge({
  textSize = "caption",
  surface = "card",
  children,
}: {
  textSize?: "caption" | "body";
  /** Surface the badge sits on: gray fill on a white card, white fill on the gray page. */
  surface?: "card" | "page";
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 leading-none text-ink-muted ${
        surface === "page" ? "bg-card" : "bg-tile"
      } ${textSize === "body" ? "text-body" : "text-caption"}`}
    >
      {children}
    </span>
  );
}

/** Small pill label: status badges, interval/date tags. */
export function Chip({
  tone = "neutral",
  className = "",
  children,
}: {
  tone?: ChipTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      /* v2 chip metrics: 8px/5px padding, 20px tall */
      className={`inline-flex items-center rounded-full px-2 py-1.25 text-caption leading-none whitespace-nowrap ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
