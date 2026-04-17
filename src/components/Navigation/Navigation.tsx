"use client";

import { Logo } from "@/components/Logo/Logo";
import { useNavigationStore } from "@/store/navigationStore";
import { BookOpen, Home, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
const SIDEBAR_WIDTH_COLLAPSED = 60;
const SIDEBAR_WIDTH_EXPANDED = 240;
const NAV_PADDING_X = 12;
const LINK_WIDTH_COLLAPSED = SIDEBAR_WIDTH_COLLAPSED - NAV_PADDING_X * 2;
const LINK_WIDTH_EXPANDED = SIDEBAR_WIDTH_EXPANDED - NAV_PADDING_X * 2;
const ICON_OFFSET = 8;

const navItems = [
  { path: "/", icon: Home, label: "Overview", number: 1 },
  { path: "/demo", icon: Sparkles, label: "Live demo", number: 2 },
  { path: "/guide", icon: BookOpen, label: "How React sees it", number: 3 },
];

interface NavigationProps {
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

export function Navigation({ isExpanded, onExpandChange }: NavigationProps) {
  const pathname = usePathname();
  const setCurrentPage = useNavigationStore((s) => s.setCurrentPage);

  return (
    <nav
      className="fixed left-0 top-0 z-50 flex h-full shrink-0 flex-col border-r border-[var(--bg-tertiary)] bg-[var(--bg-secondary)] pb-4 pt-6 transition-[width] duration-500"
      style={{
        width: isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED,
        transitionTimingFunction: SIDEBAR_EASING,
      }}
      onMouseEnter={() => onExpandChange(true)}
      onMouseLeave={() => onExpandChange(false)}
      aria-label="Main navigation"
    >
      <div className="mb-4 flex w-full items-center justify-start overflow-visible px-3">
        <Link
          href="/"
          className="flex min-w-0 items-center overflow-visible text-[var(--text-primary)] transition-colors hover:text-[#667eea]"
        >
          <Logo isExpanded={isExpanded} />
        </Link>
      </div>
      <div className="app-scroll flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto px-3">
        {navItems.map(({ path, icon: Icon, label, number }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={path}
              href={path}
              onClick={() => setCurrentPage(number)}
              className={`flex shrink-0 items-center justify-start gap-3 overflow-hidden rounded-lg py-2.5 transition-all duration-500 ${
                isActive
                  ? "bg-gradient-to-r from-[#667eea]/22 to-[#764ba2]/18 text-[var(--text-primary)] ring-1 ring-[#667eea]/35"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              }`}
              style={{
                width: isExpanded ? LINK_WIDTH_EXPANDED : LINK_WIDTH_COLLAPSED,
                paddingLeft: ICON_OFFSET,
                paddingRight: isExpanded ? 12 : ICON_OFFSET,
                transitionTimingFunction: SIDEBAR_EASING,
              }}
              aria-current={isActive ? "page" : undefined}
              title={!isExpanded ? label : undefined}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  isActive ? "text-[#667eea]" : ""
                }`}
                aria-hidden
              />
              <span className="whitespace-nowrap text-sm">{label}</span>
            </Link>
          );
        })}
      </div>
      <div className="mt-auto px-3 pb-4">
        <p
          className="overflow-hidden text-xs text-[var(--text-muted)] transition-[max-width] duration-500"
          style={{ maxWidth: isExpanded ? 200 : 0 }}
        >
          <span className="inline-flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
            Memo patterns
          </span>
        </p>
      </div>
    </nav>
  );
}
