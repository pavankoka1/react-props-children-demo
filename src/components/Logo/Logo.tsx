"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";

const KokaParticleK = dynamic(
  () => import("./KokaParticleK").then((m) => m.KokaParticleK),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-10 w-10 shrink-0 rounded-xl border border-[color:var(--demo-border)] bg-[var(--demo-surface)] ring-1 ring-[color:var(--demo-ring)]"
        aria-hidden
      />
    ),
  }
);

const letterVariants = {
  hidden: { opacity: 0, x: -6, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 420,
      damping: 32,
      delay: 0.02 + i * 0.04,
    },
  }),
};

export function Logo({ isExpanded }: { readonly isExpanded: boolean }) {
  const [markHover, setMarkHover] = useState(false);

  return (
    <div className="flex min-w-0 items-center overflow-visible">
      {/* Fixed box + pointer target: micro-interaction on the mark only (brand motion best practice). */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center"
        onPointerEnter={() => setMarkHover(true)}
        onPointerLeave={() => setMarkHover(false)}
      >
        <KokaParticleK hovered={markHover} />
      </div>

      <motion.span
        className="flex min-w-0 overflow-hidden"
        initial={false}
        animate={{
          width: isExpanded ? "auto" : 0,
          marginLeft: isExpanded ? 8 : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{
          width: { type: "spring", stiffness: 380, damping: 38 },
          opacity: { duration: 0.2 },
          marginLeft: { type: "spring", stiffness: 380, damping: 38 },
        }}
      >
        {["o", "k", "a"].map((letter, i) => (
          <motion.span
            key={`${letter}-${i}`}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate={isExpanded ? "visible" : "hidden"}
            className="inline-block bg-gradient-to-r from-[#667eea]/90 via-[#764ba2]/85 to-[#4facfe]/90 bg-clip-text font-semibold tracking-tight text-transparent"
          >
            {letter}
          </motion.span>
        ))}
      </motion.span>
    </div>
  );
}
