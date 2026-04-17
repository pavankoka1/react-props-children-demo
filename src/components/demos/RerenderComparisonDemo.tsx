"use client";

import {
  RenderSpotlight,
  type RenderSpotlightRole,
} from "@/components/RenderSpotlight/RenderSpotlight";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import React, { createContext, useContext, useRef, useState } from "react";

const SpotlightContext = createContext(true);

function useSpotlightEnabled() {
  return useContext(SpotlightContext);
}

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
      className="mt-4 rounded-xl border border-[var(--bg-tertiary)] border-l-[3px] border-l-rose-400/45 bg-[var(--bg-primary)]/40 p-4 !pt-11 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]"
    >
      <strong className="text-[var(--text-primary)]">{label}</strong>
      <br />
      <span className="text-sm text-[var(--text-secondary)]">Render count: </span>
      <span className="font-mono font-bold text-rose-300">
        {renderCount.current}
      </span>
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
      className="rounded-xl border border-[var(--bg-tertiary)] border-l-[3px] border-l-sky-400/45 bg-[var(--bg-secondary)]/90 p-5 !pt-12 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
        Child receives a component prop
      </h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Child render count:{" "}
        <strong className="text-sky-200">{renderCount.current}</strong>
      </p>
      <p className="text-sm text-[var(--text-muted)]">
        React passes <code className="font-mono text-xs">SomeComponent</code> as{" "}
        <code className="font-mono text-xs">ComponentToRender</code>.
      </p>
      <button
        type="button"
        onClick={() => setChildState((s) => s + 1)}
        className="mt-3 rounded-lg border border-sky-500/20 bg-sky-950/20 px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-sky-500/30 hover:bg-sky-950/35"
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
      className="rounded-2xl border border-[var(--bg-tertiary)] border-l-[3px] border-l-emerald-400/50 bg-[var(--bg-secondary)]/95 p-6 shadow-md md:p-8 !pt-14"
    >
      <h2 className="text-xl font-bold text-[var(--text-primary)]">
        1. Pass component to Child as a prop
      </h2>
      <p className="mt-2 max-w-prose text-sm italic leading-snug text-[var(--text-muted)]">
        Child creates the element each time it renders — Inner (rose) flashes on
        parent <em>and</em> child updates.
      </p>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        Parent render count: <strong className="text-emerald-200">{renderCount.current}</strong>
      </p>
      <button
        type="button"
        onClick={() => setParentState((s) => s + 1)}
        className="mt-3 rounded-lg border border-emerald-500/25 bg-emerald-950/25 px-4 py-2 text-sm font-medium text-emerald-100/95 transition hover:border-emerald-500/35 hover:bg-emerald-950/40"
      >
        Update parent state → {parentState}
      </button>
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
      className="rounded-xl border border-[var(--bg-tertiary)] border-l-[3px] border-l-sky-400/45 bg-[var(--bg-secondary)]/90 p-5 !pt-12 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
        Child receives children (elements)
      </h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Child render count:{" "}
        <strong className="text-sky-200">{renderCount.current}</strong>
      </p>
      <p className="text-sm text-[var(--text-muted)]">
        React passes the tree as the{" "}
        <code className="font-mono text-xs">children</code> prop.
      </p>
      <button
        type="button"
        onClick={() => setChildState((s) => s + 1)}
        className="mt-3 rounded-lg border border-sky-500/20 bg-sky-950/20 px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-sky-500/30 hover:bg-sky-950/35"
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
      className="rounded-2xl border border-[var(--bg-tertiary)] border-l-[3px] border-l-emerald-400/50 bg-[var(--bg-secondary)]/95 p-6 shadow-md md:p-8 !pt-14"
    >
      <h2 className="text-xl font-bold text-[var(--text-primary)]">
        2. Pass component to Child as children
      </h2>
      <p className="mt-2 max-w-prose text-sm italic leading-snug text-[var(--text-muted)]">
        Parent owns the element object — try{" "}
        <strong className="font-medium text-[var(--text-secondary)]">
          Update child state
        </strong>{" "}
        only: Inner often stays quiet; parent updates still refresh it.
      </p>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        Parent render count: <strong className="text-emerald-200">{renderCount.current}</strong>
      </p>
      <button
        type="button"
        onClick={() => setParentState((s) => s + 1)}
        className="mt-3 rounded-lg border border-emerald-500/25 bg-emerald-950/25 px-4 py-2 text-sm font-medium text-emerald-100/95 transition hover:border-emerald-500/35 hover:bg-emerald-950/40"
      >
        Update parent state → {parentState}
      </button>
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
      className="rounded-xl border border-[var(--bg-tertiary)] border-l-[3px] border-l-violet-400/50 bg-violet-950/20 p-5 !pt-12 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
        Same as (1), but Child is wrapped in React.memo
      </h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Child render count: <strong>{renderCount.current}</strong>
      </p>
      <p className="text-xs text-[var(--text-muted)]">
        Props shallow-compared; stable{" "}
        <code className="font-mono text-xs">ComponentToRender</code> → parent-only
        updates can bail out.
      </p>
      <button
        type="button"
        onClick={() => setChildState((s) => s + 1)}
        className="mt-3 rounded-lg border border-violet-500/25 bg-violet-950/30 px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-violet-500/35 hover:bg-violet-950/45"
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
      className="rounded-2xl border border-[var(--bg-tertiary)] border-l-[3px] border-l-emerald-400/50 bg-[var(--bg-secondary)]/95 p-6 shadow-md md:p-8 !pt-14"
    >
      <h2 className="text-xl font-bold text-[var(--text-primary)]">
        3. Pass as prop + wrap Child with React.memo
      </h2>
      <p className="mt-2 max-w-prose text-sm italic leading-snug text-[var(--text-muted)]">
        Props shallow-compared first — stable{" "}
        <code className="font-mono text-[11px] not-italic">ComponentToRender</code>
        → parent-only updates skip violet &amp; rose.
      </p>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        Parent render count: <strong className="text-emerald-200">{renderCount.current}</strong>
      </p>
      <button
        type="button"
        onClick={() => setParentState((s) => s + 1)}
        className="mt-3 rounded-lg border border-emerald-500/25 bg-emerald-950/25 px-4 py-2 text-sm font-medium text-emerald-100/95 transition hover:border-emerald-500/35 hover:bg-emerald-950/40"
      >
        Update parent state → {parentState}
      </button>
      <ChildWithMemoProps ComponentToRender={SomeComponent} />
    </RenderSpotlight>
  );
}

