"use client";

import { usePathname } from "next/navigation";
import { ErpSidebar } from "@/components/layout/ErpSidebar";
import { ErpMobileNav } from "@/components/layout/ErpMobileNav";
import { NAV_ITEMS_BY_ROLE } from "@/lib/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <ErpSidebar storeName="Admin Celeparty" storeInitials="AC" role="admin" navItems={NAV_ITEMS_BY_ROLE.admin} activePath={pathname} />
      <div className="flex-1 min-w-0 pb-16 lg:pb-0">{children}</div>
      <ErpMobileNav items={NAV_ITEMS_BY_ROLE.admin} activePath={pathname} />
    </div>
  );
}
