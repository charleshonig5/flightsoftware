"use client";

import { createContext, useContext, useState } from "react";

const AskAiContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

/** App-level Ask AI sidecar state — lives in the root layout so the panel
 *  persists across client-side navigation. */
export function AskAiProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <AskAiContext.Provider value={{ open, setOpen }}>{children}</AskAiContext.Provider>;
}

export function useAskAi() {
  return useContext(AskAiContext);
}
