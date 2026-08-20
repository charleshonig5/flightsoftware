<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Flight CRM — Project Rules

Flight is a **frontend-only** flight-management CRM. There is no backend and none
is planned: all data is realistic fake data living in typed modules under
`src/lib/data/`. Never add API routes, databases, or fetch calls to real services.

## Design system (critical)

- `docs/DESIGN_SYSTEM.md` is the source of truth for design rules;
  the `@theme` block in `src/app/globals.css` is the source of truth for token values.
- The two must never drift: any token change updates both in the same commit.
- **No magic values in components.** No arbitrary Tailwind values
  (`text-[13px]`, `bg-[#hex]`, `p-[7px]`) — every color, size, and space comes
  from a token. If a token is missing, add it to the system first.
- Fidelity target: match the Figma designs 1:1. Interactions should feel snappy
  (optimistic UI, no artificial spinners over fake data).

## Stack

- Next.js 16 (App Router, `src/` dir), TypeScript, Tailwind CSS v4 (CSS-first config).
- Shared UI primitives live in `src/components/ui/`; feature components in
  `src/components/<feature>/`.
- Deploy target: Vercel, frontend only.
