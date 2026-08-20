# Flight CRM — Design System

> **Status: v0 LOCKED (2026-08-12)** — extracted from the Figma dashboard
> (file `LuaXriGgwjSXjovjZU4w0t`, node `65-14564`). This document is the single
> source of truth for design **rules**; the `@theme` block in
> [`src/app/globals.css`](../src/app/globals.css) is the single source of truth
> for token **values**. Any change to one must update the other in the same
> commit. New Figma screens may extend the system; extensions get logged in the
> change log below.

## How this system works

- Tailwind CSS v4 generates utilities directly from the `@theme` CSS variables.
  A token named `--color-ink-muted` is used as `text-ink-muted`, `--radius-tile`
  as `rounded-tile`, `--text-caption` as `text-caption`, etc.
- **No magic values in components.** No arbitrary Tailwind values
  (`text-[13px]`, `bg-[#f4f4f4]`, `p-[7px]`). If a design needs a value with no
  token, map it to the nearest token or add a new token here first.
  - Currently allowed exception: the `Gauge`'s internal SVG geometry
    (60×30 viewBox, arc path, 7.5 stroke) is intrinsic to the artwork, not
    layout spacing. Its rendered box uses scale utilities (`w-12 h-6`).

## 1. Color — ✅ LOCKED (v0)

All tokens are **semantic**; components never reference raw hex values.

### Brand

| Token | Value | Usage |
|---|---|---|
| `brand` | `#4A78F1` | Active nav (text, icon, edge indicator), outline-button border/text, brand icons, active toggle icon |
| `brand-strong` | `#2460FF` | End color of brand gradients only — never used alone |
| `brand-soft` | `#F3F6FF` | Active nav pill fill; hover fill for brand outline buttons |

Brand gradient: `bg-linear-to-r/srgb from-brand to-brand-strong` (the `/srgb`
modifier is required — Figma gradients interpolate in sRGB, Tailwind defaults
to oklab). Used on: logo mark, "Ask AI" primary button.

### Lines

| Token | Value | Usage |
|---|---|---|
| `divider` | `#E8E8E8` | Hairline separators (sidebar aircraft-tree line) |

### Surfaces

| Token | Value | Usage |
|---|---|---|
| `page` | `#F7F8FA` | App/page background (pixel-verified from the Figma frame; the sidebar is `card` white) |
| `card` | `#FFFFFF` | Top-level cards, sidebar; also chips/controls sitting **on a gray surface** (tile or page) |
| `tile` | `#F7F8FA` | Inset surfaces on a card: stat tiles, list rows, soft pill buttons, count badges on white |
| `chip-neutral` | `#F1F1F1` | Neutral chips sitting **on a card** (white bg); hover fill for pills |

`page` and `tile` currently share a value but are separate tokens — they play
different roles and may diverge.

**Surface inversion rule:** fills alternate with nesting. On a white surface
(card/sidebar) use a gray fill (`tile`/`chip-neutral`); on a gray surface
(page/tile) use a white fill (`card`). Examples: maintenance-row chips are
white (on a tile); header count badges are white (on the page); the sidebar
count badge is `tile` (on white).

### Text ("ink")

| Token | Value | Usage |
|---|---|---|
| `ink` | `#000000` | Primary text: headings, values, item titles |
| `ink-muted` | `#909090` | Secondary text: labels, meta, units, chip text, soft-button text |
| `ink-faint` | `#D2D2D2` | Tertiary/idle affordances: Edit links, arrow glyphs, gauge track |

### Status

Each status has a strong tone (text/icons) and a soft tone (fills: chip
backgrounds, accent bars, gauge arcs).

| Status | Strong | Soft | Meaning in Flight |
|---|---|---|---|
| `danger` | `#F31515` | `#FFD2D2` | Overdue, needs attention, ≥90% usage |
| `warning` | `#CC6900` | `#FBDBB9` | Due soon, 50–89% usage |
| `success` | `#07C91F` | `#D0FFD6` | Current/OK, <50% usage |

Rules:
- Status chips: soft background + strong text (`bg-danger-soft text-danger`).
- Accent bars and gauge arcs: soft tone only.
- Never use status colors decoratively — they always encode state.

## 2. Typography — ✅ LOCKED (v0)

Family: **Geist** (`--font-sans`, loaded via `next/font` in `layout.tsx`).
Mono (`Geist Mono`) is loaded but currently unused. Three weights exist in the
system: **Regular (400)**, **Medium (500 — button labels only)**, and
**SemiBold (600)**.

| Token | Size / Line height | Weight | Usage |
|---|---|---|---|
| `text-caption` | 10 / 13 | 400 | Chips, labels, meta lines, units, small buttons, links like "View all" |
| `text-body` | 14 / 18 | 400 / 500 / 600 | Model names, section headers, nav items, header counts (400); button labels (500); list-item titles (600) |
| `text-title` | 18 / 23 | 600 | Card headings (tail numbers), section titles, sidebar logo, meter readings |
| `text-headline` | 28 / 36 | 600 | Page titles ("Fleet Status", tail numbers), KPI counts |

Rules:
- SemiBold is reserved for identity/emphasis: tail numbers, stat values, item titles.
- Chip text uses `leading-none` (chips get their height from padding).

## 3. Spacing — ✅ LOCKED (v0)

Standard Tailwind scale (4px base). Steps observed in the design and their roles:

