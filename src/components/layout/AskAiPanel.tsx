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
  "What inspections are due in the next 30 days?",
  "Compare tach hours across the fleet",
  "Which aircraft are ready to fly today?",
];

/**
 * Ask AI sidecar — slides in from the right (width animates, so the page
 * content reflows live) and persists across navigation. Empty state per
 * Figma 85-1565: header, prompt suggestions, pinned composer.
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
      className="sticky top-0 h-screen shrink-0 overflow-hidden bg-card shadow-card transition-[width] duration-300 ease-(--ease-snap)"
      style={{ width: open ? 424 : 0 }}
    >
      {/* fixed-width inner so content never squishes while the panel animates */}
      <div className="flex h-full w-[424px] flex-col px-6 pt-8.5 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChatLinesIcon className="size-5" />
            <span className="text-body font-medium">Ask AI</span>
          </div>
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              aria-label="New chat"
              onClick={() => setDraft("")}
              className="cursor-pointer transition-colors duration-150 hover:text-ink-muted"
            >
              <ComposeIcon className="size-5.5" />
            </button>
            <button
              type="button"
              aria-label="Close Ask AI"
              onClick={() => setOpen(false)}
              className="cursor-pointer transition-colors duration-150 hover:text-ink-muted"
            >
              <CloseIcon className="size-5.5" />
            </button>
          </div>
        </div>

        <div className="mt-11 flex flex-col gap-8.5">
          <h2 className="text-title font-semibold">Ask about your fleet.</h2>
          <div className="flex flex-col items-start gap-3.5">
            {SUGGESTIONS.map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => pickSuggestion(text)}
                className="flex cursor-pointer items-center gap-2 rounded-tile bg-tile px-3.5 py-3.25 transition-colors duration-150 hover:bg-chip-neutral"
              >
                <SuggestArrowIcon className="size-5 -scale-y-100 text-ink-muted" />
                <span className="text-body">{text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex flex-col rounded-card bg-tile p-3.5">
            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask anything about your fleet..."
              className="h-4.5 w-full resize-none bg-transparent text-body outline-none placeholder:text-ink-muted"
            />
            <div className="mt-5.25 flex items-center justify-between">
              <MagicPenIcon className="size-4 text-ink-muted" />
              <button
                type="button"
                aria-label="Send"
                disabled={draft.trim() === ""}
                onClick={() => setDraft("")}
                className="flex size-8 items-center justify-center rounded-full bg-linear-to-r/srgb from-brand to-brand-strong text-white transition-all duration-150 disabled:opacity-50 [&:not(:disabled)]:cursor-pointer [&:not(:disabled)]:hover:opacity-85 [&:not(:disabled)]:active:scale-[0.97]"
              >
                <ArrowUpIcon className="size-5.5" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-caption text-ink-muted">AI can get things wrong.</p>
        </div>
      </div>
    </aside>
  );
}
