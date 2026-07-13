"use client";

import { usePathname } from "next/navigation";
import { ErpSidebar } from "@/components/layout/ErpSidebar";
import { ErpMobileNav } from "@/components/layout/ErpMobileNav";
import { useSession } from "@/lib/session";
import { NAV_ITEMS_BY_ROLE } from "@/lib/navigation";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const session = useSession();
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <ErpSidebar storeName={session.vendorName} storeInitials={session.storeInitials} role={session.role as "admin" | "vendor"} navItems={NAV_ITEMS_BY_ROLE.vendor} activePath={pathname} />
      <div className="flex-1 min-w-0 pb-16 lg:pb-0">{children}</div>
      <ErpMobileNav items={NAV_ITEMS_BY_ROLE.vendor} activePath={pathname} />
    </div>
  );
}
