"use client";

import { usePathname } from "next/navigation";
import { ErpSidebar } from "@/components/layout/ErpSidebar";
import { ErpMobileNav } from "@/components/layout/ErpMobileNav";
import { LayoutDashboard, Package, Ticket, ClipboardList, Wallet, User } from "lucide-react";
import { useSession } from "@/lib/session";

const VENDOR_NAV_ITEMS = [
  { href: "/user/vendor/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
  { href: "/user/vendor/products", icon: <Package className="w-5 h-5" />, label: "Produk & Jasa" },
  { href: "/user/vendor/tickets", icon: <Ticket className="w-5 h-5" />, label: "Tiket Event" },
  { href: "/user/vendor/orders", icon: <ClipboardList className="w-5 h-5" />, label: "Pesanan Masuk", badge: 2 },
  { href: "/user/vendor/wallet", icon: <Wallet className="w-5 h-5" />, label: "Wallet & Saldo" },
  { href: "/user/vendor/profile", icon: <User className="w-5 h-5" />, label: "Profil Toko" },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const session = useSession();
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <ErpSidebar storeName={session.vendorName} storeInitials={session.storeInitials} role={session.role as "admin" | "vendor"} navItems={VENDOR_NAV_ITEMS} activePath={pathname} />
      <div className="flex-1 min-w-0 pb-16 lg:pb-0">{children}</div>
      <ErpMobileNav items={VENDOR_NAV_ITEMS} activePath={pathname} />
    </div>
  );
}
