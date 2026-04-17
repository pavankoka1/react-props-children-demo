"use client";

import { Navigation } from "@/components/Navigation/Navigation";
import { WatcherLens } from "@/components/WatcherLens/WatcherLens";
import { useState } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <>
      <Navigation
        onExpandChange={setSidebarExpanded}
        isExpanded={sidebarExpanded}
      />
      <WatcherLens />
      <main
        className="app-scroll fixed right-0 top-0 z-10 h-screen overflow-y-auto transition-[left] duration-500"
        style={{ left: sidebarExpanded ? 240 : 60 }}
      >
        {children}
        <footer className="border-t border-[var(--bg-tertiary)] px-8 py-6">
          <p className="text-center text-sm text-[var(--text-muted)]">
            React props vs children vs memo · by Koka · April 2026
          </p>
        </footer>
      </main>
    </>
  );
}
