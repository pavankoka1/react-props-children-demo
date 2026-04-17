"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const WITTY_MESSAGES = [
  "Every render is being profiled from up here.",
  "Children are new elements each time — memo feels that.",
  "Stable prop reference? memo nods approvingly.",
  "I saw that unnecessary re-render. DevTools agrees.",
  "Shallow compare does not forgive unstable children.",
];

/**
 * Top-right “watcher”: rotating aperture ring + lens pupil that tracks the pointer.
 * SVG-based — distinct from canvas twin-eye demos elsewhere.
 */
export function WatcherLens() {
  const [message, setMessage] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [pupil, setPupil] = useState({ x: 36, y: 36 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nx = (e.clientX / w - 0.5) * 2;
      const ny = (e.clientY / h - 0.5) * 2;
      target.current = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let id: number;
    const cx = 36;
    const cy = 36;
    const tick = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      current.current.x = lerp(current.current.x, target.current.x, 0.15);
      current.current.y = lerp(current.current.y, target.current.y, 0.15);
      const px = cx + current.current.x * 9;
      const py = cy + current.current.y * 9;
      setPupil({ x: px, y: py });
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClick = useCallback(() => {
    const msg = WITTY_MESSAGES[messageIndex % WITTY_MESSAGES.length];
    setMessage(msg);
    setMessageIndex((i) => i + 1);
    setTimeout(() => setMessage(null), 3200);
  }, [messageIndex]);

  const cx = 36;
  const cy = 36;

  return (
    <>
      <motion.button
        type="button"
        className="fixed right-6 top-6 z-40 rounded-full border border-[var(--bg-tertiary)] bg-[var(--bg-secondary)]/95 p-2 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#667eea]/60"
        onClick={handleClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label="React render watcher — click for a tip"
      >
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          className="block"
          aria-hidden
        >
          <defs>
            <radialGradient id="wl-glass" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="rgba(199, 210, 254, 0.35)" />
              <stop offset="55%" stopColor="rgba(102, 126, 234, 0.12)" />
              <stop offset="100%" stopColor="rgba(15, 15, 20, 0.85)" />
            </radialGradient>
            <linearGradient id="wl-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="50%" stopColor="#764ba2" />
              <stop offset="100%" stopColor="#4facfe" />
            </linearGradient>
          </defs>

          <g className="watcher-lens-spin">
            <circle
              cx={cx}
              cy={cy}
              r="30"
              fill="none"
              stroke="url(#wl-ring)"
              strokeWidth="1.5"
              strokeDasharray="6 10"
              opacity={0.85}
            />
            <circle
              cx={cx}
              cy={cy}
              r="26"
              fill="none"
              stroke="rgba(148, 163, 184, 0.25)"
              strokeWidth="1"
            />
          </g>

          <polygon
            points="36,10 58,22 58,46 36,58 14,46 14,22"
            fill="none"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="1"
          />

          <circle cx={cx} cy={cy} r="18" fill="url(#wl-glass)" />
          <circle
            cx={cx}
            cy={cy}
            r="18"
            fill="none"
            stroke="rgba(102, 126, 234, 0.45)"
            strokeWidth="1.25"
          />

          <circle cx={pupil.x} cy={pupil.y} r="6.5" fill="rgba(15, 15, 20, 0.92)" />
          <circle
            cx={pupil.x + 1.8}
            cy={pupil.y - 1.8}
            r="2"
            fill="rgba(255,255,255,0.55)"
          />
          <circle
            cx={cx}
            cy={cy}
            r="18"
            fill="none"
            stroke="rgba(79, 172, 254, 0.15)"
            strokeWidth="3"
            opacity={0.6}
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="fixed right-6 top-[5.5rem] z-50 max-w-[280px] rounded-lg border border-[var(--bg-tertiary)] bg-[var(--bg-secondary)] px-4 py-3 shadow-xl"
            role="status"
          >
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">
              {message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
