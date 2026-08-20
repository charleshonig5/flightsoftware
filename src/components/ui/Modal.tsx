"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, InfoIcon } from "./icons";
import { Tooltip } from "./Tooltip";

/**
 * Lightbox modal — the one way modals work in Flight.
 * 80% ink scrim + centered 464px white panel. Opens with a back-out pop
 * (250ms), closes with a quick slip-away (180ms) — the panel stays mounted
 * until the exit animation finishes. Dismiss via scrim click, Escape, or
 * the X; any parent-driven close (footer buttons) animates the same way.
 */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  titleInfo,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Context line under the title (e.g. the aircraft's tail number) */
  subtitle?: string;
  /** Tooltip copy behind a 14px info icon next to the title */
  titleInfo?: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(open);

  useEffect(() => {
    if (!open) return;
    setRendered(true);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  /* Fallback: if animationend is missed (hidden tab), still unmount after the exit window */
  useEffect(() => {
    if (open || !rendered) return;
    const timer = setTimeout(() => setRendered(false), 300);
    return () => clearTimeout(timer);
  }, [open, rendered]);

  if (!rendered) return null;

  /* Portal to <body>: ancestors with stacking contexts (sticky sidebar,
     view-transition names) can never paint page content above the scrim. */
  return createPortal(
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-6 backdrop-blur-scrim ${
        open ? "animate-scrim-in" : "animate-scrim-out"
      }`}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onAnimationEnd={(event) => {
          if (!open && event.target === event.currentTarget) setRendered(false);
        }}
        className={`w-[464px] max-w-full rounded-card bg-card p-6 outline-none ${
          open ? "animate-modal-in" : "animate-modal-out"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-title font-semibold">{title}</h2>
              {titleInfo && (
                <Tooltip content={titleInfo}>
                  <span className="text-ink-faint transition-colors duration-150 group-hover/tip:text-brand group-focus-visible/tip:text-brand">
                    <InfoIcon className="size-3.5" />
                  </span>
                </Tooltip>
              )}
            </div>
            {subtitle && <p className="text-body">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="cursor-pointer text-ink-faint transition-colors duration-150 hover:text-ink-muted"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
