"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

/** Web Analytics + Speed Insights — inert until the project is linked on Vercel. */
export function VercelMetrics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
