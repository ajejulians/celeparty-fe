"use client";

import { usePathname } from "next/navigation";
import { ErpSidebar } from "@/components/layout/ErpSidebar";
import { ErpMobileNav } from "@/components/layout/ErpMobileNav";
import { LayoutDashboard, ClipboardList, Store, Users, BarChart3, Calculator, FileText, CheckCircle } from "lucide-react";

const ADMIN_NAV_ITEMS = [
  { href: "/user/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
  { href: "/user/admin/orders", icon: <ClipboardList className="w-5 h-5" />, label: "Semua Pesanan", badge: 7 },
  { href: "/user/admin/vendors", icon: <Store className="w-5 h-5" />, label: "Vendor" },
  { href: "/user/admin/users", icon: <Users className="w-5 h-5" />, label: "Pengguna" },
  { href: "/user/admin/moderation", icon: <CheckCircle className="w-5 h-5" />, label: "Moderasi" },
  { href: "/user/admin/quotation", icon: <Calculator className="w-5 h-5" />, label: "Quotation" },
  { href: "/user/admin/blog", icon: <FileText className="w-5 h-5" />, label: "Blog" },
  { href: "/user/admin/reports", icon: <BarChart3 className="w-5 h-5" />, label: "Laporan" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <ErpSidebar storeName="Admin Celeparty" storeInitials="AC" role="admin" navItems={ADMIN_NAV_ITEMS} activePath={pathname} />
      <div className="flex-1 min-w-0 pb-16 lg:pb-0">{children}</div>
      <ErpMobileNav items={ADMIN_NAV_ITEMS} activePath={pathname} />
    </div>
  );
}
