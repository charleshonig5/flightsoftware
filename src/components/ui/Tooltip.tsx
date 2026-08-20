/**
 * Pure-CSS hover/focus tooltip. Wraps its trigger; the bubble pops up above,
 * right-aligned (default) or left-aligned. White card surface with the
 * `pop` shadow — the system's floating-overlay treatment.
 */
export function Tooltip({
  content,
  align = "right",
  children,
}: {
  content: string;
  align?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <span className="group/tip relative inline-flex" tabIndex={0}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full z-10 mb-1.5 w-max max-w-3xs translate-y-0.5 rounded-tile bg-card px-2.5 py-1.5 text-caption text-ink shadow-pop opacity-0 transition-all duration-150 ease-(--ease-snap) group-hover/tip:translate-y-0 group-hover/tip:opacity-100 group-focus-visible/tip:translate-y-0 group-focus-visible/tip:opacity-100 ${
          align === "right" ? "right-0" : "left-0"
        }`}
      >
        {content}
      </span>
    </span>
  );
}
