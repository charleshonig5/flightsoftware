/**
 * Entrance animations (gauge draw-in, meter count-up) play once per app load —
 * not again on client-side navigation. The flag latches 300ms after the first
 * check, wide enough to cover the whole first render (effects and streamed
 * Suspense content hydrate in separate tasks) but far quicker than any route
 * change. A hard reload resets it. On the server it always reports "not
 * played yet" so prerendered markup carries the animations.
 */
let played = false;
let latchQueued = false;

export function entranceAlreadyPlayed(): boolean {
  if (typeof window === "undefined") return false;
  if (played) return true;
  if (!latchQueued) {
    latchQueued = true;
    setTimeout(() => {
      played = true;
    }, 300);
  }
  return false;
}
