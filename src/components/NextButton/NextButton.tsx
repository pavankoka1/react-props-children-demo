"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface NextButtonProps {
  href: string;
  label: string;
}

export function NextButton({ href, label }: NextButtonProps) {
  return (
    <Link href={href}>
      <motion.button
        className="group flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6f7fd8] to-[#7c5fa3] px-6 py-3 font-medium text-[#fafafa] shadow-[0_12px_42px_-14px_rgba(102,126,234,0.45)] transition-all hover:brightness-[1.05] focus:outline-none focus:ring-2 focus:ring-[#667eea]/45 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {label}
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          aria-hidden
        />
      </motion.button>
    </Link>
  );
}
