# Flight CRM — Design System v2

> **Status: v2 core LOCKED** (file `LuaXriGgwjSXjovjZU4w0t`) — dashboard
> `102:5689`, aircraft cards `101:3`, tooltip + filters `107:9826`, activity
> feed `117:581`, Ask AI sidecar `123:2`. Plane-page inner tabs beyond
> Overview/Logs/Schedule/Activity still await their frames.
> This document is the single source of truth for v2 design **rules**; the
> `@theme` block in [`src/app/globals.css`](../src/app/globals.css) is the
> single source of truth for token **values**. Any change to one must update
> the other in the same commit.
>
> **v1 is fully preserved** — code and its complete locked design-system
> documentation — on the `v1` branch and the `v1-original` tag. Do not append
> v1 history here; consult the branch.

## How this system works

- Tailwind CSS v4 generates utilities directly from the `@theme` CSS variables.
  A token named `--color-ink-muted` is used as `text-ink-muted`, `--radius-tile`
  as `rounded-tile`, `--shadow-card` as `shadow-card`, etc.
- **No magic values in components.** No arbitrary Tailwind values. If a design
  needs a value with no token, map it to the nearest token or add a new token
  here first. (One sanctioned exception: the sidebar's fixed `w-[237px]`
  structural width.)
- Tailwind's dynamic spacing scale is in play: quarter steps are valid
  (`px-10.75` = 43px, `pt-8.25` = 33px, `py-3.25` = 13px).
- What carries over from v1: the data layer (`src/lib/data/`), routing,
  modal/lightbox behavior, entrance-animation scoping (first app load only,
  via `src/lib/entrance.ts`), and interaction principles (affordances preview
  what a click does; the ↗ nav cue never lies).

## 0. The v2 idea: one sheet on a quiet ground

v1 built hierarchy from **surface color** (white cards on a grey page, grey
tiles on white cards, no borders). v2 keeps that layering but adds a third
tool — the **hairline border** — and reorganizes the app around a single
white **sheet**:

- The **page background** (`bg-page`, `#f7f8fa`) runs edge to edge. The
  **sidebar has no fill and no shadow** — it blends into the page background
  so content reads as sitting *on top* of it.
- Each screen's content lives on one white **sheet**: `rounded-card` (14px),
  `border-divider` hairline, `shadow-card` glow, floating with 24px margins
  (`my-6 mr-6`; the sidebar provides the left edge).
- Panels nested *inside* the sheet (KPI bar, tables) are white-on-white,
  separated by hairline borders + the lighter `shadow-card-soft` glow, not by
  fill color.
- Type got quieter: **Regular is the dominant weight**. SemiBold is reserved
  for big KPI numbers and card tail numbers; Medium for button/pill labels.

## 1. Color

| Token | Value | Usage |
|---|---|---|
| `--color-page` | `#f7f8fa` | App background **and** the sidebar (which is unfilled) |
| `--color-card` | `#ffffff` | The sheet, nested panels, aircraft cards, overlays, paddles, sidebar count badge |
| `--color-tile` | `#f7f8fa` | Inset fills on a white surface: tab count badges, composer, tile/row hover wash |
| `--color-chip-neutral` | `#f1f1f1` | Neutral chip fill; the standard **darker-grey hover** (pills, sidebar nav rows) |
| `--color-brand` | `#4a78f1` | Active nav & tab labels, outline-button text, links, brand icons, gradient start |
| `--color-brand-strong` | `#2460ff` | Gradient end for brand fills (primary buttons) |
| `--color-brand-soft` | `#ebf1ff` | Brand tint: active sidebar pill, KPI "quiet" chips, filter chips, activity icon chips, Ask AI suggestions, outline-button/pill hover |
| `--color-divider` | `#e8e8e8` | **The v2 hairline.** Sheet/panel/table borders, row separators, tab underline track, tree line |
| `--color-ink` | `#000000` | Primary text |
| `--color-ink-muted` | `#909090` | Secondary text: labels, units, inactive tabs, timestamps, email, footer icons |
| `--color-ink-faint` | `#d2d2d2` | Tertiary: idle info icons, gauge tracks, idle card-nav arrow |
| `--color-danger` / `-soft` | `#f31515` / `#ffd2d2` | Overdue status text / chip fill |
| `--color-warning` / `-soft` | `#cc6900` / `#fbdbb9` | Upcoming status text / chip fill |
| `--color-success` / `-soft` | `#07c91f` / `#d0ffd6` | Current status text / chip fill |

Rules:

