/**
 * Pure-CSS hover/focus tooltip. Wraps its trigger; the bubble pops up
 * centered above it — narrow (`max-w-40`) so copy wraps into a compact
 * block rather than one long line. White card surface with the `pop`
 * shadow — the system's floating-overlay treatment.
 */
export function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  return (
    <span className="group/tip relative inline-flex" tabIndex={0}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 w-max max-w-40 -translate-x-1/2 translate-y-0.5 rounded-tile bg-card p-2.5 text-caption text-ink shadow-pop opacity-0 transition-all duration-150 ease-(--ease-snap) group-hover/tip:translate-y-0 group-hover/tip:opacity-100 group-focus-visible/tip:translate-y-0 group-focus-visible/tip:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}
