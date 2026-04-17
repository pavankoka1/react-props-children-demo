"use client";

import {
  RenderSpotlight,
  type RenderSpotlightRole,
} from "@/components/RenderSpotlight/RenderSpotlight";
import { motion } from "framer-motion";
import React, { createContext, useContext, useRef, useState } from "react";

const SpotlightContext = createContext(true);

function useSpotlightEnabled() {
  return useContext(SpotlightContext);
}

/** Matches react-rerender problem/solution demo chrome */
const btn =
  "rounded-lg border border-[var(--bg-tertiary)] px-3 py-1.5 text-sm text-[var(--text-primary)] transition hover:bg-[var(--bg-tertiary)]";

const panelParent =
  "rounded-xl border border-[var(--bg-tertiary)] bg-[var(--bg-secondary)] p-6 pt-14 md:p-8 md:pt-[3.25rem]";

const panelChild =
  "mt-4 rounded-lg border border-[var(--bg-tertiary)] bg-[var(--bg-primary)] p-5 pt-12";

const panelLeaf =
  "mt-4 rounded-lg border border-[var(--bg-tertiary)] bg-[var(--bg-primary)] p-4 pt-11";

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
        <span className="font-mono font-semibold text-[var(--info)]">
          {renderCount.current}
        </span>
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
      <h3 className="text-base font-semibold text-[var(--text-primary)]">
        Child receives a component prop
      </h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Child render count:{" "}
        <span className="font-mono font-semibold text-[var(--info)]">
          {renderCount.current}
        </span>
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        React passes <code className="font-mono text-xs">SomeComponent</code> as{" "}
        <code className="font-mono text-xs">ComponentToRender</code>.
      </p>
      <button
        type="button"
        onClick={() => setChildState((s) => s + 1)}
        className={`${btn} mt-3`}
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
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
        1. Pass component to Child as a prop
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">
        Child creates the element on each of its renders — Inner flashes on parent{" "}
        <em>and</em> child updates.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          Parent renders:{" "}
          <span className="font-mono font-semibold text-[var(--info)]">
            {renderCount.current}
          </span>
        </p>
        <button
          type="button"
          onClick={() => setParentState((s) => s + 1)}
          className={btn}
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
      <h3 className="text-base font-semibold text-[var(--text-primary)]">
        Child receives children (elements)
      </h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Child render count:{" "}
        <span className="font-mono font-semibold text-[var(--info)]">
          {renderCount.current}
        </span>
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        React passes the tree as the{" "}
        <code className="font-mono text-xs">children</code> prop.
      </p>
      <button
        type="button"
        onClick={() => setChildState((s) => s + 1)}
        className={`${btn} mt-3`}
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
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
        2. Pass component to Child as children
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">
        Parent owns the element — try <strong>Update child state</strong> only: Inner
        often stays quiet; parent updates still refresh it.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          Parent renders:{" "}
          <span className="font-mono font-semibold text-[var(--info)]">
            {renderCount.current}
          </span>
        </p>
        <button
          type="button"
          onClick={() => setParentState((s) => s + 1)}
          className={btn}
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
      className={panelChild}
    >
      <h3 className="text-base font-semibold text-[var(--text-primary)]">
        Same as (1), but Child is wrapped in React.memo
      </h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Child render count:{" "}
        <span className="font-mono font-semibold text-[var(--info)]">
          {renderCount.current}
        </span>
      </p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        Props shallow-compared; stable{" "}
        <code className="font-mono text-xs">ComponentToRender</code> → parent-only
        updates can bail out.
      </p>
      <button
        type="button"
        onClick={() => setChildState((s) => s + 1)}
        className={`${btn} mt-3`}
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
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
        3. Pass as prop + wrap Child with React.memo
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">
        Props shallow-compared first — stable{" "}
        <code className="font-mono text-[11px]">ComponentToRender</code> → parent-only
        updates skip memo Child and Inner.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          Parent renders:{" "}
          <span className="font-mono font-semibold text-[var(--info)]">
            {renderCount.current}
          </span>
        </p>
        <button
          type="button"
          onClick={() => setParentState((s) => s + 1)}
          className={btn}
        >
          Update parent state → {parentState}
        </button>
      </div>
      <ChildWithMemoProps ComponentToRender={SomeComponent} />
    </RenderSpotlight>
  );
}

const ROLE_LEGEND: { role: RenderSpotlightRole; text: string }[] = [
  { role: "parent", text: "Parent — emerald" },
  { role: "child", text: "Child — sky" },
  { role: "memo", text: "Memo child — violet" },
  { role: "leaf", text: "Inner — rose" },
];

export function RerenderComparisonDemo() {
  const [spotlightOn, setSpotlightOn] = useState(true);

  return (
    <SpotlightContext.Provider value={spotlightOn}>
      <div className="mx-auto max-w-4xl space-y-8 px-6 py-6 md:px-8">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={spotlightOn}
                onChange={(e) => setSpotlightOn(e.target.checked)}
                className="rounded border-[var(--bg-tertiary)]"
              />
              Flash on re-render
            </label>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Each boundary flashes with a 500ms ease-in-out glow (same rhythm as a
            classic <code className="font-mono text-xs">flash-on-render</code>) —
            hue encodes role. Case 3 skips memo Child + Inner on parent-only
            updates.
          </p>
          <ul className="flex flex-wrap gap-2">
            {ROLE_LEGEND.map(({ role, text }) => (
              <li
                key={role}
                className="rounded border border-[var(--bg-tertiary)] bg-[var(--bg-secondary)] px-2.5 py-1 text-[11px] text-[var(--text-muted)]"
              >
                {text}
              </li>
            ))}
          </ul>
        </motion.section>

        <p className="text-center text-sm text-[var(--text-muted)]">
          Open the console (F12). Scenarios{" "}
          <span className="font-mono text-[var(--text-secondary)]">1</span> prop,{" "}
          <span className="font-mono text-[var(--text-secondary)]">2</span>{" "}
          <code className="font-mono text-xs">children</code>,{" "}
          <span className="font-mono text-[var(--text-secondary)]">3</span>{" "}
          <code className="font-mono text-xs">memo</code>.
        </p>

        <div className="space-y-8">
          <ParentWithProps />
          <ParentWithChildren />
          <ParentWithMemoProps />
        </div>
      </div>
    </SpotlightContext.Provider>
  );
}
