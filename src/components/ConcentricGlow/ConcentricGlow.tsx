"use client";

import { motion } from "framer-motion";

export function ConcentricGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full opacity-[0.08] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.06, 0.1, 0.06],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -right-32 top-1/2 h-[400px] w-[400px] rounded-full opacity-[0.06] blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(118, 75, 162, 0.4) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1.05, 1, 1.05],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full opacity-[0.05] blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(79, 172, 254, 0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.04, 0.07, 0.04],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}
