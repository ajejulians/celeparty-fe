"use client";

import { usePathname } from "next/navigation";
import { ErpMobileNav } from "@/components/layout/ErpMobileNav";
import { ErpSidebar } from "@/components/layout/ErpSidebar";
import { NAV_ITEMS_BY_ROLE } from "@/lib/navigation";
import { useSession } from "@/lib/session";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const session = useSession();

	const storeName = session.name || "Admin Celeparty";
	const storeInitials = session.storeInitials || "AC";

	return (
		<div className="min-h-screen flex bg-neutral-50">
			<ErpSidebar
				storeName={storeName}
				storeInitials={storeInitials}
				role="admin"
				navItems={NAV_ITEMS_BY_ROLE.admin}
				activePath={pathname}
			/>
			<div className="flex-1 min-w-0 pb-16 lg:pb-0">{children}</div>
			<ErpMobileNav items={NAV_ITEMS_BY_ROLE.admin} activePath={pathname} />
		</div>
	);
}