- Status colors appear **only** in status chips — never on standalone text,
  icons, or gauges (v2 gauge arcs always carry the brand→brand-strong
  gradient on a divider-grey track).
- v2 change: **KPI chips are always `quiet`** (brand-soft fill + muted text),
  regardless of sentiment. Status colors live in the table/card rows where the
  item-level truth is.
- The active-state tint is always `brand-soft` + `brand` text. The one
  exception (per Figma): **tab count badges stay `tile` + muted even on the
  active tab** — only the label and underline carry the active color.

## 2. Typography

Face: **Geist** (`--font-sans`), Geist Mono available but unused in v2.

| Token | Size/Line | Weight in v2 | Usage |
|---|---|---|---|
| `text-caption` | 10/13 | Regular (Medium in "View" pills + popover Apply/Clear) | Chips, badges, meta, timestamps, email, tile labels |
| `text-body` | 14/18 | Regular (Medium in buttons/pills) | Default text: nav, tabs, table cells, labels, units, activity sentences |
| `text-title` | 18/23 | SemiBold for headings, **Regular** for meter values | Card headings (tail numbers), meter tile values |
| `text-headline` | 28/36 | **Regular** for greetings/prompts, **SemiBold** for KPI counts + the plane-page tail | Page greeting, Ask AI prompt, KPI numbers, plane-page title |

Rules:

- **Regular-dominant.** Section headers, tabs, table headers, labels — all
  Regular. Hierarchy comes from size + color (ink vs ink-muted), not weight.
- No 30/32px sizes exist in v2; the top of the ramp is 28.
- The dashboard greeting is time-of-day aware: `Good {morning|afternoon|evening},
  {firstName}` — 28px **Regular** (`Greeting.tsx`).

## 3. Spacing

Sheet geometry (dashboard, `src/app/page.tsx`):

- Sheet margins: **24px** top (the cap's ground strip) / bottom (the body's
  `mb-6`) / right (`mr-6` on the page wrapper); sidebar (237px) is the left
  edge.
