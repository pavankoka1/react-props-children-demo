"use client";

import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { NextButton } from "@/components/NextButton/NextButton";
import { motion } from "framer-motion";
import Link from "next/link";

const HERO_PATTERNS = `// Pattern 1 — component as prop
<Child ComponentToRender={SomeComponent} />

// Pattern 2 — component as children
<Child>
  <SomeComponent />
</Child>`;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#667eea]/20 via-[#764ba2]/10 to-[#4facfe]/20 p-8 md:p-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--glow-purple)_0%,_transparent_50%)] opacity-30" />
        <div className="relative">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
            React · elements & ownership · 2026
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl">
            You&apos;re not passing a component. You&apos;re passing an{" "}
            <span className="bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#4facfe] bg-clip-text text-transparent">
              element
            </span>
            .
          </h1>
          <p className="mb-6 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            React gives you two ways to hand something renderable down to a child
            component. The code looks nearly identical. The render behavior is
            not. Hit the buttons in the{" "}
            <Link href="/demo" className="text-[#67e8f9] underline-offset-2 hover:underline">
              demo
            </Link>
            , watch the emerald → sky → violet → rose spotlight pulses, and open
            the console — the difference stops being abstract.
          </p>
          <CodeBlock code={HERO_PATTERNS} language="tsx" showLineNumbers={false} />
          <div className="mt-8 flex flex-wrap gap-4">
            <NextButton href="/guide" label="Read the full guide" />
            <Link
              href="/demo"
              className="inline-flex items-center rounded-lg border border-[var(--bg-tertiary)] bg-[var(--bg-secondary)] px-5 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:border-[#667eea]/50 hover:bg-[var(--bg-tertiary)]"
            >
              Live demo
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-14"
      >
        <h2 className="text-xl font-semibold text-[var(--text-primary)] md:text-2xl">
          The unifying model
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-[var(--text-secondary)]">
          <strong className="text-[var(--text-primary)]">
            Who creates the element determines who re-renders it
          </strong>{" "}
          (subject to parent updates and memo gates). Pattern 2 often gives you a
          natural ownership boundary without reaching for{" "}
          <code className="font-mono text-sm">React.memo</code> first.
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--bg-tertiary)] bg-[var(--bg-secondary)]/70">
          <table className="w-full min-w-[640px] text-left text-sm text-[var(--text-secondary)]">
            <thead>
              <tr className="border-b border-[var(--bg-tertiary)] text-[var(--text-muted)]">
                <th className="px-4 py-3 font-medium">Pattern</th>
                <th className="px-4 py-3 font-medium">Element created by</th>
                <th className="px-4 py-3 font-medium">Natural boundary</th>
                <th className="px-4 py-3 font-medium">Explicit boundary</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--bg-tertiary)]/80">
                <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                  Prop
                </td>
                <td className="px-4 py-3">Child</td>
                <td className="px-4 py-3">None</td>
                <td className="px-4 py-3">
                  Add <code className="font-mono text-xs">React.memo</code>
                </td>
              </tr>
              <tr className="border-b border-[var(--bg-tertiary)]/80">
                <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                  Children
                </td>
                <td className="px-4 py-3">Parent</td>
                <td className="px-4 py-3">Yes — ownership</td>
                <td className="px-4 py-3">Often not needed</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                  Memo + prop
                </td>
                <td className="px-4 py-3">Child</td>
                <td className="px-4 py-3">None</td>
                <td className="px-4 py-3">
                  <code className="font-mono text-xs">React.memo</code> gate
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.section>

      <p className="mt-12 text-sm text-[var(--text-muted)]">
        Companion doc:{" "}
        <code className="rounded bg-[var(--bg-tertiary)] px-1.5 py-0.5 font-mono text-xs">
          docs/how-react-sees-each.md
        </code>
      </p>
    </div>
  );
}
