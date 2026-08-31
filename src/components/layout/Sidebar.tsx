"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { allTailNumbers, currentUser } from "@/lib/data/aircraft";
import { CountBadge } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  AddCircleIcon,
  AircraftIcon,
  ChevronUpIcon,
  DashboardIcon,
  HelpIcon,
  LogoutIcon,
  ProfileIcon,
  SettingsIcon,
} from "@/components/ui/icons";

/** Sidebar nav row: 46px pill. The active fill/edge render once in Sidebar
 *  as a measured overlay that slides between rows (tab-underline pattern) —
 *  rows only carry their text color and a `data-nav-target` to measure. */
function NavItem({
  icon,
  label,
  active = false,
  href,
  trailing,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
}) {
  const rowClasses = `flex h-11.5 w-full cursor-pointer items-center gap-2 rounded-nav px-3.5 text-body transition-colors duration-150 ${
    // hover uses the standard darker grey — the tile grey would vanish on the page bg
    active ? "text-brand" : "text-ink hover:bg-chip-neutral"
  }`;
  return (
    <div className="relative px-5">
      {href ? (
        <Link href={href} data-nav-target={href} className={rowClasses}>
          <span className="size-4 shrink-0">{icon}</span>
          {label}
          {trailing && <span className="ml-auto flex items-center gap-1.5">{trailing}</span>}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={rowClasses}>
          <span className="size-4 shrink-0">{icon}</span>
          {label}
          {trailing && <span className="ml-auto flex items-center gap-1.5">{trailing}</span>}
        </button>
      )}
    </div>
  );
}

/** App sidebar: brand, nav, expandable aircraft tree, user footer. Fixed 237px. */
export function Sidebar() {
  const [aircraftOpen, setAircraftOpen] = useState(true);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const pathname = usePathname();
  const activeTail = pathname.startsWith("/aircraft/")
    ? decodeURIComponent(pathname.split("/")[2] ?? "")
    : null;

  /* The active pill + edge bar are one overlay that slides between rows.
     Measured before paint (no slide on first render); re-measured after the
     tree's 200ms collapse/expand so a tail target lands where it settles. */
  const asideRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const activeKey = pathname === "/" ? "/" : activeTail ? `/aircraft/${activeTail}` : null;
  const treeHidden = !aircraftOpen && activeKey !== "/";

  useLayoutEffect(() => {
    const measure = () => {
      const aside = asideRef.current;
      const target = aside?.querySelector<HTMLElement>(`[data-nav-target="${activeKey}"]`);
      if (!aside || !target || treeHidden) {
        setPill(null);
        return;
      }
      const a = aside.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      setPill({ top: r.top - a.top, left: r.left - a.left, width: r.width, height: r.height });
    };
    measure();
    const timer = setTimeout(measure, 230);
    return () => clearTimeout(timer);
  }, [activeKey, treeHidden]);

  return (
    // v2: the sidebar blends into the page background — the white sheet
    // floats on top of it. No fill, no shadow.
    <aside ref={asideRef} className="sticky top-0 flex h-screen w-[237px] shrink-0 flex-col">
      {/* Sliding active indicator: brand-soft pill + brand edge bar (-z so
          row content and hovers paint above it) */}
      {pill && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute -z-10 rounded-nav bg-brand-soft transition-all duration-250 ease-(--ease-snap)"
            style={{ top: pill.top, left: pill.left, width: pill.width, height: pill.height }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 -z-10 w-0.5 rounded-r bg-brand transition-all duration-250 ease-(--ease-snap)"
            style={{ top: pill.top, height: pill.height }}
          />
        </>
      )}
      <div className="px-8.5 pt-11">
        {/* Official lockup (108×23) — asset lives in /public, not hotlinked */}
        <Image src="/maggneto-lockup.svg" alt="Maggneto" width={108} height={23} priority />
      </div>

      <nav className="mt-7.5 flex flex-col gap-1.5">
        <NavItem
          active={pathname === "/"}
          href="/"
          icon={<DashboardIcon className="size-4" />}
          label="Dashboard"
        />

        <div>
          <NavItem
            icon={<AircraftIcon className="size-4" />}
            label="Aircraft(s)"
            onClick={() => setAircraftOpen((open) => !open)}
            trailing={
              <>
                <CountBadge surface="page">{allTailNumbers.length}</CountBadge>
                <ChevronUpIcon
                  className={`size-4 text-ink-muted transition-transform duration-200 ${
                    aircraftOpen ? "" : "rotate-180"
                  }`}
                />
              </>
            }
          />
          <div
            className={`grid transition-[grid-template-rows] duration-200 ease-out ${
              aircraftOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              {/* 3px/7px margins land the 32px rows exactly on the Figma pitch */}
              <div className="relative mt-0.75 mb-1.75">
                <span className="absolute -top-0.75 bottom-1.25 left-10.5 w-px bg-divider" />
                <ul className="flex flex-col">
                  {allTailNumbers.map((tail) => {
                    const active = tail === activeTail;
                    return (
                      <li key={tail}>
                        <Link
                          href={`/aircraft/${tail}`}
                          className="relative flex h-8 items-center pr-5 pl-19 text-body"
                        >
                          {/* invisible span matching the pill bounds — the
                              sliding overlay measures against it */}
                          <span
                            aria-hidden
                            data-nav-target={`/aircraft/${tail}`}
                            className="pointer-events-none absolute -inset-y-px left-16 right-5"
                          />
                          <span
                            className={`relative transition-colors duration-150 ${
                              active ? "text-brand" : "text-ink-muted hover:text-ink"
                            }`}
                          >
                            {tail}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <button
                      type="button"
                      className="flex h-8 cursor-pointer items-center gap-1.5 pl-19 text-body text-ink-muted transition-colors duration-150 hover:text-ink"
                    >
                      <AddCircleIcon className="size-5" />
                      Add Aircraft
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <NavItem icon={<ProfileIcon className="size-4" />} label="Profile" />
        <NavItem icon={<SettingsIcon className="size-4" />} label="Settings" />
      </nav>

      {/* icons top-align with the name line (Figma), not the block center */}
      <div className="mt-auto flex items-start justify-between px-8.5 pb-8.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-body">{currentUser.name}</span>
          <span className="text-caption text-ink-muted">{currentUser.email}</span>
        </div>
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            aria-label="Help"
            className="cursor-pointer text-ink-muted transition-colors duration-150 hover:text-ink"
          >
            <HelpIcon className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Log out"
            onClick={() => setSignOutOpen(true)}
            className="cursor-pointer text-ink-muted transition-colors duration-150 hover:text-ink"
          >
            <LogoutIcon className="size-4" />
          </button>
        </div>
      </div>

      <Modal open={signOutOpen} onClose={() => setSignOutOpen(false)} title="Sign Out">
        <p className="mt-6 text-body leading-5.5 text-ink-muted">
          You&apos;ll be signed out of Maggneto on this device.
        </p>
        <div className="mt-11 flex items-center gap-3.5">
          <Button fullWidth onClick={() => setSignOutOpen(false)}>
            Sign Out
          </Button>
          <Button variant="outline" fullWidth onClick={() => setSignOutOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </aside>
  );
}
