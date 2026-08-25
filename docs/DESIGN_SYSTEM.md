# Flight CRM — Design System v2

> **Status: NOT YET LOCKED — full visual redesign in progress.**
> This document is the single source of truth for v2 design **rules**; the
> `@theme` block in [`src/app/globals.css`](../src/app/globals.css) is the
> single source of truth for token **values**. Any change to one must update
> the other in the same commit.
>
> **v1 is fully preserved** — code and its complete locked design-system
> documentation — on the `v1` branch and the `v1-original` tag. Do not append
> v1 history here; consult the branch.
>
> **Transition note:** until v2 tokens are locked from the new Figma, the code
> on `main` still renders the v1 look. Sections below get filled and marked
> `✅ LOCKED` as the new designs land, exactly as v1 was built: tokens first,
> then screens.

## How this system works

- Tailwind CSS v4 generates utilities directly from the `@theme` CSS variables.
  A token named `--color-ink-muted` is used as `text-ink-muted`, `--radius-tile`
  as `rounded-tile`, etc.
- **No magic values in components.** No arbitrary Tailwind values. If a design
  needs a value with no token, map it to the nearest token or add a new token
  here first.
- What carries over from v1 regardless of visuals: the data layer
  (`src/lib/data/`), routing, modal/lightbox behavior, entrance-animation
  scoping (first-load only), and interaction principles (affordances preview
  what a click does; the nav cue never lies).

## 1. Color — `⏳ awaiting v2 Figma`

## 2. Typography — `⏳ awaiting v2 Figma`

## 3. Spacing — `⏳ awaiting v2 Figma`

## 4. Radii, borders, elevation — `⏳ awaiting v2 Figma`

## 5. Motion & interaction — `⏳ awaiting v2 Figma`

## 6. AI chat (Ask AI) — `⏳ awaiting v2 Figma`

## 7. Components — `⏳ awaiting v2 Figma`

## Fake data

Unchanged from v1: all data lives in `src/lib/data/aircraft.ts` (`fleet`,
fully typed; stats and sidebar derive from it). Keep additions realistic:
FAA-style tail numbers, real aircraft models, plausible hours/intervals;
engine count drives meter sets.

---

## Change log (v2)

| Date | Section | Change |
|---|---|---|
| 2026-08-20 | — | v2 document created; v1 preserved on the `v1` branch / `v1-original` tag. |
