import Link from "next/link";

/* v2 pill: white fill, hairline border, brand Medium label; hover washes
   brand-soft (same grammar as the outline button and "View item" pill). */
const baseClasses =
  "inline-flex h-7.5 shrink-0 cursor-pointer items-center justify-center rounded-full border px-2.5 text-caption font-medium whitespace-nowrap transition-colors duration-150 active:scale-[0.97]";

const styleClasses = {
  default: "border-divider bg-card text-brand hover:bg-brand-soft",
  /* micro-CTA ("Link Record"): same pill with a brand border */
  "brand-outline": "border-brand bg-card text-brand hover:bg-brand-soft",
} as const;

/** Pill button used for card-level actions ("Update Meters", "Log Oil"). */
export function PillButton({
  children,
  href,
  onClick,
  variant,
}: {
  children: React.ReactNode;
  /** Renders as a link when given (e.g. → aircraft page). */
  href?: string;
  onClick?: () => void;
  /** Deprecated v1 prop — the v2 pill looks the same on every surface. */
  surface?: "card" | "page";
  /** "brand-outline" swaps the hairline for a brand border. */
  variant?: "brand-outline";
}) {
  const pillClasses = `${baseClasses} ${styleClasses[variant ?? "default"]}`;
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
