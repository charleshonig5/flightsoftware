/**
 * Shimmering placeholder block for route loading states.
 * Base `chip-neutral` with a soft `tile` highlight sweeping across
 * (`animate-shimmer`, 1.8s) — visible on both white and page surfaces.
 * Text stand-ins use the nearest scale height to the type they replace
 * (caption→h-3, body→h-4.5, title→h-6, stat→h-8) and `rounded-full`;
 * boxes pass their real radius via className.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-shimmer bg-linear-to-r from-chip-neutral via-tile to-chip-neutral bg-[length:200%_100%] ${className}`}
    />
  );
}
