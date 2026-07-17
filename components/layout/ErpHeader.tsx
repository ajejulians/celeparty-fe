"use client";

import {
	Bell,
	BookOpen,
	HelpCircle,
	Settings,
	Shield,
	User,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/session";

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
	const session = useSession();
	return (
		<header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
			<div className="flex items-center justify-between h-14 px-4 lg:px-6">
				<div className="flex items-center gap-3">
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
							<span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-c-red text-white text-xs font-bold font-sans flex items-center justify-center">
								{notificationCount > 9 ? "9+" : notificationCount}
							</span>
						)}
					</button>

					<div className="pl-3 border-l border-neutral-200">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="flex items-center gap-2 rounded-lg hover:bg-neutral-100 transition-colors py-1 px-1.5 -my-1 -mx-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-c-blue">
									<div className="w-8 h-8 rounded-lg bg-c-blue flex items-center justify-center">
										<span className="font-quick font-bold text-white text-xs">
											{session.storeInitials}
										</span>
									</div>
									<div className="hidden sm:block text-left">
										<p className="text-xs font-quick font-semibold text-neutral-700">
											{session.vendorName}
										</p>
										<p className="text-xs font-sans text-neutral-500 capitalize">
											{session.role}
										</p>
									</div>
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<User className="mr-2 h-4 w-4" />
									Profile
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									Setting
								</DropdownMenuItem>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>
										<HelpCircle className="mr-2 h-4 w-4" />
										Pelajari Lebih Lanjut
									</DropdownMenuSubTrigger>
									<DropdownMenuSubContent className="w-52">
										<DropdownMenuItem>
											<Shield className="mr-2 h-4 w-4" />
											Kebijakan Privasi
										</DropdownMenuItem>
										<DropdownMenuItem>
											<BookOpen className="mr-2 h-4 w-4" />
											Pusat Bantuan Vendor
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuSub>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => session.logout()}
									className="text-c-red focus:text-c-red focus:bg-red-50"
								>
									Keluar
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</header>
	);
}
