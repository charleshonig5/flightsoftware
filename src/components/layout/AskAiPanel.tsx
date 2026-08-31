"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpIcon,
  ChatLinesIcon,
  CloseIcon,
  ComposeIcon,
  MagicPenIcon,
  SuggestArrowIcon,
} from "@/components/ui/icons";
import { useAskAi } from "./AskAiProvider";

const SUGGESTIONS = [
  "Which aircraft have overdue maintenance?",
  "When is N747CN's next A-Check due?",
  "Summarize this month's oil consumption",
  "What's due in the next 30 days?",
  "Compare tach hours across the fleet",
  "Which aircraft are ready to fly today?",
];

/**
 * Ask AI sidecar (v2, Figma 123:2) — a floating white sheet on the page
 * ground: 384px wide, 24px top/right margins, flush to the viewport bottom
 * with only its top corners rounded. Slides in from the right (width
 * animates, so the page content reflows live) and persists across
 * navigation. Empty state: header, 28px prompt, brand-tint suggestions,
 * pinned composer.
 */
export function AskAiPanel() {
  const { open, setOpen } = useAskAi();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const pickSuggestion = (text: string) => {
    setDraft(text);
    inputRef.current?.focus();
  };

  return (
    <aside
      aria-label="Ask AI"
      aria-hidden={!open}
      /* z-40: above the sheet's sticky cap (z-20) and glow layer (z-30) so
         overflowing content can never paint over the open panel */
      className="sticky top-0 z-40 h-screen shrink-0 overflow-hidden transition-[width] duration-300 ease-(--ease-snap)"
      style={{ width: open ? 408 : 0 }}
    >
      {/* fixed-width inner so content never squishes while the panel animates */}
      <div className="h-full w-102 pt-6 pr-6">
        <div className="flex h-full flex-col overflow-hidden rounded-t-field border border-divider bg-card px-6 pt-8.25 pb-3.75 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChatLinesIcon className="size-5" />
              <span className="text-body leading-none font-medium">Ask AI</span>
            </div>
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                aria-label="New chat"
                onClick={() => setDraft("")}
                className="cursor-pointer transition-colors duration-150 hover:text-ink-muted"
              >
                <ComposeIcon className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Close Ask AI"
                onClick={() => setOpen(false)}
                className="cursor-pointer transition-colors duration-150 hover:text-ink-muted"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>
          </div>

          <div className="mt-11 flex flex-col gap-8.5">
            {/* width-capped so the prompt breaks after "your", per Figma */}
            <h2 className="max-w-60.5 text-headline font-normal">Ask about your aircraft(s).</h2>
            {/* keyed by open state so the chips cascade in on every panel open,
                starting as the 300ms slide finishes revealing them */}
            <div key={open ? "open" : "closed"} className="flex flex-col items-start gap-3.5">
              {SUGGESTIONS.map((text, index) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => pickSuggestion(text)}
                  style={{ animationDelay: `${120 + index * 30}ms` }}
                  className="group/sug flex cursor-pointer items-center gap-2 rounded-tile bg-brand-soft px-3.5 py-2.75 transition-colors duration-150 hover:bg-brand/15 animate-row-in"
                >
                  <SuggestArrowIcon className="size-5 -scale-y-100 text-ink-muted transition-transform duration-150 ease-(--ease-snap) group-hover/sug:translate-x-0.5" />
                  <span className="text-body whitespace-nowrap">{text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            {/* 99px composer: 13px pad + 18 input + 21 + 32 footer + 13 + borders */}
            <div className="flex flex-col rounded-field border border-divider bg-tile p-3.25">
              <textarea
                ref={inputRef}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask anything about your fleet..."
                className="h-4.5 w-full resize-none bg-transparent text-body outline-none placeholder:text-ink-muted"
              />
              {/* pen and send sit flush on the same bottom edge (Figma) */}
              <div className="mt-5.25 flex items-end justify-between">
                <MagicPenIcon className="size-4 text-ink-muted" />
                {/* keyed by draft state: the send circle pops awake when a
                    draft first exists */}
                <button
                  key={draft.trim() === "" ? "idle" : "armed"}
                  type="button"
                  aria-label="Send"
                  disabled={draft.trim() === ""}
                  onClick={() => setDraft("")}
                  className={`flex size-8 items-center justify-center rounded-full bg-linear-to-r/srgb from-brand to-brand-strong text-white transition-all duration-150 disabled:opacity-50 [&:not(:disabled)]:cursor-pointer [&:not(:disabled)]:hover:opacity-85 [&:not(:disabled)]:active:scale-[0.97] ${
                    draft.trim() === "" ? "" : "animate-chip-in"
                  }`}
                >
                  <ArrowUpIcon className="size-5.5" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-center text-caption text-ink-muted">AI can get things wrong.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
