"use client";

import {
	ChevronDown,
	ChevronRight,
	LogOut,
	Menu,
	Search,
	Settings,
	Sparkles,
	User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export function Navbar() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const session = useSession();
	const isLoggedIn = session.isAuthenticated;
	const dropdownRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	const isLanding = pathname === "/";

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	useEffect(() => {
		setMobileOpen(false);
	}, []);

	const navLinks = [
		{ name: "Beranda", path: "/" },
		{ name: "Produk", path: "/products" },
		{ name: "Event", path: "/events" },
		{ name: "Blog", path: "/blog" },
	];

	const isActive = (path: string) => {
		if (path === "/") return pathname === "/";
		return pathname.startsWith(path);
	};

	return (
		<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm py-2">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-14 gap-4 md:gap-8">
					<Link
						href="/"
						className="flex items-center gap-2.5 font-quick font-bold text-2xl text-neutral-900 tracking-wide shrink-0 group"
					>
						<img
							src="/images/favicon.ico"
							alt="Celeparty Logo"
							className="w-9 h-9 object-contain group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 rounded-xl"
						/>
						CELEPARTY
					</Link>

					<nav className="hidden md:flex items-center gap-8 shrink-0">
						{navLinks.map((link) => (
							<Link
								key={link.name}
								href={link.path}
								className={cn(
									"relative font-quick font-semibold text-sm py-2 transition-colors duration-200",
									isActive(link.path)
										? "text-neutral-900"
										: "text-neutral-500 hover:text-neutral-900",
								)}
							>
								{link.name}
								{isActive(link.path) && (
									<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-c-green rounded-full" />
								)}
							</Link>
						))}
					</nav>

					<div className="hidden md:flex flex-1 justify-end items-center gap-6">
						{!isLanding && (
							<div className="relative w-full max-w-sm group">
								<input
									type="text"
									placeholder="Cari event, vendor..."
									className="w-full pl-11 pr-4 py-2.5 text-sm font-sans rounded-full bg-neutral-100 text-neutral-900 placeholder:text-neutral-400 border border-neutral-200 focus:outline-none focus:border-c-green focus:bg-white focus:ring-4 focus:ring-c-green/20 transition-all duration-300"
								/>
								<span className="absolute left-4 top-2.5 text-neutral-400 group-focus-within:text-c-green transition-colors">
									<Search size={18} />
								</span>
							</div>
						)}

						{isLoggedIn ? (
							<div className="relative" ref={dropdownRef}>
								<button
									onClick={() => setDropdownOpen(!dropdownOpen)}
									className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition-all focus:outline-none focus:ring-2 focus:ring-c-green/30"
								>
									<div className="w-8 h-8 rounded-full bg-c-blue-50 flex items-center justify-center overflow-hidden border-2 border-c-green">
										<User size={18} className="text-c-blue" />
									</div>
									<span className="text-sm font-quick font-semibold text-neutral-900 max-w-[100px] truncate">
										Hi, Budi
									</span>
									<ChevronDown
										size={16}
										className={`text-neutral-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
									/>
								</button>

								{dropdownOpen && (
									<div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
										<div className="px-4 py-3 border-b border-neutral-100">
											<p className="text-sm font-quick font-bold text-neutral-900">
												Budi Santoso
											</p>
											<p className="text-xs font-sans text-neutral-500 truncate">
												budi@example.com
											</p>
										</div>
										<div className="py-2">
											<Link
												href="/profile"
												className="flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-neutral-700 hover:bg-neutral-50 hover:text-c-blue transition-colors"
											>
												<User size={18} /> Profile
											</Link>
											<Link
												href="/settings"
												className="flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-neutral-700 hover:bg-neutral-50 hover:text-c-blue transition-colors"
											>
												<Settings size={18} /> Settings
											</Link>
											<Link
												href="/bookings"
												className="flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-neutral-700 hover:bg-neutral-50 hover:text-c-blue transition-colors"
											>
												<Settings size={18} /> Bookings
											</Link>
										</div>
										<div className="border-t border-neutral-100 py-2">
											<button
												onClick={() => {
													setDropdownOpen(false);
													session.logout();
													window.location.href = "/";
												}}
												className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-red-600 hover:bg-red-50 transition-colors"
											>
												<LogOut size={18} /> Keluar
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<Link
								href="/auth/login"
								className="font-quick font-semibold text-sm bg-c-green text-neutral-900 px-7 py-2.5 rounded-full inline-flex items-center gap-2 hover:bg-[#e4e91f] hover:shadow-[0_0_24px_rgba(203,208,2,0.5)] active:scale-95 transition-all duration-300 shrink-0"
							>
								Mulai Sekarang
								<ChevronRight size={16} className="text-neutral-900" />
							</Link>
						)}
					</div>

					<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden text-neutral-700 hover:bg-neutral-100"
								aria-label="Menu"
							>
								<Menu size={26} />
							</Button>
						</SheetTrigger>
						<SheetContent
							side="left"
							className="w-[80vw] sm:w-[350px] bg-white border-neutral-100 p-0 pt-0"
						>
							<div className="flex flex-col h-full">
								<div className="flex items-center gap-2.5 px-6 py-5 border-b border-neutral-100">
									<img
										src="/images/favicon.ico"
										alt="Celeparty Logo"
										className="w-8 h-8 object-contain rounded-lg"
									/>
									<span className="font-quick font-bold text-xl text-neutral-900">
										CELEPARTY
									</span>
								</div>

								{!isLanding && (
									<div className="px-4 py-4">
										<div className="relative w-full">
											<input
												type="text"
												placeholder="Cari event, vendor..."
												className="w-full pl-12 pr-4 py-3 text-sm font-sans rounded-xl bg-neutral-100 text-neutral-900 placeholder:text-neutral-400 border border-neutral-200 focus:outline-none focus:border-c-green focus:bg-white transition-all"
											/>
											<span className="absolute left-4 top-3 text-neutral-400">
												<Search size={20} />
											</span>
										</div>
									</div>
								)}

								<nav className="flex flex-col flex-1 px-3 py-4 gap-1 overflow-y-auto">
									{navLinks.map((link) => (
										<SheetClose key={link.name} asChild>
											<Link
												href={link.path}
												className={cn(
													"font-quick font-semibold text-lg py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-between",
													isActive(link.path)
														? "text-neutral-900 bg-neutral-100"
														: "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50",
												)}
											>
												{link.name}
												<ChevronRight size={20} className="opacity-50" />
											</Link>
										</SheetClose>
									))}
								</nav>

								<div className="px-4 py-6 border-t border-neutral-100 mt-auto">
									{isLoggedIn ? (
										<div className="space-y-2">
											<div className="flex items-center gap-3 mb-4 px-2">
												<div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border-2 border-c-green">
													<User size={20} className="text-c-blue" />
												</div>
												<div>
													<p className="font-quick font-bold text-sm text-neutral-900">
														Budi Santoso
													</p>
													<p className="font-sans text-xs text-neutral-500">
														budi@example.com
													</p>
												</div>
											</div>
											<SheetClose asChild>
												<Link
													href="/profile"
													className="flex items-center gap-3 px-4 py-3 rounded-xl font-quick font-semibold text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all"
												>
													<User size={18} className="text-c-green" /> Profile
												</Link>
											</SheetClose>
											<SheetClose asChild>
												<Link
													href="/settings"
													className="flex items-center gap-3 px-4 py-3 rounded-xl font-quick font-semibold text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all"
												>
													<Settings size={18} className="text-c-green" />{" "}
													Settings
												</Link>
											</SheetClose>
											<button
												onClick={() => {
													setMobileOpen(false);
													session.logout();
													window.location.href = "/";
												}}
												className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-quick font-semibold text-sm text-red-500 hover:bg-red-50 transition-all"
											>
												<LogOut size={18} /> Keluar
											</button>
										</div>
									) : (
										<SheetClose asChild>
											<Link
												href="/auth/login"
												className="w-full font-quick font-bold text-base bg-c-green text-neutral-900 px-6 py-4 rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(203,208,2,0.3)]"
											>
												Mulai Sekarang <Sparkles className="w-5 h-5" />
											</Link>
										</SheetClose>
									)}
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
