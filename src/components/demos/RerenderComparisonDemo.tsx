"use client";

import {
  RenderSpotlight,
  type RenderSpotlightRole,
} from "@/components/RenderSpotlight/RenderSpotlight";
import { motion } from "framer-motion";
import { MousePointerClick, Sparkles } from "lucide-react";
import React, { createContext, useContext, useRef, useState } from "react";

const SpotlightContext = createContext(true);

function useSpotlightEnabled() {
  return useContext(SpotlightContext);
}

/** Refined controls: readable contrast, subtle depth — primary = brand, secondary = zinc + hint */
const btnBase =
  "inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--demo-surface)]";

const btnParent = `${btnBase} min-w-[13rem] border border-white/10 bg-gradient-to-b from-indigo-500/95 to-violet-800/95 text-white shadow-[0_8px_32px_-12px_rgba(79,70,229,0.55)] hover:from-indigo-400/95 hover:to-violet-700/95 focus-visible:ring-indigo-400/50`;

const btnChild = `${btnBase} border border-zinc-600/60 bg-zinc-900/70 text-zinc-100 shadow-sm hover:border-slate-500/70 hover:bg-zinc-800/80 focus-visible:ring-slate-500/40`;

const btnMemo = `${btnBase} border border-zinc-600/60 bg-zinc-900/70 text-zinc-100 shadow-sm hover:border-violet-500/35 hover:bg-violet-950/50 focus-visible:ring-violet-500/35`;

const inset = "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.035)]";

/** Neutral shells — outer = soft capsule, nested = still clearly rounded (not blunt vs parent). */
const demoFrame = `border border-[color:var(--demo-border)] ring-1 ring-[color:var(--demo-ring)]`;
const rDemoOuter = "rounded-[2.25rem]";
const rDemoInner = "rounded-[1.75rem]";

const panelParent = `${rDemoOuter} ${demoFrame} bg-[var(--demo-surface)] ${inset} p-6 pt-14 md:p-8 md:pt-[3.35rem]`;

const panelChild = `mt-4 ${rDemoInner} ${demoFrame} bg-[var(--demo-surface-inner)] ${inset} p-5 pt-12`;

const panelMemo = `mt-4 ${rDemoInner} ${demoFrame} bg-[var(--demo-surface-inner)] ${inset} p-5 pt-12`;

const panelLeaf = `mt-4 ${rDemoInner} ${demoFrame} bg-[var(--demo-surface-inner)] ${inset} p-4 pt-11`;

const code =
  "rounded-lg border border-zinc-700/50 bg-zinc-900/50 px-2 py-0.5 font-mono text-[11px] text-zinc-400";

function SomeComponent({ label }: { readonly label: string }) {
  const showSpotlight = useSpotlightEnabled();
  const renderCount = useRef(0);
  renderCount.current += 1;
  if (typeof globalThis.window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log(`${label} rendered (count: ${renderCount.current})`);
  }

  return (
    <RenderSpotlight
      role="leaf"
      label="Inner"
      enabled={showSpotlight}
      className={panelLeaf}
    >
      <strong className="text-[var(--text-primary)]">{label}</strong>
      <div className="mt-1 text-sm text-[var(--text-secondary)]">
        Render count:{" "}
        <span className="font-mono font-semibold text-rose-300/90">{renderCount.current}</span>
      </div>
    </RenderSpotlight>
  );
}

