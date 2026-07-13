"use client";

import { cn } from "../../lib/utils";
import type { NavItem } from "../../lib/navigation";

interface ErpMobileNavProps {
  items: NavItem[];
  activePath?: string;
}

export function ErpMobileNav({ items, activePath }: ErpMobileNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-40 safe-area-bottom">
      <div className="flex items-center justify-around py-1.5 px-1">
        {items.map((item) => {
          const isActive =
            activePath === item.href ||
            (item.href !== "#" && activePath && (activePath === item.href || activePath.startsWith(item.href + "/")));
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg min-w-0 transition-colors",
                isActive ? "text-c-blue" : "text-neutral-400 hover:text-neutral-600"
              )}
            >
              <span className="w-5 h-5">{item.icon}</span>
              <span className="text-xs font-quick font-semibold truncate max-w-[64px]">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
