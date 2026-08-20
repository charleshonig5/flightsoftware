"use client";

import { Button } from "@/components/ui/Button";
import { ChatLinesIcon } from "@/components/ui/icons";
import { useAskAi } from "./AskAiProvider";

/** The hero "Ask AI" button — opens the sidecar. */
export function AskAiButton() {
  const { setOpen } = useAskAi();
  return (
    <Button size="lg" onClick={() => setOpen(true)}>
      <ChatLinesIcon className="size-5" />
      Ask AI
    </Button>
  );
}
