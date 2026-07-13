import { LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import type { NavItem } from "../../lib/navigation";

interface ErpSidebarProps {
  storeName: string;
  storeInitials: string;
  role: "vendor" | "admin";
  navItems: NavItem[];
  activePath?: string;
}

export function ErpSidebar({
  storeName,
  storeInitials,
  role,
  navItems,
  activePath,
}: ErpSidebarProps) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-white border-r border-neutral-200 h-screen sticky top-0">
      <div className="p-5 border-b border-neutral-100">
        <a
          href="/"
          className="flex items-center gap-2 font-quick font-bold text-xl text-c-blue tracking-wide"
        >
          <img src="/images/favicon.ico" alt="Celeparty Logo" className="w-6 h-6 object-contain" />
          CELEPARTY
        </a>
      </div>

      <div className="px-4 py-4 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-c-blue rounded-lg flex items-center justify-center shrink-0">
            <span className="font-quick font-bold text-white text-sm">
              {storeInitials}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-quick font-semibold text-sm text-neutral-900 truncate">
              {storeName}
            </p>
            <p className="text-xs font-sans text-neutral-500">
              {role === "vendor" ? "Vendor" : "Admin"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            activePath === item.href ||
            (item.href !== "#" && activePath && (activePath === item.href || activePath.startsWith(item.href + "/")));
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-quick font-semibold transition-all duration-150 group",
                isActive
                  ? "bg-c-blue-50 text-c-blue border-r-2 border-c-blue mr-[-12px]"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <span
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive ? "text-c-blue" : "text-neutral-400 group-hover:text-neutral-600"
                )}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-c-red text-white text-xs font-bold font-sans">
                  {item.badge}
                </span>
              ) : null}
            </a>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-neutral-100">
        <a
          href="/auth/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-quick font-semibold text-neutral-500 hover:bg-neutral-100 hover:text-c-red transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </a>
      </div>
    </aside>
  );
}
