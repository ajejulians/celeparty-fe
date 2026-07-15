import {
  LayoutDashboard,
  ClipboardList,
  Store,
  Users,
  BarChart3,
  Calculator,
  FileText,
  CheckCircle,
  Package,
  Ticket,
  Wallet,
  User,
  ShoppingBag,
  ListTodo,
  PlusCircle,
  ScanFace,
  Activity,
} from "lucide-react";
import type { ReactNode } from "react";

export interface NavItem {
  href: string;
  icon: ReactNode;
  label: string;
  badge?: number;
  children?: NavItem[];
}

export type Role = "admin" | "vendor" | "customer";

export function getActiveChildPaths(items: NavItem[]): string[] {
  const paths: string[] = [];
  for (const item of items) {
    paths.push(item.href);
    if (item.children) paths.push(...getActiveChildPaths(item.children));
  }
  return paths;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: "/user/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
  { href: "/user/admin/orders", icon: <ClipboardList className="w-5 h-5" />, label: "Semua Pesanan", badge: 7 },
  { href: "/user/admin/vendors", icon: <Store className="w-5 h-5" />, label: "Vendor" },
  { href: "/user/admin/users", icon: <Users className="w-5 h-5" />, label: "Pengguna" },
  { href: "/user/admin/moderation", icon: <CheckCircle className="w-5 h-5" />, label: "Moderasi" },
  { href: "/user/admin/quotation", icon: <Calculator className="w-5 h-5" />, label: "Quotation" },
  { href: "/user/admin/blog", icon: <FileText className="w-5 h-5" />, label: "Blog" },
  { href: "/user/admin/reports", icon: <BarChart3 className="w-5 h-5" />, label: "Laporan" },
];

const VENDOR_NAV_ITEMS: NavItem[] = [
  { href: "/user/vendor/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
  { href: "/user/vendor/products", icon: <Package className="w-5 h-5" />, label: "Produk & Jasa" },
  {
    href: "/user/vendor/tickets",
    icon: <Ticket className="w-5 h-5" />,
    label: "Tiket Event",
    children: [
      { href: "/user/vendor/tickets", icon: <ListTodo className="w-4 h-4" />, label: "Daftar Event" },
      { href: "/user/vendor/tickets/create", icon: <PlusCircle className="w-4 h-4" />, label: "Buat Event" },
      { href: "/user/vendor/tickets/gate", icon: <ScanFace className="w-4 h-4" />, label: "Scan" },
    ],
  },
  { href: "/user/vendor/orders", icon: <ClipboardList className="w-5 h-5" />, label: "Pesanan Masuk", badge: 2 },
  { href: "/user/vendor/monitoring", icon: <Activity className="w-5 h-5" />, label: "Monitoring" },
  { href: "/user/vendor/wallet", icon: <Wallet className="w-5 h-5" />, label: "Wallet & Saldo" },
  { href: "/user/vendor/profile", icon: <User className="w-5 h-5" />, label: "Profil Toko" },
];

const CUSTOMER_NAV_ITEMS: NavItem[] = [
  { href: "/products", icon: <ShoppingBag className="w-5 h-5" />, label: "Belanja" },
  { href: "/bookings", icon: <ClipboardList className="w-5 h-5" />, label: "Pesanan Saya" },
  { href: "/profile", icon: <User className="w-5 h-5" />, label: "Profil" },
];

export const NAV_ITEMS_BY_ROLE: Record<Role, NavItem[]> = {
  admin: ADMIN_NAV_ITEMS,
  vendor: VENDOR_NAV_ITEMS,
  customer: CUSTOMER_NAV_ITEMS,
};