- **Locked top cap**: the sheet is split into a sticky cap and a scrolling
  body. The cap = the 24px ground strip + the sheet's rounded top edge with
  its top/side hairlines, holding the page header (+ KPI bar on the
  dashboard) and tab bar — it never moves. The body continues the card
  downward (side/bottom hairlines, `rounded-b-card`, `mb-6`) and scrolls
  with the page — the bottom reads as an open-ended scroll, never an inner
  scrollbox. A `min-h-screen` on the column (which already contains the 24px
  top strip and the body's 24px bottom margin, with `flex-1` on the body)
  keeps short pages at full height with **equal 24px top/bottom margins**.
  The card's glow lives **once, on a dedicated empty layer** — absolutely
  positioned to the card's exact layout bounds (`inset-x-0 top-6 bottom-6`),
  `rounded-card shadow-card`, pointer-events-none, painting below the sticky
  mask. It is **statically clipped to sides + bottom only**
  (`clip-path: inset(0 -58px -58px)`) so its shape is identical at every
  scroll position — a scrolling card must never have a morphing shadow. The
  sticky's ground strip carries a small opaque cover extending past the card
  edges (`-left-14 -right-6`) so the side halo can never peek beside it
  while pinned. Net rules: the halo borders only white, never animates, and
  the card intentionally has no top halo (invisible at 5%, and consistent).
- Sheet gutters: **43px** left/right (`px-10.75`), **33px** top (`pt-8.25`), **43px** bottom (`pb-10.75`).
- Vertical rhythm inside the sheet: greeting row → **34px** (`mt-8.5`) → KPI
  bar → **46px** (`mt-11.5`) → tab row → **34px** (`mt-8.5`) → tab content.

Component spacing:

- KPI cells: `p-6 pb-5` (24px, optical 20px bottom); label row → count row gap lands the cell at **108px** tall.
- Tab row: **34px** between tabs (`gap-8.5`), label→badge gap 4px (`gap-1`), 36px total height (label 18 + 14 below, `pb-3.5`).
- Table: header `px-6 py-3.25` (24/13 → 45px tall); rows `h-12` (48px pitch, matches Figma's 38px row + 10px gap with centered dividers).
- Sidebar: 34px gutters (`px-8.5`), logo at top 44 (`pt-11`), nav pills 46px tall (`h-11.5`) with 14px inner padding (`px-3.5`), tree rows 32px (`h-8`), footer `pb-8.5`.
- Aircraft pages sit on the **same sheet shell as the dashboard**
  (same margins + 43/33/43 gutters) — the root layout's `<main>` is bare so
  each screen owns its surface, using the locked-cap architecture above —
  header + tab bar in the cap, tab content scrolling beneath and tucking
  under the tab rule. The dashboard pins the same way (greeting + KPI bar +
  tab bar in the cap). Their v1 "surface inversion" pieces were
  re-grounded for the white sheet: photo placeholder = tile fill + hairline,
  search/dropdown fields and maintenance rows = white + hairline (rows keep
  the 4px status accent as the left border), dropdown menus use the v2
  overlay surface. Full plane-page restyle still awaits its Figma frames.

## 4. Radii, borders, elevation

| Token | Value | v2 usage |
|---|---|---|
| `--radius-check` | 4px | Checkboxes |
| `--radius-nav` | 8px | Sidebar nav pills |
| `--radius-field` | 8px | Form fields, **KPI bar**, **fleet table**, **tooltips**, **filter popovers** (nested panels + v2 overlays) |
| `--radius-tile` | 10px | Meter tiles (standalone), photo placeholder, Ask AI suggestion chips |
| `--radius-card` | 14px | The sheet, aircraft cards, **"View item" pills**, modals |
| `rounded-full` | — | Chips, badges, buttons, pill buttons, toggle |

Borders — **new in v2, sanctioned**: the `border-divider` hairline outlines
every elevated surface (sheet, KPI bar, table, aircraft cards, outline
buttons, "View item" pills) and separates rows (table rows, activity rows,
KPI cells via `border-l`). v1's "no borders anywhere" rule is retired.

Elevation:

| Token | Value | Usage |
|---|---|---|
| `--shadow-card` | `0 0 58px rgb(113 113 113 / 5%)` | Ambient glow: the sheet (via its glow layer), tables, aircraft cards, **all buttons**, **v2 overlays (tooltips, filter popovers, dropdowns)**, **modal panels**, the Ask AI sidecar, paddles, activity icon chips |
| `--shadow-card-soft` | `0 0 29px rgb(113 113 113 / 5%)` | Half-strength glow for panels nested inside the sheet (KPI bar) |
| `--shadow-pop` | `0 4px 12px 8%, 0 1px 3px 6%` | Legacy v1 overlays not yet redesigned (dropdown pickers) |
| `--blur-scrim` | 12px | Modal lightbox backdrop blur |

The sidebar has **no elevation** (it *is* the ground plane).

## 5. Motion & interaction

Unchanged from v1 (all tokens in `@theme`): gauge fill (900ms
`--ease-out-back`, first app load only), modal in/out pop, scrim fade,
skeleton shimmer, card-nav arrow nudge via the `card-nav-hover` custom
variant.

v2 additions:

- **Tab underline** slides between tabs: measured `left/width`,
  `transition-[left,width] duration-250 ease-(--ease-snap)`; 2px `bg-brand`,
  sitting on the hairline track.
- Standard hover grammar: interactive grey elements darken to
  `chip-neutral`; muted text/icons rise to `ink`; white brand-labeled
  controls (pills, outline buttons) tint `brand-soft`; meter tiles wash
  `bg-tile`. Filterable table headers hold `ink` while their column has an
  active filter or an open popover.
- Snappy always: optimistic UI, no artificial spinners over fake data.

**Micro-interactions** (entrance-only, all on existing easings, all disabled
under reduced motion):

- `animate-pop-in` (150ms `ease-snap`, `origin-top-left`): filter popovers
  scale in from their trigger. No exit animation — overlays close instantly.
- `animate-tab-in` (200ms `ease-snap`): the entering tab panel fades in with
  a 6px rise on every tab switch (content keyed by tab), both pages.
- `animate-row-in` (250ms `ease-snap`): table rows cascade with a 12ms/row
  stagger (capped at row 20); the row list is keyed by the filter/search
  signature so the cascade replays when the result set changes.
- `animate-chip-in` (200ms `ease-out-back`): filter chips mount with a
  slight overshoot; they clear instantly.
- **Row hover**: schedule/logs rows wash `bg-tile` (150ms), matching tiles.
- **Sidebar active pill**: the brand-soft pill + edge bar are one measured
  overlay that slides between nav rows (250ms `ease-snap`, tab-underline
  mechanism; positioned pre-paint so first render doesn't animate, hidden
  while a tail target is inside the collapsed tree).
- **Activity cascade**: feed rows use the row cascade with a running index
  across month groups.
- **Ask AI**: suggestion chips cascade in on every panel open (120ms base +
  30ms/chip, timed to the 300ms slide); the suggestion arrow nudges 2px on
  hover (card-arrow grammar); the send circle pops awake (`chip-in`) when a
  draft first exists. Overflow paddles also mount with `chip-in`.

v1 retirements: the grid/list view toggle and its View Transitions morph are
gone — the Aircraft(s) tab has exactly one layout (full-width stacked cards).

## 6. AI chat (Ask AI) — locked (Figma `123:2`)

The sidecar is a **floating sheet**, mirroring the main sheet's grammar:
**384px** white panel with 24px top and right margins, flush to the viewport
bottom, only its **top corners** rounded (`rounded-t-field`), hairline
border, `shadow-card`. It pushes content left — the outer width animates
0 ↔ 408px (panel + right margin) over 300ms `ease-snap` with a fixed-width
inner column so nothing squishes. Gutters match the sheet: `px-6 pt-8.25`.

- **Header**: 20px ChatLines icon + "Ask AI" 14 Medium (`gap-2`); right side
  20px Compose (clears the draft) and Close icons at `gap-3.5`, ink → muted
  on hover. Esc also closes.
- **Empty state** (`mt-11`): "Ask about your aircraft(s)." — 28 Regular,
  width-capped (`max-w-60.5`) to break after "your". 34px below, suggestion
  chips stacked at `gap-3.5`: `rounded-tile` **brand-soft** fill,
  `px-3.5 py-2.75`, 20px flipped reply arrow (muted) + single-line 14px ink
  text; hover deepens to `bg-brand/15`; clicking seeds the composer.
- **Composer** (pinned bottom): 99px tall, `rounded-field` + hairline,
  **tile** fill, `p-3.25` — placeholder 14 muted, bottom row with the 16px
  MagicPen (left) and the **32px send circle** (brand→brand-strong gradient,
  22px white ↑, 50% opacity until a draft exists). 8px under it, centered
  muted 10px "AI can get things wrong."; 15px panel bottom padding.

## 7. Components

### Sidebar (`src/components/layout/Sidebar.tsx`)
Fixed 237px, sticky, **transparent** — blends with `bg-page`. Logo lockup
(108×23, `public/maggneto-lockup.svg`). Nav pills: 46px, active =
`text-brand` under the **sliding indicator overlay** (§5: one brand-soft
pill + 2px edge bar gliding between rows); inactive hover =
`bg-chip-neutral`. Aircraft tree: hairline spine, 32px rows; the same
overlay serves active tail rows. Count badge: the shared `CountBadge`
(`textSize="body"` — same 14px metrics as the tab badges), **white** fill on
the grey ground (`surface="page"`). Footer: stacked name (`text-body`, ink) +
email (`text-caption`, muted) with 2px gap; right side Help + Logout icons
(16px, `gap-3.5`, muted → ink on hover, **top-aligned with the name line**);
logout opens the Sign Out modal.

### Sheet header (`FleetHeader.tsx` + `Greeting.tsx`)
Greeting left (28 Regular); right: `Add Aircraft` (lg outline, AddCircle 20px
icon) + `Ask AI` (lg primary gradient, ChatLines 20px icon), `gap-3.5`.

### Buttons (`ui/Button.tsx`)
`primary` = brand→brand-strong gradient, white Medium text; `outline` = white
fill, divider hairline, **brand** Medium text, `hover:bg-brand-soft`. Sizes:
`md` 36px / `lg` 40px (heroes). All buttons carry `shadow-card` (v2),
`rounded-full`, `active:scale-[0.97]`.

### KPI bar (`dashboard/KpiBar.tsx`)
**One** panel: `rounded-field border-divider bg-card shadow-card-soft`, four
`flex-1 p-6 pb-5` cells split by `border-l` hairlines, 108px tall — the
bottom pad is optically corrected to 20px because the count's 36px line box
carries ~7px of dead leading under the 28px digits (24px read ~31px).
Cell anatomy:
label row (14px icon + `gap-2` + caption muted label), info icon top-right
(faint → brand on hover, tooltip), count row `mt-3.5` — 28 SemiBold count,
baseline-aligned 14px unit (`gap-2.5`), and a **quiet** chip bottom-right
(lifted `mb-1.5` to sit on the unit's text box).

### Tab overflow (plane pages, `aircraft/AircraftTabs.tsx`)
Mercury-style: the tab row never wraps or shrinks — it scrolls horizontally
with the scrollbar hidden (`scrollbar-none` utility), and each clipped edge
shows a 40px **card-white gradient fade** as the affordance (fading via
150ms opacity). The active tab auto-scrolls into view (smooth, `nearest`) on
selection, deep-link arrival, and width changes — a ResizeObserver re-runs
measurement so the underline and fades stay correct while the Ask AI panel
animates the content width. Navigation affordances: trackpad swipe /
shift+wheel work natively; a **vertical wheel over the row scrolls it
horizontally**; and **26px circular paddles** (the activity-chip surface:
white, hairline, `shadow-card`, muted 14px chevron → ink + tile wash on
hover, label-row centered) float over the fades and page the row 240px per
click.

### Dashboard tabs (`dashboard/DashboardTabs.tsx`)
`Aircraft(s) · Maintenance Schedule · Activity` on a hairline track. Labels
14 Regular: active `text-brand`, inactive muted. Count badges: the shared
`CountBadge` (`textSize="body"`: `px-2 py-1` `rounded-full` 14px muted),
always `bg-tile` (no active variant) — one component with the sidebar's
badge, so all count pills stay aligned. Sliding 2px brand underline spans label + badge. Content starts
`mt-8.5`.

### Schedule table (`dashboard/FleetScheduleTable.tsx`)
One component, two scopes: fleet-wide on the dashboard's Maintenance
Schedule tab, and per-aircraft on each plane page's tab (pass `aircraft`) —
the UI is identical in both places. The filter machinery (hook, header-cell
popover, chips row) lives in `ui/columnFilters.tsx` so every v2 table shares
it — **Maintenance Logs** follows this exact pattern too (columns Title ·
Date · Type · Component · Hours · Mechanic · Photos; Date/Type/Component/
Mechanic filterable, Date by year; fixed newest-first order; brand "View"
pills; its v1 search + sort retired).
`rounded-field border-divider bg-card shadow-card`. Columns
`352/114/157/199/146/79 fr` (Service Name · Aircraft · Status · Type · Last
Service · Action), `px-6` gutters. Header 45px, muted 14 Regular — and
**sticky**: it pins just below the sticky cap (`top: var(--cap-h)`, a CSS
variable the tab components publish from a ResizeObserver on the cap), so
column labels and filters survive long scrolls. Rows are always ordered
danger→warning→success, 48px pitch, hairline-separated, and the **whole row
is clickable** (opens the maintenance-item modal; interactive children
exempt, same as aircraft cards) — the brand service-name link and the
**"View item" pill** (`rounded-card` 14px! white + hairline, 10px Medium
brand, `px-2.5 py-1.5`, `hover:bg-brand-soft`) remain as explicit
affordances. Status chips keep their **status** tones here.

**Column filters** (Figma `107:9826`): the FilterLines icon on
Aircraft/Status/Type/Last Service opens a **filter popover** — white +
hairline, `rounded-field`, `shadow-card`, 126px min width, 13px gutters:
muted 10px "Filter by X" title, checkbox list (16px `rounded-check` boxes,
hairline off / brand fill + white check on, 10px ink labels, `gap-2` rows),
hairline divider, then **Apply** (10 Medium brand) and **Clear all** (10
Medium muted) at `gap-3.5`. Apply commits; Esc/outside click dismisses.
Active filters render as **quiet chips** 20px under the tab row (14px above
the table): `bg-brand-soft` + muted 10px `"Column: values"` text with a 10px
✕ (`gap-2`) that clears the column. A column with an active filter keeps its
header label ink. Last Service filters by year; Status by
Overdue/Upcoming/Current.

### Tooltips (`ui/Tooltip.tsx`) — v2 (Figma `107:9826`)
White + hairline, `rounded-field`, `shadow-card`, `p-3.5`, fixed 156px width
(`w-39`), centered above the trigger with the fade/slip entrance. Muted 10px
title (leading 11) over ink 10px body (leading 14), `gap-1` — KPI tooltips
title with the KPI label.

### Chips (`ui/Chip.tsx`)
v2 metrics: **`px-2 py-1.25`** (8/5px), 10px leading-none → 20px tall,
`rounded-full`. Tones: `danger`/`warning`/`success` (status pairs),
`neutral` (white on tile), `neutral-on-card` (grey on white), `tile`,
and v2's `quiet` (brand-soft fill + muted text — KPI bar only).

### Activity feed (`dashboard/ActivityFeed.tsx`) — locked (Figma `117:581`)
One padded panel (`rounded-field` + hairline + `shadow-card`, `p-6`) holding
**month groups** at `gap-8.5`. Group header: month 14 Regular + muted 10px
"N Items" count (`gap-3.5`), hairline rule 8px below; items start 24px under
the rule, stacked at `gap-6`. Item row (`gap-3.5`): a **26px icon chip**
(`rounded-full`, brand-soft fill, hairline, `shadow-card`) holding a muted
14px icon — every action type has one that reads at a glance: gauge (meter
readings), droplet (oil logs), toolbox (physical maintenance work), alert
triangle (status changes, e.g. due → overdue), file-with-check
(records/certification/config), aircraft (fleet changes) — then a column
(`gap-1.5`) of muted 10px time + date (`gap-3.5`) over the 14px ink
sentence. The sentence **ends with the aircraft tail as a brand link** with
a 16px ↗ (`gap-0.5`) that deep-links to the aircraft page — on link hover
the arrow nudges up-right (the card nav-arrow grammar); no trailing
period. Content format (locked): one impersonal sentence — **never any
people or vendor names** — past-tense verb first, from→to values where
applicable, the aircraft always last. Data: `src/lib/data/activity.ts`
(`activityMonths`, newest first, reaching back several months).
Plane pages get a **scoped Activity tab** (after Maintenance Schedule) —
the same feed filtered to that aircraft, with empty months dropped and the
tail link omitted (the sentence's trailing "on"/"as" connector, plus any
comma before it, is trimmed since the plane is already the context).

### Aircraft cards (`dashboard/AircraftCard.tsx`) — locked (Figma `101:3`)
Full-width cards stacked with 14px gaps (`FleetSection`), needs-attention
first. Card: `rounded-field` (8px) + hairline + `shadow-card`, `p-6`, whole
card navigates to the aircraft page (interactive children exempt; ↗ arrow
nudges via `card-nav-hover`). Header: tail 18 SemiBold + status chip
(`gap-2`), model 14 Regular below (`gap-1.5`); right side Update Meters /
Log Oil pills (`gap-2`) + 16px nav arrow (`gap-3.5`). Below (`mt-6`) the
**flush meter grid**: `grid-cols-4`, zero gap — every cell carries a full
hairline border, `-ml-px`/`-mt-px` overlap collapses shared edges, and only
cells sitting on an actual grid corner get `rounded-*-field` (a partial last
row leaves its outer corner square). No maintenance preview, no collapse —
that content lives in the Maintenance Schedule tab.

### Meter tiles (`dashboard/MeterTile.tsx` + `dashboard/MeterGrid.tsx`)
The flush grid lives in the shared `MeterGrid` — used by dashboard aircraft
cards and the plane page's Overview tab, so both always match.
White surface + hairline border (standalone: `rounded-tile`; in a card grid
the parent passes corner shape). `p-3.5`, column `gap-2`: label 10 ink, value
18 **Regular** tabular-nums with baseline-aligned 10px muted unit, meta 10
muted; sub-1 oil rates render bare-decimal (".22"). Edit affordance top-right
(10px faint + 14px icon, `gap-2`, rises to muted on tile hover) and the gauge
(60×30, brand→brand-strong gradient arc on a divider track, fully
round-capped, staggered first-load draw-in) bottom-right — both at the
tile's uniform **14px** inset (optical correction: the frame drew 24px on
the right, which read uneven against the 14px left padding). Whole tile
opens its update modal; hover washes `bg-tile`. Grids with fewer than 4
meters widen their tiles to share the full row.

### Search field (`ui/SearchInput.tsx`)
Keyword search: 40px white pill, 278px (`w-69.5`), hairline border, `px-4`
with a trailing 16px faint SearchIcon, faint placeholder,
`focus:outline-brand-soft`. With a query, the icon becomes a **one-click
clear ✕** (muted → ink on hover, `chip-in` entrance) that empties and
refocuses the field. Lives in the plane-page table toolbars (action button +
search clustered at the 14px control gap); filters AND with the column
popovers.

### Pill buttons (`ui/PillButton.tsx`)
v2 pill: 30px tall, `px-2.5`, `rounded-full`, white fill + hairline border,
**10px Medium brand** label, `hover:bg-brand-soft` — one look on every
surface (the v1 grey soft-pill variants are retired). `brand-outline` keeps
the brand border for micro-CTAs.

### Skeletons (`app/loading.tsx`, `app/aircraft/[tail]/loading.tsx`)
Every screen mirrors its real anatomy: the dashboard skeleton renders the
sheet, greeting row, segmented KPI bar, tab row, and two bordered cards;
the aircraft skeleton wraps in the page's own padding. Shimmer via
`animate-shimmer`.

## Fake data

Unchanged from v1: all data lives in `src/lib/data/aircraft.ts` (`fleet`,
fully typed; stats and sidebar derive from it) plus `activity.ts`. The current
user is `Charles Honig <charles@maggneto.com>`. Keep additions realistic:
FAA-style tail numbers, real aircraft models, plausible hours/intervals;
engine count drives meter sets. Aircraft photos (`photo`, rendered
object-cover in the header slot) live in `public/aircraft/` — **CC0-licensed
imagery only** (sourced via Openverse), type-accurate to the airframe.

---

## Change log (v2)

| Date | Section | Change |
|---|---|---|
| 2026-08-20 | — | v2 document created; v1 preserved on the `v1` branch / `v1-original` tag. |
| 2026-08-30 | 0, 1, 4 | v2 dashboard locked from Figma `102:5689`: sheet-on-ground architecture, hairline borders sanctioned, sidebar unfilled. |
| 2026-08-30 | 1 | `--color-brand-soft` retuned `#f3f6ff → #ebf1ff`; new `quiet` chip tone. |
| 2026-08-30 | 4 | New `--shadow-card-soft` (29px half-glow) for nested panels; all buttons gain `shadow-card`. |
| 2026-08-30 | 2 | v2 type ramp locked: Regular-dominant, greeting 28 Regular, top of ramp 28. |
| 2026-08-30 | 7 | Chip metrics tightened to 8/5px (20px tall) per v2 frame. |
| 2026-08-30 | 7 | New components: KPI bar, dashboard tabs (+badges), fleet schedule table, "View item" pill, activity feed (provisional), sidebar footer w/ email + help. |
| 2026-08-30 | 5, 7 | Aircraft cards locked from Figma `101:3`: full-width stacked cards, flush 4-across meter grid (shared hairlines, corner-only rounding), white brand pills; maintenance preview and grid/list toggle retired. |
| 2026-08-30 | 1, 7 | Gauges de-statused: always brand arc, rendered at the full 60×30; Edit/gauge right inset 24px; oil rates bare-decimal. |
| 2026-08-30 | 7 | Gauge fully round-capped — progress tip and both baseline ends (endpoints raised one cap-radius so the caps sit on the baseline) — matching the rounded corner language. Meter grids with <4 meters widen tiles to fill the row. |
| 2026-08-30 | 1, 7 | Gauge arc gets the Figma brand→brand-strong gradient (matches the primary button); track corrected from ink-faint to divider. |
| 2026-08-30 | 4, 7 | Tooltip + table filter UI locked from Figma `107:9826`: v2 overlay surface (white/hairline/`rounded-field`/`shadow-card`), title+body tooltip, per-column filter popovers with checkboxes (new `--radius-check` token), quiet active-filter chips; table sorting retired in favor of filters. |
| 2026-08-30 | 7 | Activity feed locked from Figma `117:581`: month groups, gauge/toolbox/records icon chips, time+date meta, tail-number links with ↗; data restructured into `activityMonths`. |
| 2026-08-30 | 7 | Audit: third activity icon kind (file-with-check, records events) added from the frame's May group; Aircraft Status KPI chip copy → "Need(s) attention". |
| 2026-08-30 | 7 | Activity feed: actors removed (impersonal sentences only); icon kinds expanded to six (gauge/droplet/toolbox/alert/file-check/aircraft); history extended back to March 2026. |
| 2026-08-31 | 6 | Ask AI sidecar locked from Figma `123:2`: floating 384px sheet (24px top/right margins, top-rounded, hairline), 28px prompt, brand-soft suggestion chips, bordered 99px tile composer, animated width 0↔408. |
| 2026-08-31 | 3 | Aircraft pages moved onto the dashboard's sheet shell; v1 white-on-grey surfaces (photo box, search, status dropdown, maintenance rows) re-grounded with v2 hairlines/tile fills. |
| 2026-08-31 | 4 | Modal panels get the content-card surface: hairline border + `shadow-card` (matches sheet/cards/overlays). |
| 2026-08-31 | 7 | Plane-page Maintenance Schedule tab now renders the exact dashboard schedule table (scoped per aircraft); v1 card list, search, and status dropdown retired (`MaintenanceItem` deleted). |
| 2026-08-31 | 7 | Plane-page Overview tab uses the dashboard cards' flush meter grid (extracted to shared `MeterGrid`); v1 spaced tile grid retired. |
| 2026-08-31 | 7 | Maintenance Logs rebuilt on the schedule-table pattern (shared `columnFilters` extracted; both tables use it); v1 search + sorting retired, `SearchInput` deleted. |
| 2026-08-31 | 3 | Sheets get a minimum height (viewport − 48px) so short pages keep equal 24px top/bottom margins instead of hugging content. |
| 2026-08-31 | 3 | Locked-cap sheets on both pages: the sticky cap (ground strip + rounded sheet top + header/KPI/tabs) never moves; the sheet body scrolls with the page, open-ended at the bottom — no inner scrollbars. |
| 2026-08-31 | 7 | Plane pages gain a scoped Activity tab (dashboard feed filtered per aircraft, tail links dropped). |
| 2026-08-31 | 7 | Demo data expanded ~25–35%: schedule items 35→46, logs 25→34, activity 18→23 — all type-appropriate per airframe. |
| 2026-08-31 | 7 | KPI cells: bottom padding optically corrected (`pb-5`, 20px) to balance the dead leading under the 28px counts; cells 112→108px. |
| 2026-08-31 | 3 | Greeting → KPI bar gap upped 24 → 34px to join the 34px rhythm. |
| 2026-08-31 | 7 | Plane-page tab headers de-titled: counts moved into dashboard-style tab badges (Maintenance Logs / Maintenance Schedule); toolbar = action button + keyword search clustered left at the 14px control gap (v2 pill field, ANDs with the column filters). |
| 2026-08-31 | 3, 4 | Locked-cap sheets: single card glow on a dedicated layer hugging the card's exact bounds — cap/body shadowless, no clips; fixes shadow wash, seams at the ground boundary, and the phantom offset corner. |
| 2026-08-31 | 7 | Meter tiles: Edit + gauge right inset evened to the tile's 14px padding (was Figma's 24px, read lopsided in the flush row). |
| 2026-08-31 | 5, 7 | Plane-page tab overflow: Mercury pattern — hidden-scrollbar row, card-white edge fades, active tab auto-scrolled into view (new `scrollbar-none` utility). |
| 2026-08-31 | 5, 7 | Tab overflow navigation: wheel-over-row scrolls horizontally; 26px circular paddles (activity-chip surface) in the fades page the row for mouse users. |
| 2026-08-31 | 7 | LogoutIcon normalized to the standard 1px icon stroke (was a literal 0.67px from a v1 asset — read lighter than HelpIcon beside it). |
| 2026-08-31 | 5 | Premium micro-interactions: popover pop-in, tab-panel entrances, staggered row cascades, table row hover, chip overshoot, sliding sidebar pill (four new animation tokens, reduced-motion guarded). |
| 2026-08-31 | 5, 6 | Micro-interactions pass 2: KPI count-up, activity feed cascade, Ask AI suggestion cascade + arrow nudge + send-button wake, paddle entrances. Ask AI panel raised to z-40 (above the sheet's cap/glow layers). |
| 2026-08-31 | 5, 7 | Activity tail-link arrows nudge up-right on hover, mirroring the aircraft-card nav arrow. |
| 2026-08-31 | 7 | Plane-page header identity block aligned to the card pattern: model line muted → ink, 6px tail→model gap. |
| 2026-08-31 | 4 | Glow finalized as fully static: sides + bottom only (permanent clip), painted under the masks, strip cover extended past the card edges — identical shadow at every scroll position, no seams, no morphing. |
| 2026-08-31 | 7 | Search fields: icon swaps to a one-click clear ✕ while a query exists. |
| 2026-08-31 | 7 | Plane-page photo slot filled with CC0, type-accurate aircraft photos for all four airframes (placeholder icon remains the fallback). |
| 2026-08-31 | 5, 7 | KPI count-up removed (unnecessary); all count pills (sidebar + tab badges) unified on the shared `CountBadge` at the 14px tab-badge metrics — bg varies by surface only. |
| 2026-08-31 | 7 | Plane-page header photo stretches to the identity column's height — top edge aligns with the title, bottom edge with the pill row. |
| 2026-08-31 | 3 | Plane-page header → tab bar gap 64 → 46px, matching the dashboard's KPI → tabs rhythm. |
| 2026-08-31 | 7 | Tables: whole-row click opens the item modal (schedule table); column headers stick beneath the cap via a measured `--cap-h` (both tables). |
| 2026-08-31 | all | Documentation audit: status header lists every locked frame; stale toggle/sort/View-Transitions references removed (dead view-transition CSS deleted from globals); type-ramp weights corrected (meter values Regular, plane tail SemiBold, Ask AI prompt headline); KPI cell numbers synced (108px); SearchInput documented; sidebar section points at the sliding indicator. |
