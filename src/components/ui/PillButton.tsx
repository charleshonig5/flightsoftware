import Link from "next/link";

/* Hover is standardized: soft fills darken to chip-neutral with text fixed at
   ink-muted (interactive greys never darken past ink-muted); the brand-outline
   flavor washes brand-soft. */
const baseClasses =
  "inline-flex h-7.5 shrink-0 cursor-pointer items-center justify-center rounded-full px-2.5 text-caption whitespace-nowrap transition-colors duration-150 active:scale-[0.97]";

const styleClasses = {
  /* soft pill on a white card: gray fill */
  card: "bg-tile text-ink-muted hover:bg-chip-neutral",
  /* soft pill on the gray page: white fill */
  page: "bg-card text-ink-muted hover:bg-chip-neutral",
  /* brand-outline micro-CTA ("Link Record") */
  "brand-outline": "border border-brand bg-card text-brand hover:bg-brand-soft",
} as const;

/** Soft pill button used for card-level actions ("Update Meters", "Log Oil", "Full Schedule"). */
export function PillButton({
  children,
  href,
  onClick,
  surface = "card",
  variant,
}: {
  children: React.ReactNode;
  /** Renders as a link when given (e.g. → aircraft page). */
  href?: string;
  onClick?: () => void;
  /** Surface the soft pill sits on: gray fill on a white card, white fill on the gray page. */
  surface?: "card" | "page";
  /** "brand-outline" overrides the soft styling for micro-CTAs. */
  variant?: "brand-outline";
}) {
  const pillClasses = `${baseClasses} ${styleClasses[variant ?? surface]}`;
  if (href) {
    return (
      <Link href={href} className={pillClasses}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={pillClasses}>
      {children}
    </button>
  );
}
