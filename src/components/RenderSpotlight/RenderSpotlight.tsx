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

/** Neutral chrome (react-rerender panels); role = dot hue only */
const ROLE_STYLES: Record<
  RenderSpotlightRole,
  { chip: string; dot: string }
> = {
  parent: {
    chip: "border-[var(--bg-tertiary)] bg-[var(--bg-primary)] text-[var(--text-muted)]",
    dot: "bg-emerald-400",
  },
  child: {
    chip: "border-[var(--bg-tertiary)] bg-[var(--bg-primary)] text-[var(--text-muted)]",
    dot: "bg-sky-400",
  },
  memo: {
    chip: "border-[var(--bg-tertiary)] bg-[var(--bg-primary)] text-[var(--text-muted)]",
    dot: "bg-violet-400",
  },
  leaf: {
    chip: "border-[var(--bg-tertiary)] bg-[var(--bg-primary)] text-[var(--text-muted)]",
    dot: "bg-rose-400",
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
          className={`pointer-events-none absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${styles.chip}`}
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
