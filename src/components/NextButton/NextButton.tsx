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
        className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] px-6 py-3 font-medium text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
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