| Step | px | Usage |
|---|---|---|
| `gap-1` | 4 | Label ↔ value ↔ meta inside a stat tile; heading ↔ subtitle |
| `gap-1.5` | 6 | Between chips in a row |
| `gap-2` | 8 | Title block ↔ chip row inside a list item; tail number ↔ badge |
| `px-2.5 py-1.5` | 10/6 | Chip padding |
| `p-3.5` / `gap-3.5` | 14 | Tile padding; **the universal grid gap** (between tiles, list rows, cards, sections, header buttons); logo↔wordmark gap |
| `p-6` | 24 | Card padding; header→KPI-row gap |
| `px-13.5` / `pt-11` | 54 / 44 | Dashboard content gutters / top offset (also sidebar logo offsets: 34px `px-8.5`, 44px `pt-11`) |

Rules:
- 14px (`3.5`) is the signature gap of this design — use it between all sibling
  surfaces (tiles, rows, cards).
- 24px (`6`) frames card interiors.
- Page-level chrome (sidebar paddings, content gutters) is documented on the
  layout components below rather than as global rules.

## 4. Radii, borders, elevation — ✅ LOCKED (v0)

| Token | Value | Usage |
|---|---|---|
| `rounded-card` | 14px | Top-level cards (incl. KPI cards) |
| `rounded-tile` | 10px | Inset tiles and list rows |
| `rounded-nav` | 8px | Sidebar nav pills |
| `rounded-field` | 8px | Form fields |
| `rounded-full` | pill | Chips, count badges, pill buttons, brand buttons, view toggles |

- **No borders.** Hierarchy is expressed through surface color steps
  (`page` → `card` → `tile`) plus exactly two sanctioned shadows:
  - `--shadow-card` (`0 0 58px rgb(113 113 113 / 0.05)`): ambient glow on
    **top-level surfaces only** — aircraft cards, KPI cards, the sidebar.
    Never on tiles, rows, chips, or buttons.
  - `--shadow-pop` (`0 4px 12px rgb(0 0 0 / 0.08), 0 1px 3px rgb(0 0 0 / 0.06)`):
    floating overlays (tooltips, pickers, menus) that need separation from
    content they cover.
- Status accent bars on list rows: 6px wide (`w-1.5`), full height, soft status
  color, clipped by the row's `rounded-tile` + `overflow-hidden`.

## 5. Motion & interaction — ✅ LOCKED (v0)

### Entrance animations (dashboard, first load only)

- **Scope rule:** entrance motion (gauge draw-in + meter count-up) belongs to
  the **dashboard only**, and plays **once per app load** — never again on
  client-side navigation (`src/lib/entrance.ts` latches 300ms after the first
  check; hard reload resets). Aircraft pages always render settled
  (`MeterTile entrance={false}`).
- Easing tokens: `--ease-snap` = `cubic-bezier(0.22, 1, 0.36, 1)` (fast start,
  soft landing) and `--ease-out-back` = `cubic-bezier(0.34, 1.56, 0.64, 1)`
  (overshoots ~6%, then settles — the "playful" curve).
- `animate-gauge-fill` (900ms, `--ease-out-back`, `both`): the arc's
  `stroke-dasharray` grows from `0 100` to the element's inline value, so it
  overfills slightly past its mark and settles back. Staggered as a wave —
  80ms × tile index via `Gauge`'s `delayMs` (fed by `MeterTile`'s `index`).
- Meter values count up from 0 (`ui/CountUp`: 450ms ease-out-cubic, same 80ms
  wave, settling well before the arcs finish). Digits render `tabular-nums` so
  widths don't jitter; source formatting (commas, decimal places, bare-decimal
  ".06") is preserved and the count lands on the exact original string.
- KPI cards have no entrance motion — only their tooltips and hover states move.
- `prefers-reduced-motion: reduce` disables all of it (rule in `globals.css`).

### Skeleton loading states

- `ui/Skeleton` is the only skeleton primitive: base `chip-neutral` with a soft
  `tile` highlight sweeping via `animate-shimmer` (1.8s ease-in-out infinite;
  200%-wide gradient, disabled under reduced motion).
- Skeletons live ONLY in route `loading.tsx` boundaries (`/` and
  `/aircraft/[tail]`) — they render during genuine route loads, never on a
  timer. **No artificial delays, ever** (data is local and instant).
- The sidebar lives in the root layout, so it persists while content skeletons.
- Anatomy rules: skeleton screens mirror the real layout (same paddings, gaps,
  grids, and surface nesting — e.g. tile stand-ins are real `bg-tile` boxes so
  heights emerge from content). Text stand-ins are `rounded-full` bars at the
  nearest scale height to their type step: caption→`h-3`, body→`h-4.5`,
  title→`h-6`, stat→`h-8`; component stand-ins use real component heights
  (chips `h-5.5`, pills `h-7.5`, buttons `h-9`).

### Transitions

- Color/opacity transitions: `duration-150` with default easing.
- Gauge arc animates with `duration-500 ease-out` on value change.
- Hover conventions: soft buttons darken one surface step
  (`tile` → `chip-neutral`) and text darkens one ink step; faint icons/links
  step up to `ink-muted`/`ink`.
