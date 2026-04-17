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

const ROLE_STYLES: Record<
  RenderSpotlightRole,
  { chip: string; dot: string; ring: string }
> = {
  parent: {
    chip: "border-emerald-500/20 bg-emerald-950/35 text-emerald-200/90",
    dot: "bg-emerald-400/90 shadow-[0_0_6px_rgba(52,211,153,0.35)]",
    ring: "ring-white/[0.06]",
  },
  child: {
    chip: "border-sky-500/20 bg-sky-950/40 text-sky-200/90",
    dot: "bg-sky-400/90 shadow-[0_0_6px_rgba(56,189,248,0.3)]",
    ring: "ring-white/[0.06]",
  },
  memo: {
    chip: "border-violet-500/25 bg-violet-950/45 text-violet-200/90",
    dot: "bg-violet-400/90 shadow-[0_0_6px_rgba(167,139,250,0.32)]",
    ring: "ring-white/[0.06]",
  },
  leaf: {
    chip: "border-rose-500/20 bg-rose-950/40 text-rose-200/90",
    dot: "bg-rose-400/90 shadow-[0_0_6px_rgba(251,113,133,0.3)]",
    ring: "ring-white/[0.06]",
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
    }, 720);
    return () => window.clearTimeout(t);
  });

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden rounded-[inherit] ring-1 ${styles.ring} ${className}`}
    >
      {enabled ? (
        <span
          className={`pointer-events-none absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${styles.chip}`}
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
