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
    <div className="pb-12 pt-8">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
          Live demo
        </h1>
        <p className="mt-2 max-w-2xl leading-relaxed text-[var(--text-secondary)]">
          Same buttons everywhere — what changes is{" "}
          <strong className="text-[var(--text-primary)]">who creates the React
          element</strong>: Child (prop), Parent (children), or Child behind a{" "}
          <code className="font-mono text-sm">memo</code> gate. Read the{" "}
          <a
            href="/guide"
            className="text-[#67e8f9] underline-offset-2 hover:underline"
          >
            guide
          </a>{" "}
          for the full model.
        </p>
      </div>
      <RerenderComparisonDemo />
      <div className="mx-auto mt-8 flex max-w-3xl justify-end px-6 md:px-8">
        <NextButton href="/guide" label="How React sees each case" />
      </div>
    </div>
  );
}