const ROLE_LEGEND: { role: RenderSpotlightRole; text: string }[] = [
  { role: "parent", text: "Parent — emerald pulse" },
  { role: "child", text: "Child — sky pulse" },
  { role: "memo", text: "Memo child — violet pulse" },
  { role: "leaf", text: "Inner — rose pulse" },
];

export function RerenderComparisonDemo() {
  const [spotlightOn, setSpotlightOn] = useState(true);

  return (
    <SpotlightContext.Provider value={spotlightOn}>
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-2xl border border-[var(--bg-tertiary)] bg-[var(--bg-secondary)]/70 p-5 shadow-sm backdrop-blur-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
              <Sparkles className="h-5 w-5 shrink-0 text-[var(--text-muted)]" aria-hidden />
              <span className="font-medium tracking-tight">Render spotlight</span>
            </div>
            <button
              type="button"
              onClick={() => setSpotlightOn((v) => !v)}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                spotlightOn
                  ? "border border-emerald-500/30 bg-emerald-950/30 text-[var(--text-primary)] hover:border-emerald-500/45 hover:bg-emerald-950/45"
                  : "border border-transparent bg-[var(--bg-tertiary)]/80 text-[var(--text-muted)] hover:border-[var(--bg-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
              aria-pressed={spotlightOn}
            >
              {spotlightOn ? (
                <Eye className="h-4 w-4 text-emerald-400/90" aria-hidden />
              ) : (
                <EyeOff className="h-4 w-4" aria-hidden />
              )}
              {spotlightOn ? "Spotlight on" : "Spotlight off"}
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            Each boundary flashes when it runs:{" "}
            <strong className="text-[var(--text-primary)]">Parent</strong> (emerald),{" "}
            <strong className="text-[var(--text-secondary)]">Child</strong> (sky),{" "}
            <strong className="text-[var(--text-secondary)]">memo Child</strong>{" "}
            (violet), <strong className="text-[var(--text-secondary)]">Inner</strong>{" "}
            (rose). Case 3 skips
            Child + Inner on parent-only updates — no violet or rose flash.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {ROLE_LEGEND.map(({ role, text }) => (
              <li
                key={role}
                className="rounded-md border border-[var(--bg-tertiary)]/80 bg-[var(--bg-primary)]/30 px-2.5 py-1 text-[11px] text-[var(--text-muted)]"
              >
                {text}
              </li>
            ))}
          </ul>
        </motion.div>

        <p className="text-center text-sm leading-relaxed text-[var(--text-secondary)]">
          Open the console (F12).{" "}
          <strong className="text-[var(--text-primary)]">1</strong> prop,{" "}
          <strong className="text-[var(--text-primary)]">2</strong>{" "}
          <code className="font-mono text-xs">children</code>,{" "}
          <strong className="text-[var(--text-primary)]">3</strong>{" "}
          <code className="font-mono text-xs">memo</code>. Click{" "}
          <strong className="text-[var(--text-primary)]">Update parent state</strong>
          : watch emerald → sky → rose in (1)/(2); in (3) memo Child often stays dark
          (no violet/rose). Click{" "}
          <strong className="text-[var(--text-primary)]">Update child state</strong>{" "}
          to pulse that subtree.
        </p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.05 },
            },
          }}
          className="space-y-12"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4 }}
          >
            <ParentWithProps />
          </motion.div>
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4 }}
          >
            <ParentWithChildren />
          </motion.div>
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4 }}
          >
            <ParentWithMemoProps />
          </motion.div>
        </motion.div>
      </div>
    </SpotlightContext.Provider>
  );
}