function ChildWithProps({
  ComponentToRender,
}: {
  readonly ComponentToRender: React.ComponentType<{ label: string }>;
}) {
  const showSpotlight = useSpotlightEnabled();
  const [childState, setChildState] = useState(0);
  const renderCount = useRef(0);
  renderCount.current += 1;
  if (typeof globalThis.window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("ChildWithProps (No memo) rendered");
  }

  return (
    <RenderSpotlight
      role="child"
      label="Child"
      enabled={showSpotlight}
      className={panelChild}
    >
      <h3 className="text-base font-semibold tracking-tight text-zinc-200">
        Child receives a component prop
      </h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Child render count:{" "}
        <span className="font-mono font-semibold text-sky-300/90">{renderCount.current}</span>
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        React passes <code className={code}>SomeComponent</code> as{" "}
        <code className={code}>ComponentToRender</code>.
      </p>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        <MousePointerClick className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
        Clickable — child
      </p>
      <button
        type="button"
        onClick={() => setChildState((s) => s + 1)}
        className={`${btnChild} mt-1.5 w-full sm:w-auto`}
        aria-label={`Click to update child component state. Current value: ${childState}.`}
        title="Click to update child state"
      >
        Update child state → {childState}
      </button>
      <ComponentToRender label="Component (via props)" />
    </RenderSpotlight>
  );
}

function ParentWithProps() {
  const showSpotlight = useSpotlightEnabled();
  const [parentState, setParentState] = useState(0);
  const renderCount = useRef(0);
  renderCount.current += 1;
  if (typeof globalThis.window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("ParentWithProps rendered");
  }

  return (
    <RenderSpotlight
      role="parent"
      label="Parent"
      enabled={showSpotlight}
      className={panelParent}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-2xl border border-zinc-700/60 bg-zinc-900/50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
          Scenario 1
        </span>
        <span className="rounded-2xl border border-indigo-500/25 bg-indigo-950/40 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-indigo-200/90">
          Prop
        </span>
      </div>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--text-primary)] md:text-2xl">
        Component as prop
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">
        Child creates the element on each of its renders — Inner flashes on parent{" "}
        <em className="text-rose-400/80 not-italic">and</em> child updates.
      </p>
      <p className="mt-4 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        <MousePointerClick className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
        Clickable — parent
      </p>
      <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          Parent renders:{" "}
          <span className="font-mono font-semibold text-emerald-400/90">{renderCount.current}</span>
        </p>
        <button
          type="button"
          onClick={() => setParentState((s) => s + 1)}
          className={`${btnParent} w-full sm:w-auto`}
          aria-label={`Click to update parent state. Current value: ${parentState}.`}
          title="Click to update parent state"
        >
          Update parent state → {parentState}
        </button>
      </div>
      <ChildWithProps ComponentToRender={SomeComponent} />
    </RenderSpotlight>
  );
}

function ChildWithChildren({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const showSpotlight = useSpotlightEnabled();
  const [childState, setChildState] = useState(0);
  const renderCount = useRef(0);
  renderCount.current += 1;
  if (typeof globalThis.window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("ChildWithChildren rendered");
  }

  return (
    <RenderSpotlight
      role="child"
      label="Child"
      enabled={showSpotlight}
      className={panelChild}
    >
      <h3 className="text-base font-semibold tracking-tight text-zinc-200">
        Child receives children (elements)
      </h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Child render count:{" "}
        <span className="font-mono font-semibold text-sky-300/90">{renderCount.current}</span>
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        React passes the tree as the <code className={code}>children</code> prop.
      </p>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        <MousePointerClick className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
        Clickable — child
      </p>
      <button
        type="button"
        onClick={() => setChildState((s) => s + 1)}
        className={`${btnChild} mt-1.5 w-full sm:w-auto`}
        aria-label={`Click to update child component state. Current value: ${childState}.`}
        title="Click to update child state"
      >
        Update child state → {childState}
      </button>
      {children}
    </RenderSpotlight>
  );
}

function ParentWithChildren() {
  const showSpotlight = useSpotlightEnabled();
  const [parentState, setParentState] = useState(0);
  const renderCount = useRef(0);
  renderCount.current += 1;
  if (typeof globalThis.window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("ParentWithChildren rendered");
  }

  return (
    <RenderSpotlight
      role="parent"
      label="Parent"
      enabled={showSpotlight}
      className={panelParent}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-2xl border border-zinc-700/60 bg-zinc-900/50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
          Scenario 2
        </span>
        <span className="rounded-2xl border border-sky-500/22 bg-sky-950/35 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-sky-200/85">
          children
        </span>
      </div>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--text-primary)] md:text-2xl">
        Ownership via children
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">
        Parent owns the element — try updating <strong className="font-medium text-zinc-300">child state</strong>{" "}
        only: Inner often stays quiet; parent updates still refresh it.
      </p>
      <p className="mt-4 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        <MousePointerClick className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
        Clickable — parent
      </p>
      <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          Parent renders:{" "}
          <span className="font-mono font-semibold text-emerald-400/90">{renderCount.current}</span>
        </p>
        <button
          type="button"
          onClick={() => setParentState((s) => s + 1)}
          className={`${btnParent} w-full sm:w-auto`}
          aria-label={`Click to update parent state. Current value: ${parentState}.`}
          title="Click to update parent state"
        >
          Update parent state → {parentState}
        </button>
      </div>
      <ChildWithChildren>
        <SomeComponent label="Component (via children)" />
      </ChildWithChildren>
    </RenderSpotlight>
  );
}

