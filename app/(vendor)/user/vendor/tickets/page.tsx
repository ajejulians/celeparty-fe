"use client";

import {
	Calendar,
	Image,
	MapPin,
	Monitor,
	Pencil,
	Plus,
	Search,
	Ticket,
	TrendingUp,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/session";
import {
	EVENT_STATUS_MAP,
	getEventsByVendor,
	getGlobalStats,
	type VendorEvent,
} from "@/lib/ticket-data";
import { formatCurrency } from "@/lib/utils";

const PAGE_SIZES = [5, 10, 20];

function EventRow({
	event,
	onMonitor,
}: {
	event: VendorEvent;
	onMonitor: () => void;
}) {
	const totalQuota = event.categories.reduce((s, c) => s + c.quota, 0);
	const totalSold = event.categories.reduce((s, c) => s + c.sold, 0);
	const pct = totalQuota > 0 ? Math.round((totalSold / totalQuota) * 100) : 0;
	const revenue = event.categories.reduce((s, c) => s + c.price * c.sold, 0);
	const st = EVENT_STATUS_MAP[event.status];

	return (
		<TableRow className="group">
			<TableCell>
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
						{event.banner ? (
							<img
								src={event.banner}
								alt=""
								className="w-full h-full object-cover"
							/>
						) : (
							<Image className="w-5 h-5 text-slate-400" />
						)}
					</div>
					<div className="min-w-0">
						<p className="font-quick font-semibold text-sm text-neutral-900 truncate">
							{event.name}
						</p>
						<div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-500 font-sans">
							<Calendar className="w-3 h-3 shrink-0" />
							<span>
								{new Date(event.date).toLocaleDateString("id-ID", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</span>
							<MapPin className="w-3 h-3 shrink-0 ml-1" />
							<span className="truncate max-w-[130px]">{event.venue}</span>
						</div>
					</div>
				</div>
			</TableCell>
			<TableCell>
				<span
					className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${st.className}`}
				>
					{st.label}
				</span>
			</TableCell>
			<TableCell>
				<div className="flex flex-col gap-1 min-w-[140px]">
					<div className="flex justify-between font-sans text-xs text-neutral-600">
						<span className="font-semibold">
							{totalSold.toLocaleString("id-ID")}
						</span>
						<span>/ {totalQuota.toLocaleString("id-ID")}</span>
					</div>
					<div className="w-full bg-neutral-100 rounded-full h-2">
						<div
							className={`h-2 rounded-full transition-all duration-500 ${pct >= 100 ? "bg-c-red" : pct >= 80 ? "bg-c-orange" : "bg-c-blue"}`}
							style={{ width: `${Math.min(pct, 100)}%` }}
						/>
					</div>
					<p className="font-sans text-[10px] text-neutral-400 text-right">
						{pct}% Terjual
					</p>
				</div>
			</TableCell>
			<TableCell className="font-quick font-semibold text-sm text-neutral-900 whitespace-nowrap">
				{formatCurrency(revenue)}
			</TableCell>
			<TableCell>
				<div className="flex items-center gap-2">
					<Link
						href="/user/vendor/tickets/create"
						className={buttonVariants({
							variant: "ghost",
							size: "sm",
							className:
								"font-sans text-xs gap-1 h-8 px-2.5 text-neutral-500 hover:text-c-blue",
						})}
					>
						<Pencil className="w-3 h-3" /> Edit
					</Link>
					<Button
						variant="outline"
						size="sm"
						onClick={onMonitor}
						className="font-sans text-xs gap-1 h-8 px-2.5 border-c-blue-100 text-c-blue hover:bg-c-blue-50"
					>
						<Monitor className="w-3 h-3" /> Gate
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
}

export default function TicketsDashboardPage() {
	const session = useSession();
	const router = useRouter();
	const events = getEventsByVendor(session.vendorId);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "ongoing" | "upcoming" | "finished" | "draft" | "rejected"
	>("all");
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	const stats = useMemo(() => getGlobalStats(events), [events]);
	const activeEvents = events.filter((e) => e.status === "ongoing").length;

	const filtered = useMemo(() => {
		let list = events;
		if (statusFilter !== "all")
			list = list.filter((e) => e.status === statusFilter);
		if (search) {
			const q = search.toLowerCase();
			list = list.filter(
				(e) =>
					e.name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q),
			);
		}
		return list;
	}, [events, statusFilter, search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const currentPage = Math.min(pageIndex + 1, totalPages);
	const start = (currentPage - 1) * pageSize;
	const end = Math.min(start + pageSize, filtered.length);
	const paginated = filtered.slice(start, end);

	const statusCounts = useMemo(() => {
		const all = events.length;
		const ongoing = events.filter((e) => e.status === "ongoing").length;
		const upcoming = events.filter((e) => e.status === "upcoming").length;
		const finished = events.filter((e) => e.status === "finished").length;
		const draft = events.filter((e) => e.status === "draft").length;
		const rejected = events.filter((e) => e.status === "rejected").length;
		return { all, ongoing, upcoming, finished, draft, rejected };
	}, [events]);

	const statusLabels: Record<string, string> = {
		all: "Semua",
		ongoing: "Aktif",
		upcoming: "Akan Datang",
		draft: "Draft",
		finished: "Selesai",
		rejected: "Ditolak",
	};

	const handlePageChange = useCallback((page: number) => {
		setPageIndex(page - 1);
	}, []);

	const handlePageSizeChange = useCallback((v: string) => {
		setPageSize(Number(v));
		setPageIndex(0);
	}, []);

	return (
		<>
			<ErpHeader
				breadcrumbs={[
					{ label: "Dashboard", href: "/user/vendor/dashboard" },
					{ label: "Tiket Event" },
				]}
			/>
			<div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
				<div className="flex items-center justify-between flex-wrap gap-4">
					<div>
						<h1 className="font-quick font-bold text-2xl text-neutral-900">
							Tiket Event
						</h1>
						<p className="font-sans text-sm text-neutral-500 mt-1">
							Kelola event dan pantau penjualan tiket Anda
						</p>
					</div>
					<Link
						href="/user/vendor/tickets/create"
						className={buttonVariants({ className: "gap-2" })}
					>
						<Plus className="w-4 h-4" /> Buat Event Baru
					</Link>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<Card>
						<CardContent className="p-5">
							<div className="flex items-start justify-between">
								<div className="space-y-1">
									<p className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">
										Event Aktif
									</p>
									<p className="font-quick font-bold text-2xl text-neutral-900">
										{activeEvents}
									</p>
									<p className="font-sans text-xs text-neutral-400">
										dari {events.length} total event
									</p>
								</div>
								<div className="w-10 h-10 rounded-lg bg-c-blue-50 flex items-center justify-center shrink-0">
									<Ticket className="w-5 h-5 text-c-blue" />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-5">
							<div className="flex items-start justify-between">
								<div className="space-y-1">
									<p className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">
										Tiket Terjual
									</p>
									<p className="font-quick font-bold text-2xl text-neutral-900">
										{stats.totalSold.toLocaleString("id-ID")}
									</p>
									<p className="font-sans text-xs text-neutral-400">all time</p>
								</div>
								<div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
									<TrendingUp className="w-5 h-5 text-emerald-600" />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-5">
							<div className="flex items-start justify-between">
								<div className="space-y-1">
									<p className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">
										Pendapatan Tiket
									</p>
									<p className="font-quick font-bold text-2xl text-neutral-900">
										{formatCurrency(stats.totalRevenue)}
									</p>
									<p className="font-sans text-xs text-neutral-400">
										bruto all time
									</p>
								</div>
								<div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
									<Wallet className="w-5 h-5 text-amber-600" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="flex items-center justify-between flex-wrap gap-3">
					<Tabs
						value={statusFilter}
						onValueChange={(v) => {
							setStatusFilter(v as typeof statusFilter);
							setPageIndex(0);
						}}
					>
						<TabsList className="bg-white border border-neutral-200 p-1 h-auto">
							{(
								[
									"all",
									"ongoing",
									"upcoming",
									"draft",
									"finished",
									"rejected",
								] as const
							).map((k) => (
								<TabsTrigger
									key={k}
									value={k}
									className="font-quick text-xs py-2 data-[state=active]:bg-c-blue data-[state=active]:text-white"
								>
									{statusLabels[k]}
									<span className="ml-1.5 bg-neutral-200 rounded-full px-1.5 text-[10px] text-neutral-600 data-[state=active]:bg-white/20 data-[state=active]:text-white">
										{statusCounts[k]}
									</span>
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
					<div className="relative">
						<Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
						<Input
							placeholder="Cari nama event..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPageIndex(0);
							}}
							className="pl-9 h-10 w-52 sm:w-64"
						/>
					</div>
				</div>

				<div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Info Event</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Progres Penjualan</TableHead>
									<TableHead>Pendapatan</TableHead>
									<TableHead>Aksi</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginated.map((event) => (
									<EventRow
										key={event.id}
										event={event}
										onMonitor={() =>
											router.push(`/user/vendor/tickets/${event.id}/monitor`)
										}
									/>
								))}
								{paginated.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center font-sans text-sm text-neutral-400 py-16"
										>
											{events.length === 0
												? "Belum ada event. Klik tombol Buat Event Baru untuk memulai."
												: "Event tidak ditemukan."}
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					{filtered.length > 0 && (
						<div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-neutral-100">
							<Select
								value={String(pageSize)}
								onValueChange={handlePageSizeChange}
							>
								<SelectTrigger className="w-20 h-8 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{PAGE_SIZES.map((s) => (
										<SelectItem key={s} value={String(s)}>
											{s}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								totalItems={filtered.length}
								pageSize={pageSize}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
