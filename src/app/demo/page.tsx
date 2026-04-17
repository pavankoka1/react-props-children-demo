import { RerenderComparisonDemo } from "@/components/demos/RerenderComparisonDemo";
import { NextButton } from "@/components/NextButton/NextButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live demo — elements & spotlight",
  description:
    "Three panels: prop vs children vs memo on Child. Parent/Child buttons, RenderSpotlight (emerald, sky, violet, rose), console logs — who creates the element shows up in both.",
  alternates: { canonical: "/demo" },
  openGraph: {
    title: "Live demo — props, children & memo",
    description:
      "Watch which boundaries render: spotlight pulses + console. Ownership and memo gates made visible.",
    url: "/demo",
  },
};

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-14 pt-8 md:px-8">
      <header className="relative overflow-hidden rounded-[2.25rem] border border-[color:var(--demo-border)] bg-[var(--demo-surface)] px-6 py-8 ring-1 ring-[color:var(--demo-ring)] md:px-10 md:py-10">
        <div
          className="pointer-events-none absolute right-0 top-0 h-72 w-72 -translate-y-1/4 translate-x-1/4 rounded-full bg-indigo-600/12 blur-[90px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 -translate-x-1/4 translate-y-1/4 rounded-full bg-violet-600/10 blur-[80px]"
          aria-hidden
        />
        <p className="relative text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
          Interactive · three scenarios
        </p>
        <h1 className="relative mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
          Live demo
        </h1>
        <p className="relative mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
          Use the <strong className="font-medium text-zinc-300">clickable buttons</strong> in each
          panel to bump state — what changes is{" "}
          <strong className="font-medium text-zinc-200">who creates the React element</strong>: Child
          (prop), Parent (children), or Child behind a{" "}
          <code className="rounded-lg border border-zinc-700/60 bg-zinc-900/60 px-2 py-0.5 font-mono text-sm text-zinc-400">
            memo
          </code>{" "}
          gate. Read the{" "}
          <a
            href="/guide"
            className="font-medium text-indigo-400/90 underline decoration-zinc-600 underline-offset-[5px] transition hover:text-zinc-100 hover:decoration-indigo-400/50"
          >
            guide
          </a>{" "}
          for the full model.
        </p>
      </header>

      <div className="mt-10">
        <RerenderComparisonDemo />
      </div>

      <div className="mt-12 flex justify-end border-t border-zinc-800/60 pt-8">
        <NextButton href="/guide" label="How React sees each case" />
      </div>
    </div>
  );
}