const ChildWithMemoProps = React.memo(function ChildWithMemoProps({
  ComponentToRender,
}: {
  readonly ComponentToRender: React.ComponentType<{ label: string }>;
}) {
  const showSpotlight = useSpotlightEnabled();
  const [childState, setChildState] = useState(0);
  const renderCount = useRef(0);
  renderCount.current += 1;
  if (typeof globalThis.window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("ChildWithMemoProps (React.memo) rendered");
  }

  return (
    <RenderSpotlight
      role="memo"
      label="Child (memo)"
      enabled={showSpotlight}
      className={panelMemo}
    >
      <h3 className="text-base font-semibold tracking-tight text-zinc-200">
        Same as (1), but Child is wrapped in React.memo
      </h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Child render count:{" "}
        <span className="font-mono font-semibold text-violet-300/90">{renderCount.current}</span>
      </p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        Props shallow-compared; stable <code className={code}>ComponentToRender</code> → parent-only
        updates can bail out.
      </p>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        <MousePointerClick className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
        Clickable — child (memo)
      </p>
      <button
        type="button"
        onClick={() => setChildState((s) => s + 1)}
        className={`${btnMemo} mt-1.5 w-full sm:w-auto`}
        aria-label={`Click to update memo-wrapped child state. Current value: ${childState}.`}
        title="Click to update child state"
      >
        Update child state → {childState}
      </button>
      <ComponentToRender label="Component (via props + memo)" />
    </RenderSpotlight>
  );
});

function ParentWithMemoProps() {
  const showSpotlight = useSpotlightEnabled();
  const [parentState, setParentState] = useState(0);
  const renderCount = useRef(0);
  renderCount.current += 1;
  if (typeof globalThis.window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("ParentWithMemoProps rendered");
  }

  return (
    <RenderSpotlight
      role="parent"
      label="Parent"
      enabled={showSpotlight}
      className={panelParent}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-2xl border border-zinc-700/60 bg-zinc-900/50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
          Scenario 3
        </span>
        <span className="rounded-2xl border border-violet-500/25 bg-violet-950/40 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-violet-200/85">
          memo
        </span>
      </div>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--text-primary)] md:text-2xl">
        Explicit memo gate
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">
        Props shallow-compared first — stable{" "}
        <code className={code}>ComponentToRender</code> → parent-only updates skip memo Child and
        Inner.
      </p>
      <p className="mt-4 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        <MousePointerClick className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
        Clickable — parent
      </p>
      <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          Parent renders:{" "}
          <span className="font-mono font-semibold text-emerald-400/90">{renderCount.current}</span>
        </p>
        <button
          type="button"
          onClick={() => setParentState((s) => s + 1)}
          className={`${btnParent} w-full sm:w-auto`}
          aria-label={`Click to update parent state. Current value: ${parentState}.`}
          title="Click to update parent state"
        >
          Update parent state → {parentState}
        </button>
      </div>
      <ChildWithMemoProps ComponentToRender={SomeComponent} />
    </RenderSpotlight>
  );
}