- Press feedback on buttons: `active:scale-[0.97]`.
- Interactive rows/cards use **named** `group` hovers (`group/card`, `group/row`
  — named so nested groups don't leak) and their corner ↗ arrows both brighten
  one ink step and nudge diagonally (`translate 2px, -2px`, 150ms
  `--ease-snap`) to signal navigation. **Arrows never darken past `ink-muted`**
  — no black hover state.
- Meter tiles are edit targets, so tile hover lights their Edit affordance
  (`group/tile` → Edit goes `faint`→`muted`) together with the surface step —
  the affordance always previews what a click does.
- **The nav cue never lies:** the card's ↗ reaction uses the `card-nav-hover`
  variant (defined in `globals.css`), which suppresses itself while any
  interactive child is hovered (buttons, `[data-interactive]` tiles/rows,
  non-`[data-nav]` links) — it only fires where a click actually navigates.
- Tooltips (`ui/Tooltip`): white `bg-card` bubble with `shadow-pop`, `text-ink`
  `text-caption`, `rounded-tile`, `p-2.5`, **max-w-40 (160px) so copy wraps
  into a compact block — never one long skinny line**; pops up **centered
  above** its trigger with a 150ms fade + 2px rise; shows on hover and
  keyboard focus.
- No artificial loading states — data is local; everything renders instantly.

## 6. Components

### `layout/Sidebar` — app navigation
- Fixed **237px** wide, full viewport height, `bg-card` (white on the gray page — no border).
- Logo row: 20px round mark with the brand gradient + wordmark (`text-title`
  semibold), `px-8.5 pt-11` (34/44), gap 14.
- Nav rows: 46px pills (`h-11.5 rounded-nav`), 20px side margins (`px-5`), 14px
  inner padding — content lands at x=34. Icon 16px + 8px gap + `text-body`
  label. Row pitch 52px (`gap-1.5` between 46px rows).
- Active row: `bg-brand-soft text-brand` + 2px `bg-brand` edge indicator
  (`rounded-r`) flush against the sidebar's left edge.
- Aircraft group: trailing `CountBadge` + chevron (16px, `ink-muted`, rotates
  180° on collapse). Expanded tree: 1px `divider` rule at x=42, 32px rows
  (`h-8`) with tail links at x=76 (`pl-19`), `text-body text-ink-muted`;
  "Add Aircraft" row with 20px `AddCircleIcon`.
- Active tail (on `/aircraft/[tail]`): 153×34 `rounded-nav bg-brand-soft` pill
  from x=64 to the 20px right margin (`-inset-y-px left-16 right-5` on the 32px
  row), `text-brand` label, plus the 2px `bg-brand` edge indicator at the
  sidebar's left edge. Routing is pathname-driven (`usePathname`): `/` marks
  Dashboard, `/aircraft/[tail]` marks that tail.
- Footer pinned to bottom: user name (`text-body text-ink-muted`) + logout icon,
  `px-8.5 pb-8.5`.

### `layout/FleetHeader` — page header
- Title `text-headline` semibold; 8px below: count badges (`CountBadge` body size,
  `surface="page"`) each with a `text-body text-ink-muted` label, 4px apart;
  groups 14px apart.
- Actions (right, 14px apart, both `h-9 px-3.5 rounded-full text-body
  font-medium` with 20px icon + 6px gap):
  - **Brand outline**: `border-brand text-brand bg-card`, hover `bg-brand-soft`.
  - **Brand gradient**: `bg-linear-to-r/srgb from-brand to-brand-strong`
    white text, hover `opacity-85`.

### `dashboard/KpiCard` — fleet stat card
- `bg-card rounded-card p-6 pb-4`, 104px tall by content (24 + 14 label +
  14 + 36 count + 16).
- Label row: 14px icon + `text-caption`, both `ink-muted`, 4px gap.
- 14px `InfoIcon` in `ink-faint` at top-right (24px insets); turns `brand` on
  hover/focus while its tooltip is open.
- Value row 14px below: `text-headline` semibold + `text-body` unit (ink),
  baseline-aligned 8px apart. The status chip rides in this row (`items-end` +
  6px lift) so its bottom edge aligns with the unit word's text box.
- Status `Chip` inset 24px from right/bottom. No accent bar (removed
  2026-08-14 per updated Figma `65-14951`).

### `dashboard/FleetSection` — aircraft section w/ view toggle
- Header: `text-title` semibold + segmented toggle 14px after.
- Toggle: white pill (`h-7.5 rounded-full px-1` on the page surface), segments
  `h-5.5 w-7.5 rounded-full` with 14px icons; active segment `bg-tile` with
  `text-brand` icon, inactive `text-ink-muted`.
- Grid view: 2 **independent column stacks** (masonry — cards alternate
  columns in fleet order), so expanding one card's meters only pushes down its
  own column, never the neighbor. List view: single column with meter tiles
  **4-across** inside each card (`AircraftCard layout="list"`). Gap 14 both
  ways. Below `xl` the grid collapses to one column in column-major order.
- **Toggle mechanism:** the active fill is a single sliding pill (`bg-tile`,
  30×22) behind the segments — it translates between slots in 200ms
  `--ease-snap` rather than jumping; icon colors cross-fade in 200ms.
- **Layout morph:** switching views runs through
  `document.startViewTransition` (+ `flushSync`), with each card wrapper named
  `card-<tail>` via `viewTransitionName` — cards glide/resize into their new
  positions (450ms `--ease-snap`). The old snapshot is hidden and the new one
  fills the morphing group (`::view-transition-old(*) { display: none }`) so
  each card reads as one surface resizing — no cross-fade double-exposure.
  Skipped-transition rejections are swallowed (`transition.ready.catch`).
  Falls back to an instant switch in unsupporting browsers; disabled under
  `prefers-reduced-motion`.

### `aircraft/AircraftHeader` — aircraft page header
- Photo placeholder: 152×105 (`w-38 h-26.25`) `bg-card rounded-tile` with a
  centered 24px `ImageIcon` in `ink-faint` (white box on the gray page —
  surface inversion). Full header height: 105px.
- 24px after: identity block — tail number (`text-headline` semibold) +
  optional danger badge, model line (`text-body text-ink-muted` — muted here,
  unlike the dashboard card where it's ink).
- 18px below (`mt-4.5`): "Update Meters" + "Log Oil" pills 8px apart
  (`PillButton surface="page"` — white fill on the gray page).
- No registry spec fields (removed in the 2026-08-14 revision; they belong to
  the Aircraft Info tab when built).
- "Ask AI" brand-gradient button top-right.

### `aircraft/AircraftTabs` — tab bar + tab panels
- Tab labels: `text-body`, 34px apart (`gap-8.5`), `pb-3.5` (32px row);
  inactive `ink-muted` (hover `ink`), active `text-brand` with a 2px
  `bg-brand` underline exactly the label's width, sitting on the full-width
  1px `divider` border.
- Tab content 34px below the divider (`mt-8.5`). Overview renders the meter
  grid (2-col, `xl` 4-col, gap 14) with `MeterTile surface="page"` (white
  tiles). Other tabs show a muted placeholder until designed.

### `aircraft/MaintenanceLogs` — work-history table
- Section header: title (`text-body` semibold) over live record count
  (`text-body text-ink-muted`); right side: search input + brand-outline
  "Log Maintenance" button (14px apart).
- Search input: 278×36 white pill, `text-body`, placeholder & magnifier icon in
  `ink-faint` (icon 16px, inset 14 right); focus ring `outline-brand-soft`.
  Filters rows live across title/type/component/mechanic/date.
- Table: `bg-card rounded-card` sheet on the page. Header row `py-3.5` +
  1px `divider` bottom; rows 51px with `divider` bottoms (none on the last);
  24px side padding. Column proportions from Figma:
  `278fr 131fr 128fr 172fr 135fr 153fr 50px` (title/date/type/component/hours/
  mechanic/actions), cells truncate.
- Header cells: `text-body text-ink-muted` + 16px `FilterLinesIcon`; clicking
  sorts (active column reads `ink`, icon flips 180° when ascending).
- Row anatomy: title is a brand link (hover underline); other cells `text-body`
  ink; hours rendered `TT n,nnn.n`; dates `M/D/YYYY`; "View" is a `bg-tile`
  body-size pill (hover `chip-neutral`). Row hover `bg-tile/60`.
- Deviation: Figma's "Log Maintenance" label is Regular; normalized to
  Medium (500) per the button rule.

### `ui/Button` — standard action button
- Pill, `text-body font-medium whitespace-nowrap`, press `scale-[0.97]`.
- Sizes: `md` 36px/`px-3.5` (tab-bar actions, modal footers) and `lg`
  40px/`px-4` (page-header heroes — Add Aircraft, Ask AI on both pages).
- `primary`: brand gradient fill (`from-brand to-brand-strong`), white text,
  hover `opacity-85` — the main action ("Ask AI", modal confirm).
- `outline`: white fill, brand border + text, hover `bg-brand-soft` — the
  secondary action ("Add Aircraft", "Log Maintenance", modal cancel).
- `fullWidth` makes it share a footer row equally (`flex-1`).
- Never hand-roll these styles inline — use the component.

### `ui/Modal` — lightbox modal (the one way modals work)
- Scrim: `bg-ink/80` with a 17px backdrop blur (`--blur-scrim` →
  `backdrop-blur-scrim`), full viewport, click to dismiss.
- Panel: 464px (max-w-full) `bg-card rounded-card p-6`, centered.
- Header row: title `text-title` semibold + 16px `CloseIcon` in `ink-faint`
  (hover `ink-muted`) top-right.
- Body: `text-body leading-5.5 text-ink-muted`, 24px below the header
  (`mt-6`) — modal copy uses the relaxed 22px leading.
- Footer: 44px below the body (`mt-11`), equal-width `Button`s 14px apart;
  primary action left, cancel right.
- Motion: opens with `animate-scrim-in` (200ms fade) + `animate-modal-in`
  (250ms `--ease-out-back` pop: fade + scale 0.96 + 8px rise); closes with
  `animate-scrim-out` (150ms) + `animate-modal-out` (180ms `--ease-snap`
  slip-away). The panel stays mounted until the exit animation ends
  (300ms timeout fallback). Reduced motion: durations collapse to 1ms.
- Behavior: Escape, scrim click, and the X all dismiss; body scroll locks
  while open; panel gets focus on open; `role="dialog"` + `aria-modal`.

### `ui/Tooltip` — hover/focus tooltip
- White `bg-card` bubble, `shadow-pop`, `text-ink text-caption`, `rounded-tile`,
  `p-2.5`, `max-w-40` (160px — copy wraps into a compact block, never one long
  skinny line); pops up **centered above** its trigger with a 150ms fade +
  2px rise.
- Pure CSS (`group/tip` hover + focus-visible); triggers should turn `brand`
  while open (see KPI info icons).

### `ui/CountUp` — animated number
- Counts a formatted numeric string up from 0; 450ms ease-out-cubic by default,
  `delayMs` for staggering, `entrance` to gate on the first-load rule.
- Preserves source formatting exactly and always lands on the original string.
- Wrap in `tabular-nums` so digit widths stay stable while counting.

### `ui/Skeleton` — loading placeholder
- See "Skeleton loading states" under Motion for the full anatomy rules;
  the primitive is a `chip-neutral` block with the `animate-shimmer` sweep.

### Icon set (`ui/icons.tsx`)
- Every glyph is traced 1:1 from the Figma assets — stroke-width 1, round
  caps/joins, `currentColor` (fill-based only where the source is, e.g.
  `AddCircleIcon`). Sizes are fixed per glyph family: 14 (tile/KPI/toggle),
  16 (nav/table/close/arrows), 20 (buttons/logo-adjacent).
- Never import an icon library — new glyphs get traced from Figma into this file.

### `aircraft/UpdateMetersModal` — meter update form
- Built on `ui/Modal` with the tail number as `subtitle` (Modal's context line,
  `text-body`, 4px under the title).
- One field per Hobbs/tach meter (`isUpdatableMeter` — anything whose label
  contains "oil" is excluded; oil logging is a separate flow), pre-filled with
  the aircraft's current readings, commas stripped for editing.
- Layout (per Figma `85-1168`): Hobbs full-width on top, tach fields in a
  2-up grid (14px gaps; a lone odd tach spans full width), Date full-width
  last.
- Field anatomy (the system's form-field pattern): `bg-tile rounded-field`
  (8px — fields use `--radius-field`, not the 10px tile radius), `px-3.5 py-2`,
  caption label over `text-body` input, unit in caption at the right; whole
  field is a `<label>` (click anywhere focuses);
  `focus-within:outline-brand-soft`.
- Date field: same anatomy + 16px `CalendarIcon` right-center, defaults to
  today (MM/DD/YY).
- Footer: standard modal footer (Save primary / Cancel outline, `mt-11`).
  Deviation: Figma shows a 10px button gap here; standardized to the modal's
  14px rule.
- Opened from: "Update Meters" pills (dashboard cards + aircraft header) and
  meter-tile Edit affordances (`MeterTile onEdit`) — Edit passes `focusMeter`,
  which focuses and selects that field on open.

### `aircraft/LogOilModal` — oil logging form
- Built on `ui/Modal` with tail-number `subtitle` and `titleInfo` (14px info
  icon + tooltip beside the title — Modal prop).
- Sections stack at 24px (`gap-6`); fields within a section at 14px.
- **Engine selector**: caption label over a row of `Segment` options — derived
  from the aircraft's oil meters ((L)→Left, (R)→Right); hidden entirely for
  single-engine aircraft. Selecting an engine re-prefills Tach Time from that
  engine's tach.
- **Segment pattern** (segmented option button): `h-7.5 rounded` (4px),
  equal-width (`flex-1`), `text-caption`; selected = brand gradient + white
  text, unselected = `bg-tile text-ink-muted` hover `chip-neutral`.
- Fields: Oil Level (placeholder "e.g 6.5" in `ink-faint`, qts), Tach Time
  (prefilled, hrs), Date (calendar icon), "Added Oil?" Yes/No segments
  (default No), Notes (optional, placeholder).
- Opened from: "Log Oil" pills (dashboard cards + aircraft header) and **oil
  tile clicks/Edit** — which preselect that tile's engine.
- Standard modal footer (Save/Cancel).

### `aircraft/MaintenanceSchedule` — schedule timeline tab
- Header: title (`text-body` semibold) over "N overdue, N upcoming"
  (`text-body` muted); right side: `SearchInput`, `StatusSelect`, and an
  outline "Add Item" button (`size="lg"`), 14px apart — the whole control row
  sits at 40px (`SearchInput` is 278×40 `pl-4`, per Figma `65-15769`).
- `StatusSelect` (the system dropdown pattern): white 40px pill trigger
  (`h-10 px-4`, matching the 40px control row), **fixed 164px** (`w-41`) with
  label left / chevron right (`justify-between`); faint "Select Status"
  placeholder → ink label when set, chevron flips.
  Floating menu below-right (white, `shadow-pop`, `animate-modal-in`, `p-1.5`)
  with `text-body` option rows (hover `bg-tile`); the **selected option reads
  `text-brand` and carries a right-aligned 16px `CheckIcon`** (`justify-between
  gap-6`) — the rule for every menu in the system. Escape/outside-click close.
- List: `MaintenanceItem surface="page"` rows (white, `neutral-on-card` chips,
  status chip at the **14px** right inset — page rows only; card rows keep 24)
  at the tighter **8px** gap (`gap-2` — full-width lists run denser than card
  lists), 24px below the header. Search stacks with the status filter; empty
  state in muted body text.
- Dashboard cards show only the first 3 schedule items; this tab shows all.

### `aircraft/MaintenanceItemModal` — item detail modal
- Opened by clicking any maintenance row (dashboard preview or schedule tab).
- Header: item title / category via Modal `title`/`subtitle`.
- Info row (`mt-6`, 24px gaps): caption labels over chips — status chip in its
  status tone, Last Completed + Interval in the `tile` chip tone (8px
  label→chip gap).
- Linked Record: form-field shell (`bg-tile rounded-field`) with faint empty
  copy and a **`PillButton variant="brand-outline"`** micro-CTA
  ("Link Record") right-center — the small brand-outlined pill flavor.
- Item actions: "Edit Item" / "Delete" soft pills at 8px gap, `mt-6`.
- Footer: "Log Completion" primary / "Close" outline, standard `mt-11`.
- Copy fix vs Figma: "No recorded linked" → "No record linked".

### `ui/SearchInput` — search field
- The single source of the search pattern (logs + schedule): 278×36 white
  pill, `text-body`, faint placeholder, 16px magnifier inset 14 right,
  `focus:outline-brand-soft`.

### `ui/TextField` — the form field
- The single source of the form-field pattern (both modals use it): `bg-tile
  rounded-field px-3.5 py-2`, caption label over `text-body` input, optional
  unit caption at the right, optional `rightIcon` slot (right-center).
  Whole field is a `<label>`; `focus-within:outline-brand-soft`; placeholders
  in `ink-faint`.

### `ui/DateField` — date field + calendar picker
- `TextField` (typeable MM/DD/YY) plus a calendar toggle icon (`ink-muted`,
  hover/open `brand`).
- Picker: floating white card (`rounded-tile p-3.5 shadow-pop`,
  `animate-modal-in` pop) **above** the field. Month header (`text-body`
  semibold) between chevron buttons; caption weekday row; 7-col grid of 32px
  round day cells.
- Day states: selected = brand gradient + white; today = `text-brand`;
  hover = `chip-neutral/60`. Picking a day writes MM/DD/YY and closes.
- Escape (capture-phase, so the modal stays open) and outside-click close it.

### `ui/CountBadge` — count pill
- `px-2 py-1 rounded-full leading-none text-ink-muted`; `textSize` caption
  (sidebar, 18px tall) or body (header, 22px tall); fill follows the surface
  inversion rule via `surface` prop (`card` → tile fill, `page` → white fill).

### `ui/Chip` — pill label
- Tones: `danger` / `warning` / `success` (soft bg + strong text),
  `neutral` (white bg, for chips on tiles), `neutral-on-card` (`chip-neutral` bg,
  for chips on white cards).
- Anatomy: `rounded-full px-2.5 py-1.5 text-caption leading-none`.

### `ui/PillButton` — soft action button
- 30px tall pill, `text-caption text-ink-muted`; fill by `surface` prop:
  `bg-tile` on a white card, `bg-card` on the gray page.
- Hover (standardized across surfaces): fill darkens to `chip-neutral`; the
  text stays `ink-muted` — like the ↗ arrows, interactive greys never darken
  past `ink-muted`. Press: scale 0.97.
- Used for card-level actions: "Update Meters", "Log Oil", "Full Schedule".
  The logs table's "View" pill follows the same hover rule.

### `ui/Gauge` — semicircular usage meter
- Rendered **48×24** (`w-12 h-6`) from the original 60×30 viewBox (ring outer
  r=30 / inner r=22.5, 7.5 stroke on a 26.25 centerline — scales to ~6 visual),
  flat-cut ends (no round caps); track in `ink-faint`. Sized down with the
  18px meter values so it clears the Edit affordance.
- Arc color derives from percent: `<50` success-soft, `50–89` warning-soft,
  `≥90` danger-soft (see `gaugeLevel()`).
- Percent label centered **flush with the gauge base** (`bottom-0`) in
  `text-caption text-ink-muted`.

### `dashboard/MeterTile` — stat tile
- `rounded-tile p-3.5`; fill by `surface` prop per the inversion rule:
  `bg-tile` on a card (dashboard), `bg-card` on the page (aircraft Overview).
- Label (caption), value (`text-title` semibold, with the unit as a
  baseline-aligned caption exactly 8px after it — `items-baseline gap-2`),
  meta (caption muted); Edit affordance top-right (faint); Gauge bottom-right.
  85px tall by content.

### `dashboard/MaintenanceItem` — schedule row
- `bg-tile rounded-tile`, 6px status accent bar on the left edge.
- Content padding `px-6 py-3.5` — the status chip is inset 24px from the right
  edge; only the corner arrow sits at the 14px inset (`top-3.5 right-3.5`).
- Left column: category (caption muted) → title (body semibold) → chip row
  (interval + last-done, neutral chips). Status chip bottom-right, arrow
  top-right.

### `dashboard/AircraftCard` — aircraft overview
- `bg-card rounded-card p-6`. Header (tail number + optional danger badge +
  model; right side: "Update Meters" + "Log Oil" pills 8px apart, then a 16px
  ↗ link 14px after in `ink-faint` — brightens on card hover, routes to the
  aircraft page) → 2-col meter grid → "View all" link →
  Maintenance Schedule header (+counts subtitle, "Full Schedule" pill) → item
  list. All vertical gaps 14px.
- **Meter collapse (grid view only):** the card shows the first 4 meters; when
  an aircraft has more, a "View all"/"Collapse" caption link (8px below the
  grid) height-animates the remainder open (200ms, same grid-rows technique as
  the sidebar tree). Aircraft with ≤4 meters get no link, and the
  meters→schedule gap becomes 34px (`mt-8.5`) to preserve the rhythm — exactly
  as the Figma Cessna card shows. **List view always renders every meter with
  no link** (same 34px gap rule applies).

## Fake data

All data lives in `src/lib/data/aircraft.ts` (`fleet` array, fully typed).
Keep additions realistic: FAA-style tail numbers (`N…`), real aircraft models,
plausible hours/intervals. Engine-count should drive meter sets (a twin gets
Tach 1 (L)/Tach 2 (R) and Oil 1 (L)/Oil 2 (R); a four-engine jet gets four of
each).

`fleetStats` (header counts, KPI values) and `allTailNumbers` (sidebar) are
**derived from the fleet array** — never hardcode them; add an aircraft and
every count updates itself.

---

## Change log

| Date | Section | Change |
|---|---|---|
| 2026-08-12 | — | Document created; no tokens locked yet. |
| 2026-08-12 | all | v0 locked from Figma dashboard node `65-14564`: surfaces, ink, status colors, Geist type scale (10/14/18/24), spacing roles, radii (10/14/pill), motion conventions, first six components. |
| 2026-08-12 | components | Fidelity audit vs Figma: icons retraced 1:1 from assets (stroke-width 1); gauge corrected to 7.5px flat-cut stroke with label at `bottom-1`; meter unit gap fixed to 8px baseline-aligned; maintenance status chip inset corrected to 24px. |
| 2026-08-12 | motion | Entrance animations: `--ease-snap` easing token, `animate-gauge-fill` (600ms arc draw-in via stroke-dashoffset), `animate-bar-fill` (500ms scaleX with 75ms/card stagger). Reduced-motion opt-out. |
| 2026-08-12 | motion | Slowed & made playful: gauges 900ms `--ease-out-back` (overshoot + settle) with an 80ms/tile wave; bars 750ms with a scaleX 0.97 tuck-back and 110ms stagger. Gauge keyframe now animates `stroke-dasharray` from `0 100` (dropped the `--gauge-percent` var). |
| 2026-08-12 | motion | KPI accent bar animation removed (bars render static); `animate-bar-fill` token and keyframes deleted. Gauge wave unchanged. |
| 2026-08-12 | motion | FleetSection view toggle: sliding indicator pill (200ms `--ease-snap`) and grid↔list card morph via the View Transitions API (300ms, named card groups, reduced-motion + fallback handling). |
| 2026-08-12 | motion/layout | Morph smoothed: 450ms, old snapshot dropped (single-surface resize, no cross-fade flutter); skipped-transition rejections handled. List view now lays meter tiles 4-across (`AircraftCard layout` prop). |
| 2026-08-12 | components | List view shows all meters — the "View all"/"Collapse" link and collapsed grid only exist in grid view. |
| 2026-08-13 | components | Dashboard cards sort "Needs Attention" aircraft to the top of the stack (stable within groups; both views). Sidebar keeps registry order. |
| 2026-08-13 | motion/components | Skeleton loading system: `ui/Skeleton` primitive + `animate-shimmer` token; route `loading.tsx` for dashboard and aircraft pages mirroring their real anatomy. Real loads only — no artificial delays. |
| 2026-08-12 | all | Maintenance Logs tab locked from Figma frame `65-15330`: searchable/sortable work-history table (46px header, 51px rows, divider hairlines, Figma column proportions), search-pill input spec, `FilterLinesIcon`/`SearchIcon` traced from assets. `MaintenanceLog` data added for all four aircraft. |
| 2026-08-12 | all | Aircraft page (`/aircraft/[tail]`) locked from Figma frame `65-15007`: AircraftHeader (photo placeholder, registry specs at 44px gaps), AircraftTabs (2px brand underline on divider), Overview meter grid with white tiles (`MeterTile surface`), sidebar tail active pill (153×34 at x=64), app shell moved to root layout, tails/Dashboard/"View Aircraft" now route. Header y=44/108, tabs y=216/32, content y=282 all verified. Deviation: Figma highlights N314CN while showing N747CN's page — active tail follows the route instead. |
| 2026-08-12 | components | AircraftCard meter collapse from Figma node `65-15078`: N747CN carries 9 meters (4 tach + 4 oil + Hobbs); "View all"/"Collapse" animates the extra rows; link renders only when >4 meters. |
| 2026-08-12 | all | Full dashboard shell locked from Figma frame `65-14563`: brand color group (`#4A78F1`/`#2460FF`/`#F3F6FF`), `divider` `#E8E8E8`, Medium (500) weight for buttons, `rounded-nav` 8px, Sidebar/FleetHeader/KpiCard/FleetSection/CountBadge components, surface-inversion rule. `page` corrected to `#F7F8FA` (pixel-verified). Deviations: sidebar Add-Aircraft icon `#838383` normalized to `ink-muted`; KPI/aircraft card widths fluid instead of Figma's fixed 261/540 (Figma's own row widths are inconsistent: 1086 vs 1094 vs 1095). |
| 2026-08-14 | components | KPI cards: bottom soft-status accent bar removed per updated Figma `65-14951`. Status chip is now the only status color on the card. |
| 2026-08-14 | components | AircraftCard header per updated Figma `65-14565`: "View Aircraft" pill replaced by "Update Meters" + "Log Oil" pills and a 16px ↗ link (the card-navigation affordance; whole card stays clickable). |
| 2026-08-14 | components | Ask AI icon: sparkle replaced with `ChatLinesIcon` (chat bubble + text lines) per Figma `65-14919`, both headers. |
| 2026-08-14 | components | AircraftHeader per updated Figma `65-15289`: photo 152×96, registry spec fields removed, "Update Meters"/"Log Oil" page-surface pills added under the model line. `PillButton` gains a `surface` prop (matching `CountBadge`). |
| 2026-08-14 | type/components | AircraftHeader resize per revised Figma `65-15289`: new `text-headline` token (30/39, semibold) for the tail number; photo and header height 105px (photo `w-38 h-26.25`). |
| 2026-08-14 | type | Dashboard "Fleet Status" title moved to `text-headline` per revised Figma `65-14912` — page titles now uniformly 30/39. |
| 2026-08-14 | components | KPI cards per revised Figma `65-14951`: count bumped to `text-headline`, new 14px `InfoIcon` top-right, bottom padding 16 (`pb-4`) keeps the 107px height. |
| 2026-08-14 | components/motion | KPI info icons now open `ui/Tooltip` (hover+focus; copy lives in `FleetKpi.info`). Corner ↗ arrows nudge 2px up-right on card/row hover; hover groups renamed (`group/card`, `group/row`) to stop nested-group leaking. |
| 2026-08-14 | tokens/components | Tooltip restyled: white card surface, new `--shadow-pop` elevation token (first sanctioned shadow — floating overlays only), pops up above the trigger. |
| 2026-08-14 | type | `text-headline` bumped 30/39 → 32/41 (all page titles and KPI counts move together). |
| 2026-08-14 | motion | Meter values count up on load (`ui/CountUp`, 80ms/tile stagger synced with the gauge wave, tabular-nums). KPI info icon wrapper made `flex` to sit level with the label row (line-box offset fix). |
| 2026-08-14 | motion | Count-up tuned to 450ms ease-out-cubic (was 900ms quart). Entrance motion scoped: dashboard only (`MeterTile entrance` prop), once per app load (`src/lib/entrance.ts` latch) — aircraft pages always render settled. Doc audit: added `ui/Tooltip`, `ui/CountUp`, `ui/Skeleton`, and icon-set sections. |
| 2026-08-14 | components | Pill hover standardized: all soft pills (PillButton both surfaces, logs "View") hover to `chip-neutral` with text fixed at `ink-muted` — no more to-black text hovers on pills. |
| 2026-08-15 | all | Maintenance item detail modal locked from Figma `85-1345`; rows everywhere now open it. New `tile` chip tone (modal info chips) and `PillButton variant="brand-outline"` (micro-CTA). Schedule items sort by urgency at the source (`withCounts`) so dashboard previews always show the most critical work. Page-row chips flip white on row hover for legibility. |
| 2026-08-15 | components | Schedule-tab perfection audit vs `65-15600`: row gap corrected 14→8, page-row status-chip inset 24→14 (`MaintenanceItem` surface-aware padding), `StatusSelect` fixed at 164px with edge-aligned chevron. |
| 2026-08-15 | all | Maintenance Schedule tab locked from Figma `65-15600`: schedule timeline (page-surface `MaintenanceItem` rows), `StatusSelect` dropdown pattern, `SearchInput` extracted (shared with logs). Maintenance data extended to full schedules (747: 14 items, N314: 6, 822: 4, N551: 11) with counts now **derived from items** (`withCounts`); dashboard cards cap at 3 rows. |
| 2026-08-15 | motion | `card-nav-hover` custom variant: the aircraft-card ↗ nudge/brighten now suppresses while hovering interactive children (tiles, pills, rows) — the nav cue only shows where clicking navigates. |
| 2026-08-15 | all | Calendar picker (`ui/DateField`) added to both modals; form-field pattern extracted to `ui/TextField` (both modals share it). Consistency audit: calendar toggle hover corrected to `brand` (icon-affordance family); hover states across modal surfaces reduced to the four documented families. |
| 2026-08-15 | components | Gauge rendered 48×24 (same 60×30 geometry, scaled) with the percent label flush at its base — clears the Edit affordance in the shorter tiles. |
| 2026-08-15 | tokens | Modal scrim gains its Figma-speced 17px backdrop blur (`--blur-scrim`) — was missing from the original implementation. |
| 2026-08-15 | type | `text-headline` reduced 32/41 → 28/36 — all page titles and KPI counts step down together; skeletons resized (headline lines h-9, hero-button lines corrected to h-10). |
| 2026-08-15 | type | Meter readings reduced 24→18: `MeterTile` values now use `text-title`; the orphaned `text-stat` token retired (tiles resize to 85px by content). Skeleton value lines shrunk to match. |
| 2026-08-15 | components | Tooltips reshaped: centered above the trigger, `max-w-40` + `p-2.5` so copy wraps into a compact block (was long/skinny, right-aligned). `align` prop removed. Shadow unchanged. |
| 2026-08-15 | components | Tab control rows raised to 40px per Figma `65-15769`: `SearchInput` 278×40 `pl-4`, `StatusSelect` `h-10 px-4`, "Add Item"/"Log Maintenance" → `Button size="lg"`. |
| 2026-08-15 | components | Dropdown menus: selected option now shows a right-aligned `CheckIcon` (new glyph) alongside its brand text — standard for all menus. |
| 2026-08-15 | components | Header hero buttons enlarged per Figma `88-4370`: `Button` gains `size` (`md` 36 / `lg` 40 with `px-4`); Add Aircraft + Ask AI use `lg` on the dashboard and plane pages. Tab-bar actions and modal footers stay `md`. |
| 2026-08-15 | tokens | `--shadow-card` ambient elevation added per Figma `88-4006` (0/0/58 @ 5%): aircraft cards, KPI cards, sidebar. Top-level surfaces only. |
| 2026-08-15 | all | Log Oil modal locked from Figma `85-1218`: engine `Segment` selector (4px-radius segmented pattern, brand-gradient selected state), oil level/tach/date fields, Added Oil? toggle, optional notes. `Modal` gains `titleInfo` (info icon + tooltip). Oil tiles now open Log Oil with their engine preselected. `todayShort()` extracted to `lib/format`. |
| 2026-08-15 | all | Update Meters restructured per Figma `85-1168`: Hobbs full-width, tachs 2-up grid (odd last spans full), Date full-width; fields move to new `--radius-field` token (8px). Whole Hobbs/tach tiles now open the modal (Edit is the affordance; oil tiles inert). |
| 2026-08-15 | all | Update Meters modal locked from Figma `85-1038`: per-aircraft meter form (Hobbs/tach only), form-field pattern (tile fields, caption label + body input + unit), date field with `CalendarIcon`, Edit-affordance deep-focus. `Modal` gains `subtitle`; `MeterTile` gains `onEdit`. |
| 2026-08-14 | all | Modal system locked from Figma `87-2805` (Sign Out): `ui/Modal` lightbox (ink/80 scrim, 464px panel, open/close animations, Escape/scrim/X dismissal, scroll lock), `ui/Button` (primary gradient / brand outline, 36px pill) extracted and adopted in FleetHeader, AircraftHeader, MaintenanceLogs. `CloseIcon` traced from asset. Sign-out modal wired to the sidebar log-out icon. |
