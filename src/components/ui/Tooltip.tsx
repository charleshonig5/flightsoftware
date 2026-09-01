/**
 * Pure-CSS hover/focus tooltip. Wraps its trigger; the bubble pops up
 * centered above it. v2 surface: white card, hairline border, `rounded-field`,
 * `shadow-card` glow, 10px padding. Body copy only — no title row; the
 * trigger's context already names the subject. Width: fixed 156px (`w-39`)
 * for explanatory copy; `fit` hugs a short one-liner (e.g. KPI deltas).
 */
export function Tooltip({
  content,
  fit = false,
  children,
}: {
  content: React.ReactNode;
  /** Hug the content on one line instead of the fixed 156px bubble */
  fit?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className="group/tip relative inline-flex" tabIndex={0}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 translate-y-0.5 rounded-field border border-divider bg-card p-2.5 text-left shadow-card opacity-0 transition-all duration-150 ease-(--ease-snap) group-hover/tip:translate-y-0 group-hover/tip:opacity-100 group-focus-visible/tip:translate-y-0 group-focus-visible/tip:opacity-100 ${
          fit ? "w-max whitespace-nowrap" : "w-39"
        }`}
      >
        <span className="block text-caption leading-3.5 text-ink">{content}</span>
      </span>
    </span>
  );
}
