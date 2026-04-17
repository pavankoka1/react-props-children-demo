import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { NextButton } from "@/components/NextButton/NextButton";
import {
  AUTHOR_LOCATION,
  AUTHOR_NAME,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
} from "@/lib/seo-config";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Elements, ownership & memo",
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/guide" },
  openGraph: {
    title: `Elements, ownership & memo | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    url: "/guide",
    type: "article",
    publishedTime: "2026-04-01T00:00:00.000Z",
    authors: [AUTHOR_NAME],
  },
};

const pattern1 = `<Child ComponentToRender={SomeComponent} />
// inside Child:
return <ComponentToRender />`;

const pattern2 = `<Child>
  <SomeComponent />
</Child>`;

const pattern3 = `const MemoChild = React.memo(Child);

<MemoChild ComponentToRender={SomeComponent} />`;

export default function GuidePage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-10 md:px-8">
      <header className="mb-12 border-b border-[var(--bg-tertiary)] pb-10">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          {AUTHOR_NAME} · {AUTHOR_LOCATION}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
          You&apos;re not passing a component. You&apos;re passing an element.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[var(--text-secondary)]">
          React gives you two ways to hand something renderable down to a child
          component. The code looks nearly identical. The render behavior is not.
        </p>
        <p className="mt-4">
          <Link
            href="/demo"
            className="text-[#67e8f9] underline-offset-2 hover:underline"
          >
            Open the live demo
          </Link>{" "}
          — use the Parent / Child buttons and keep the console open. The{" "}
          <strong className="text-[var(--text-primary)]">spotlight colors</strong>{" "}
          (emerald, sky, violet, rose) map to Parent, Child, memo Child, and Inner.
        </p>
      </header>

      <section className="mb-14">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          Pattern 1 — Component as prop
        </h2>
        <CodeBlock code={pattern1} language="tsx" className="mt-5" />
        <p className="mt-5 leading-relaxed text-[var(--text-secondary)]">
          <code className="font-mono text-sm">Child</code> receives a function
          reference. Each time <code className="font-mono text-sm">Child</code>{" "}
          renders, it calls that function — which means it{" "}
          <strong className="text-[var(--text-primary)]">
            creates a new React element
          </strong>{" "}
          on every render.
        </p>
        <p className="mt-4 leading-relaxed text-[var(--text-secondary)]">
          <strong className="text-[var(--text-primary)]">Consequence:</strong>{" "}
          <code className="font-mono text-sm">SomeComponent</code> re-renders
          whenever <code className="font-mono text-sm">Child</code> re-renders.
          A parent state update triggers that, and a child state update triggers
          it too. <code className="font-mono text-sm">Child</code> is the
          element&apos;s author — it produces a new element whenever it runs.
        </p>
      </section>

      <section className="mb-14">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          Pattern 2 — Component as children
        </h2>
        <CodeBlock code={pattern2} language="tsx" className="mt-5" />
        <p className="mt-5 leading-relaxed text-[var(--text-secondary)]">
          The <strong className="text-[var(--text-primary)]">parent&apos;s</strong>{" "}
          JSX evaluates <code className="font-mono text-sm">&lt;SomeComponent /&gt;</code>{" "}
          and produces a React element — a plain object,{" "}
          <code className="font-mono text-sm">&#123; type, props &#125;</code>. That
          object is passed to <code className="font-mono text-sm">Child</code> as{" "}
          <code className="font-mono text-sm">props.children</code>.{" "}
          <code className="font-mono text-sm">Child</code> renders it with{" "}
          <code className="font-mono text-sm">&#123;children&#125;</code>.
        </p>
        <p className="mt-4 leading-relaxed text-[var(--text-secondary)]">
          <code className="font-mono text-sm">Child</code> never creates that
          element; it forwards what it received.
        </p>
        <p className="mt-4 leading-relaxed text-[var(--text-secondary)]">
          <strong className="text-[var(--text-primary)]">Consequence:</strong>{" "}
          When <code className="font-mono text-sm">Child</code>&apos;s own state
          updates, React re-runs <code className="font-mono text-sm">Child</code> — but{" "}
          <code className="font-mono text-sm">props.children</code> is still the{" "}
          <strong className="text-[var(--text-primary)]">
            same object reference
          </strong>{" "}
          the parent produced last time (the parent did not re-render). React can
          bail out of updating <code className="font-mono text-sm">SomeComponent</code>
          . Update the <strong className="text-[var(--text-primary)]">parent</strong>
          &apos;s state, and the parent re-renders, creates a{" "}
          <strong className="text-[var(--text-primary)]">new</strong> element for{" "}
          <code className="font-mono text-sm">&lt;SomeComponent /&gt;</code>, passes
          it down — and <code className="font-mono text-sm">SomeComponent</code> runs
          again.
        </p>
        <blockquote className="mt-6 border-l-2 border-[#667eea]/60 pl-4 text-[var(--text-secondary)]">
          <strong className="text-[var(--text-primary)]">
            This isn&apos;t magic.
          </strong>{" "}
          <code className="font-mono text-sm">children</code> is not a special React
          channel — it&apos;s a prop. The boundary is about{" "}
          <strong className="text-[var(--text-primary)]">who owns the element</strong>
          , not about <code className="font-mono text-sm">children</code> being
          blessed. If the parent re-renders, expect the inner UI to reconcile again.
        </blockquote>
      </section>

      <section className="mb-14">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          Pattern 3 — <code className="font-mono text-lg">React.memo</code> on{" "}
          <code className="font-mono text-lg">Child</code>
        </h2>
        <CodeBlock code={pattern3} language="tsx" className="mt-5" />
        <p className="mt-5 leading-relaxed text-[var(--text-secondary)]">
          Same as Pattern 1, with an explicit bailout gate. Before React calls{" "}
          <code className="font-mono text-sm">Child</code>, it shallow-compares
          incoming props to the previous render — one{" "}
          <code className="font-mono text-sm">Object.is</code>-style check per prop
          key.
        </p>
        <p className="mt-4 leading-relaxed text-[var(--text-secondary)]">
          <code className="font-mono text-sm">ComponentToRender</code> is a
          module-level reference. It is the same function object across renders. When
          the parent updates <strong className="text-[var(--text-primary)]">
            unrelated
          </strong>{" "}
          state, <code className="font-mono text-sm">MemoChild</code> sees unchanged
          props and{" "}
          <strong className="text-[var(--text-primary)]">
            skips the render entirely
          </strong>
          — <code className="font-mono text-sm">Child</code> does not run,{" "}
          <code className="font-mono text-sm">SomeComponent</code> does not run.
        </p>
        <p className="mt-4 leading-relaxed text-[var(--text-secondary)]">
          That is the explicit version of what Pattern 2 can achieve through{" "}
          <strong className="text-[var(--text-primary)]">ownership</strong>. Pattern
          2 moves <em>where</em> the element is created. Pattern 3 adds a prop-equality
          gate <em>before</em> <code className="font-mono text-sm">Child</code> runs at
          all.
        </p>
      </section>

      <section className="mb-12 rounded-xl border border-[var(--bg-tertiary)] bg-[var(--bg-secondary)]/50 p-6 md:p-8">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] md:text-xl">
          The unifying model
        </h2>
        <p className="mt-3 text-[var(--text-secondary)]">
          <strong className="text-[var(--text-primary)]">
            Who creates the element determines who re-renders it
          </strong>
          — modulo parent updates and memo.
        </p>
        <div className="mt-6 overflow-x-auto text-sm">
          <table className="w-full min-w-[600px] text-left text-[var(--text-secondary)]">
            <thead className="border-b border-[var(--bg-tertiary)] text-[var(--text-muted)]">
              <tr>
                <th className="py-2.5 pr-3 font-medium">Pattern</th>
                <th className="py-2.5 pr-3 font-medium">Element created by</th>
                <th className="py-2.5 pr-3 font-medium">Natural boundary</th>
                <th className="py-2.5 font-medium">Explicit boundary</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--bg-tertiary)]/70">
                <td className="py-3 font-medium text-[var(--text-primary)]">Prop</td>
                <td className="py-3">Child</td>
                <td className="py-3">None</td>
                <td className="py-3">
                  Add <code className="font-mono text-xs">React.memo</code>
                </td>
              </tr>
              <tr className="border-b border-[var(--bg-tertiary)]/70">
                <td className="py-3 font-medium text-[var(--text-primary)]">
                  Children
                </td>
                <td className="py-3">Parent</td>
                <td className="py-3">Yes — ownership</td>
                <td className="py-3">Often not needed</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-[var(--text-primary)]">
                  Memo + prop
                </td>
                <td className="py-3">Child</td>
                <td className="py-3">None</td>
                <td className="py-3">
                  <code className="font-mono text-xs">React.memo</code> gate
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-[var(--text-muted)]">
          Open the console before hitting the buttons. Render logs confirm what the
          spotlight shows — mechanical proof if the animation isn&apos;t enough.
        </p>
      </section>

      <div className="flex flex-wrap gap-4">
        <NextButton href="/demo" label="Live demo" />
        <Link
          href="/"
          className="inline-flex items-center rounded-lg border border-[var(--bg-tertiary)] px-5 py-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
        >
          Overview
        </Link>
      </div>
    </article>
  );
}