const ROLE_LEGEND: {
  role: RenderSpotlightRole;
  label: string;
  className: string;
}[] = [
  {
    role: "parent",
    label: "Parent · emerald",
    className:
      "rounded-2xl border border-zinc-700/50 bg-zinc-900/40 text-zinc-300",
  },
  {
    role: "child",
    label: "Child · sky",
    className: "rounded-2xl border border-zinc-700/50 bg-zinc-900/40 text-zinc-300",
  },
  {
    role: "memo",
    label: "Memo · violet",
    className: "rounded-2xl border border-zinc-700/50 bg-zinc-900/40 text-zinc-300",
  },
  {
    role: "leaf",
    label: "Inner · rose",
    className: "rounded-2xl border border-zinc-700/50 bg-zinc-900/40 text-zinc-300",
  },
];

export function RerenderComparisonDemo() {
  const [spotlightOn, setSpotlightOn] = useState(true);

  return (
    <SpotlightContext.Provider value={spotlightOn}>
      <div className="mx-auto max-w-4xl space-y-10 px-6 py-6 md:px-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`relative overflow-hidden ${rDemoOuter} border border-[color:var(--demo-border)] bg-[var(--demo-surface)] p-6 ring-1 ring-[color:var(--demo-ring)] md:p-7`}
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-600/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-600/10 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700/60 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-zinc-400">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400/80" aria-hidden />
                Render spotlight
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={spotlightOn}
                  onChange={(e) => setSpotlightOn(e.target.checked)}
                  aria-label="Toggle flash animation when components re-render"
                  className="size-4 cursor-pointer rounded border-[color:var(--demo-border)] bg-[var(--demo-surface-inner)] accent-indigo-500 focus:ring-2 focus:ring-indigo-500/35 focus:ring-offset-2 focus:ring-offset-[var(--demo-surface)]"
                />
                <span>
                  Flash on re-render{" "}
                  <span className="text-zinc-500">(click to toggle)</span>
                </span>
              </label>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
              Each boundary pulses once per render —{" "}
              <span className="text-emerald-400/85">emerald</span> (parent),{" "}
              <span className="text-sky-400/85">sky</span> (child),{" "}
              <span className="text-violet-400/85">violet</span> (memo),{" "}
              <span className="text-rose-400/85">rose</span> (inner). Scenario 3 often skips violet
              and rose on parent-only updates.
            </p>
            <ul className="flex flex-wrap gap-2">
              {ROLE_LEGEND.map(({ role, label, className }) => (
                <li key={role} className={`px-2.5 py-1 text-[11px] font-medium ${className}`}>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        <div className={`space-y-3 ${rDemoInner} border border-dashed border-[color:var(--demo-border)] bg-[var(--demo-surface-inner)] px-4 py-4 text-center`}>
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-300">
            <MousePointerClick className="h-4 w-4 shrink-0 text-indigo-400/90" aria-hidden />
            All demo controls below are clickable
          </p>
          <p className="text-xs leading-relaxed text-zinc-500">
            Press the <span className="text-zinc-400">indigo buttons</span> for parent state and the{" "}
            <span className="text-zinc-400">zinc buttons</span> for child state. Hover for a short
            hint; your cursor shows a pointer on every control.
          </p>
        </div>

        <p className="text-center text-sm text-[var(--text-muted)]">
          Open the console (F12).{" "}
          <span className="font-mono text-zinc-500">1</span> prop ·{" "}
          <span className="font-mono text-zinc-500">2</span>{" "}
          <code className="rounded-lg border border-zinc-700/60 bg-zinc-900/50 px-1.5 py-0.5 font-mono text-xs text-zinc-400">
            children
          </code>{" "}
          · <span className="font-mono text-zinc-500">3</span>{" "}
          <code className="rounded-lg border border-zinc-700/60 bg-zinc-900/50 px-1.5 py-0.5 font-mono text-xs text-zinc-400">
            memo
          </code>
          .
        </p>

        <div className="space-y-10">
          <ParentWithProps />
          <ParentWithChildren />
          <ParentWithMemoProps />
        </div>
      </div>
    </SpotlightContext.Provider>
  );
}
