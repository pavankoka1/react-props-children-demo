"use client";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useLayoutEffect, useRef } from "react";

export type RenderSpotlightRole = "parent" | "child" | "memo" | "leaf";

interface RenderSpotlightProps {
  readonly role: RenderSpotlightRole;
  readonly className?: string;
  readonly children: React.ReactNode;
  /** Short label for the pulse chip (e.g. Parent, Child, Inner) */
  readonly label: string;
  /** When false, no pulse (structure unchanged). */
  readonly enabled?: boolean;
}

/** Refined chips — zinc base + role dot (readable, calm) */
const ROLE_STYLES: Record<
  RenderSpotlightRole,
  { chip: string; dot: string }
> = {
  parent: {
    chip: "border border-zinc-600/50 bg-zinc-900/70 text-zinc-300",
    dot: "bg-emerald-400/90",
  },
  child: {
    chip: "border border-zinc-600/50 bg-zinc-900/70 text-zinc-300",
    dot: "bg-sky-400/90",
  },
  memo: {
    chip: "border border-zinc-600/50 bg-zinc-900/70 text-zinc-300",
    dot: "bg-violet-400/90",
  },
  leaf: {
    chip: "border border-zinc-600/50 bg-zinc-900/70 text-zinc-300",
    dot: "bg-rose-400/90",
  },
};

/**
 * On every commit, fires a one-shot spotlight animation so you can *see*
 * which boundary re-rendered — same idea as react-rerender’s FlashingElement,
 * with role-colored pulses and a small “render” chip.
 */
export function RenderSpotlight({
  role,
  className = "",
  children,
  label,
  enabled = true,
}: Readonly<RenderSpotlightProps>) {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const styles = ROLE_STYLES[role];

  useLayoutEffect(() => {
    if (!enabled || reducedMotion) return;
    const el = rootRef.current;
    if (!el) return;
    const anim = `render-pulse-${role}`;
    el.classList.remove(anim);
    void el.offsetWidth;
    el.classList.add(anim);
    const t = window.setTimeout(() => {
      el.classList.remove(anim);
    }, 500);
    return () => window.clearTimeout(t);
  });

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden rounded-[inherit] ${className}`}
    >
      {enabled ? (
        <span
          className={`pointer-events-none absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${styles.chip}`}
          aria-hidden
        >
          <span
            className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot} ${reducedMotion ? "" : "animate-render-dot-pop"}`}
          />
          {label}
        </span>
      ) : null}
      {children}
    </div>
  );
}
