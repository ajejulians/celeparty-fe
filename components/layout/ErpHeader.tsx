"use client";

import { Bell, Menu } from "lucide-react";

interface ErpHeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  notificationCount?: number;
  onMenuToggle?: () => void;
}

export function ErpHeader({
  breadcrumbs,
  notificationCount = 0,
  onMenuToggle,
}: ErpHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav className="hidden sm:flex items-center gap-1.5 text-sm font-sans text-neutral-500">
            {breadcrumbs.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-neutral-300">/</span>}
                {item.href ? (
                  <a
                    href={item.href}
                    className="hover:text-c-blue transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="font-medium text-neutral-700">
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="relative p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-c-red text-white text-[10px] font-bold font-sans flex items-center justify-center">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-neutral-200">
            <div className="w-8 h-8 rounded-lg bg-c-blue flex items-center justify-center">
              <span className="font-quick font-bold text-white text-xs">
                JA
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-quick font-semibold text-neutral-700">
                Jakarta Audio Pro
              </p>
              <p className="text-[10px] font-sans text-neutral-500">Vendor</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
