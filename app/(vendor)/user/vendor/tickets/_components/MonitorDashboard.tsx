"use client";

import {
	ArrowLeft,
	Calendar,
	Camera,
	CheckCircle,
	Download,
	ExternalLink,
	Image,
	MapPin,
	Search,
	Ticket,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { TicketScan } from "@/components/ticket/TicketScan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useScannerStore } from "@/lib/scanner-store";
import {
	CATEGORY_BADGE_COLORS,
	computeTicketDisplayStatus,
	EVENT_STATUS_MAP,
	getEventStats,
	getTicketsByEvent,
	type TicketEntry,
	type VendorEvent,
} from "@/lib/ticket-data";
import { useScannerHeartbeat } from "@/lib/use-scanner-heartbeat";
import { formatCurrency } from "@/lib/utils";

type TabFilter = "all" | "pending" | "checked_in" | "invalid" | "cancelled";

interface MonitorDashboardProps {
	event: VendorEvent;
	backHref?: string;
	backLabel?: string;
	onBack?: () => void;
}

export function MonitorDashboard({
	event,
	backHref = "/user/vendor/tickets",
	backLabel = "Kembali ke Daftar Event",
	onBack,
}: MonitorDashboardProps) {
	const tickets = useMemo(() => getTicketsByEvent(event.id), [event.id]);
	const stats = useMemo(() => getEventStats(event), [event]);
	const [tabFilter, setTabFilter] = useState<TabFilter>("all");
	const [search, setSearch] = useState("");
	const [showScanModal, setShowScanModal] = useState(false);
	const [scanInput, setScanInput] = useState("");
	const [_scanResult, setScanResult] = useState<
		"valid" | "invalid" | "duplicate" | null
	>(null);
	const [_scannedTicket, setScannedTicket] = useState<TicketEntry | null>(null);
	const [localTickets, setLocalTickets] = useState(tickets);

	const deviceId = `monitor-${event.id}`;
	const isScannerActive = useScannerStore((s) => s.isScannerActive);
	const lockedBy = useScannerStore((s) => s.lockedBy);
	const { start, stop } = useScannerHeartbeat(deviceId);
	const scannerLockedByOther = isScannerActive && lockedBy !== deviceId;

	const handleOpenScanner = () => {
		start();
		setShowScanModal(true);
		setScanInput("");
		setScanResult(null);
		setScannedTicket(null);
	};
	const handleCloseScanner = () => {
		stop();
		setShowScanModal(false);
	};

	const _handleScanSubmit = () => {
		const found = localTickets.find((t) => t.barcode === scanInput.trim());
		if (found) {
			if (
				found.verificationStatus === "verified" ||
				found.ticketStatus === "used"
			) {
				setScanResult("invalid");
				setScannedTicket(found);
			} else {
				found.verificationStatus = "verified";
				found.ticketStatus = "used";
				found.status = computeTicketDisplayStatus(found);
				setLocalTickets([...localTickets]);
				setScanResult("valid");
				setScannedTicket(found);
			}
		} else {
			setScanResult("invalid");
			setScannedTicket(null);
		}
	};

	const handleManualValidation = (ticket: TicketEntry) => {
		if (ticket.status === "pending") {
			ticket.verificationStatus = "verified";
			ticket.ticketStatus = "used";
			ticket.status = computeTicketDisplayStatus(ticket);
			setLocalTickets([...localTickets]);
		}
	};

	const filtered = useMemo(() => {
		let list = localTickets;
		if (tabFilter === "pending")
			list = list.filter((t) => t.status === "pending");
		if (tabFilter === "checked_in")
			list = list.filter((t) => t.status === "checked_in");
		if (tabFilter === "invalid")
			list = list.filter(
				(t) => t.status === "invalid" || t.status === "duplicate",
			);
		if (tabFilter === "cancelled")
			list = list.filter(
				(t) => t.status === "cancelled" || t.status === "refunded",
			);
		if (search) {
			const q = search.toLowerCase();
			list = list.filter(
				(t) =>
					t.barcode.toLowerCase().includes(q) ||
					t.buyerName.toLowerCase().includes(q) ||
					t.buyerEmail.toLowerCase().includes(q) ||
					t.category.toLowerCase().includes(q),
			);
		}
		return list;
	}, [localTickets, tabFilter, search]);

	const liveCheckedIn = localTickets.filter(
		(t) => t.verificationStatus === "verified" || t.ticketStatus === "used",
	).length;
	const soldPct =
		stats.totalQuota > 0
			? Math.round((stats.totalSold / stats.totalQuota) * 100)
			: 0;
	const checkInPct =
		stats.totalSold > 0
			? Math.round((liveCheckedIn / stats.totalSold) * 100)
			: 0;

	const handleExport = () => {
		const data = filtered.map((t) => ({
			Barcode: t.barcode,
			"Nama Pembeli": t.buyerName,
			Email: t.buyerEmail,
			"Kategori Tiket": t.category,
			Harga: t.price,
			"Waktu Beli": t.purchaseDate,
			Status:
				t.status === "checked_in"
					? "Sudah Masuk"
					: t.status === "invalid"
						? "Invalid"
						: t.status === "duplicate"
							? "Duplikat"
							: t.status === "cancelled"
								? "Dibatalkan"
								: t.status === "refunded"
									? "Direfund"
									: "Menunggu",
		}));
		const ws = XLSX.utils.json_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Manifest");
		XLSX.writeFile(wb, `${event.name.replace(/\s+/g, "_")}_manifest.xlsx`);
	};

	const st = EVENT_STATUS_MAP[event.status];
	const tabLabel: Record<TabFilter, string> = {
		all: "Semua",
		pending: "Menunggu",
		checked_in: "Sukses",
		invalid: "Invalid",
		cancelled: "Batal",
	};

	return (
		<TooltipProvider>
			<ErpHeader
				breadcrumbs={[
					{ label: "Dashboard", href: "/user/vendor/dashboard" },
					{ label: "Tiket Event", href: "/user/vendor/tickets" },
					{ label: event.name },
				]}
			/>
			<div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
				{/* Header Profile */}
				<div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
					<div className="h-24 sm:h-32 bg-gradient-to-r from-c-blue to-c-blue-100 flex items-end px-6">
						<div className="w-20 sm:w-24 h-20 sm:h-24 rounded-xl bg-white border-4 border-white shadow-md -mb-6 flex items-center justify-center overflow-hidden">
							{event.banner ? (
								<img
									src={event.banner}
									alt=""
									className="w-full h-full object-cover"
								/>
							) : (
								<Image className="w-8 h-8 text-slate-400" />
							)}
						</div>
					</div>
					<div className="px-6 pt-8 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<h1 className="font-quick font-bold text-xl sm:text-2xl text-neutral-900">
									{event.name}
								</h1>
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${st.className}`}
								>
									{st.label}
								</span>
							</div>
							<p className="font-sans text-sm text-neutral-500">
								<Calendar className="w-3.5 h-3.5 inline mr-1" />
								{new Date(event.date).toLocaleDateString("id-ID", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}{" "}
								&middot; {event.time}
								<span className="mx-1.5 text-neutral-300">|</span>
								<MapPin className="w-3.5 h-3.5 inline mr-1" />
								{event.venue}
								{event.gmapsLink && (
									<a
										href={event.gmapsLink}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-0.5 ml-1 text-c-blue hover:underline text-xs font-medium"
									>
										<ExternalLink className="w-3 h-3" /> Maps
									</a>
								)}
							</p>
						</div>
						<div className="flex items-center gap-2">
							{onBack ? (
								<Button
									variant="outline"
									size="sm"
									onClick={onBack}
									className="font-sans text-xs gap-2"
								>
									<ArrowLeft className="w-3.5 h-3.5" /> {backLabel}
								</Button>
							) : (
								<Link href={backHref}>
									<Button
										variant="outline"
										size="sm"
										className="font-sans text-xs gap-2"
									>
										<ArrowLeft className="w-3.5 h-3.5" /> {backLabel}
									</Button>
								</Link>
							)}
						</div>
					</div>
				</div>

				{/* Live Metric Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<Card>
						<CardContent className="p-5 space-y-3">
							<div className="flex items-center justify-between">
								<p className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">
									Kuota vs Terjual
								</p>
								<div className="w-8 h-8 rounded-lg bg-c-blue-50 flex items-center justify-center">
									<Ticket className="w-4 h-4 text-c-blue" />
								</div>
							</div>
							<div className="flex items-baseline gap-2">
								<p className="font-quick font-bold text-2xl text-emerald-600">
									{stats.totalSold.toLocaleString("id-ID")}
								</p>
								<p className="text-sm font-sans text-neutral-400">
									/ {stats.totalQuota.toLocaleString("id-ID")}
								</p>
							</div>
							<div className="space-y-1.5">
								<div className="w-full bg-neutral-100 rounded-full h-2.5">
									<div
										className={`h-2.5 rounded-full transition-all ${soldPct >= 100 ? "bg-c-red" : soldPct >= 80 ? "bg-c-orange" : "bg-c-blue"}`}
										style={{ width: `${Math.min(soldPct, 100)}%` }}
									/>
								</div>
								<p className="font-sans text-xs text-neutral-500 text-right">
									{soldPct}% terjual
								</p>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-5 space-y-3">
							<div className="flex items-center justify-between">
								<p className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">
									Total Check-in
								</p>
								<div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
									<CheckCircle className="w-4 h-4 text-amber-600" />
								</div>
							</div>
							<div className="flex items-baseline gap-2">
								<p className="font-quick font-bold text-2xl text-neutral-900">
									{liveCheckedIn.toLocaleString("id-ID")}
								</p>
								<p className="text-sm font-sans text-neutral-400">
									/ {stats.totalSold.toLocaleString("id-ID")} tiket
								</p>
							</div>
							<div className="space-y-1.5">
								<div className="w-full bg-neutral-100 rounded-full h-2.5">
									<div
										className="h-2.5 rounded-full bg-status-success transition-all"
										style={{ width: `${Math.min(checkInPct, 100)}%` }}
									/>
								</div>
								<p className="font-sans text-xs text-neutral-500 text-right">
									{checkInPct}% sudah masuk
								</p>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-5 space-y-3">
							<div className="flex items-center justify-between">
								<p className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">
									Pendapatan
								</p>
								<div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
									<TrendingUp className="w-4 h-4 text-emerald-600" />
								</div>
							</div>
							<p className="font-quick font-bold text-2xl text-neutral-900">
								{formatCurrency(stats.totalRevenue)}
							</p>
							<div className="grid grid-cols-2 gap-2 text-center text-xs font-sans">
								{event.categories.slice(0, 4).map((c) => (
									<div
										key={c.name}
										className="bg-neutral-100 rounded-md py-1.5 px-1"
									>
										<span className="text-neutral-400 block truncate">
											{c.name}
										</span>
										<span className="font-semibold text-neutral-700">
											{formatCurrency(c.price * c.sold)}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Scanner Control Panel */}
				<Card className="border-2 border-dashed border-c-blue-50 bg-gradient-to-br from-c-blue-50/30 to-white">
					<CardContent className="p-6">
						<div className="flex flex-col sm:flex-row items-center gap-6">
							<div
								className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${scannerLockedByOther ? "bg-neutral-400" : "bg-c-blue"}`}
							>
								<Camera className="w-8 h-8 text-white" />
							</div>
							<div className="flex-1 text-center sm:text-left">
								<h3 className="font-quick font-bold text-lg text-neutral-900">
									Panel Scanner
								</h3>
								<p className="font-sans text-sm text-neutral-600 mt-1">
									{scannerLockedByOther
										? "Scanner sedang digunakan oleh staff lain. Hanya satu scanner dapat aktif per event."
										: "Siap untuk scan barcode tiket di gate masuk. Scanner akan mengunci sesi secara eksklusif."}
								</p>
								<div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
									<span
										className={`w-2.5 h-2.5 rounded-full ${scannerLockedByOther ? "bg-c-red animate-pulse-soft" : "bg-status-success"}`}
									/>
									<span
										className={`font-quick font-semibold text-sm ${scannerLockedByOther ? "text-c-red" : "text-emerald-600"}`}
									>
										{scannerLockedByOther ? `In Use by: ${lockedBy}` : "Ready"}
									</span>
								</div>
							</div>
							<div className="shrink-0">
								{scannerLockedByOther ? (
									<Tooltip>
										<TooltipTrigger asChild>
											<span>
												<Button
													disabled
													size="lg"
													className="font-quick font-bold text-base gap-2 bg-neutral-300 text-neutral-500 cursor-not-allowed px-8 h-14"
												>
													<Camera className="w-5 h-5" /> Buka Kamera Scanner
												</Button>
											</span>
										</TooltipTrigger>
										<TooltipContent>
											<p>Fitur scan sedang digunakan staff lain.</p>
										</TooltipContent>
									</Tooltip>
								) : (
									<Button
										onClick={handleOpenScanner}
										size="lg"
										className="font-quick font-bold text-base gap-2 bg-c-green text-neutral-900 hover:brightness-95 px-8 h-14 min-w-[260px]"
									>
										<Camera className="w-5 h-5" /> Buka Kamera Scanner
									</Button>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Manifest Toolbar */}
				<div className="flex items-center justify-between flex-wrap gap-3">
					<Tabs
						value={tabFilter}
						onValueChange={(v) => setTabFilter(v as TabFilter)}
					>
						<TabsList className="bg-white border border-neutral-200 p-1 h-auto">
							{(
								[
									"all",
									"pending",
									"checked_in",
									"invalid",
									"cancelled",
								] as TabFilter[]
							).map((t) => (
								<TabsTrigger
									key={t}
									value={t}
									className="font-quick text-xs py-2 data-[state=active]:bg-c-blue data-[state=active]:text-white"
								>
									{tabLabel[t]}
									{t !== "all" && (
										<span className="ml-1.5 bg-white/20 text-white rounded-full px-1.5 text-[10px] font-mono">
											{t === "pending"
												? localTickets.filter((tt) => tt.status === "pending")
														.length
												: t === "checked_in"
													? localTickets.filter(
															(tt) => tt.status === "checked_in",
														).length
													: t === "invalid"
														? localTickets.filter(
																(tt) =>
																	tt.status === "invalid" ||
																	tt.status === "duplicate",
															).length
														: localTickets.filter(
																(tt) =>
																	tt.status === "cancelled" ||
																	tt.status === "refunded",
															).length}
										</span>
									)}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
					<div className="flex items-center gap-3">
						<div className="relative">
							<Search className="w-4 h-4 absolute left-3 top-2 text-neutral-400" />
							<Input
								placeholder="Cari barcode, nama, email..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-9 h-9 text-sm w-56 sm:w-72"
							/>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleExport}
							className="font-sans text-xs gap-2"
						>
							<Download className="w-3.5 h-3.5" /> Export CSV
						</Button>
					</div>
				</div>

				{/* Manifest Table */}
				<div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[900px]">
							<thead>
								<tr className="bg-neutral-50 border-b border-neutral-200">
									<th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">
										Barcode
									</th>
									<th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">
										Info Pembeli
									</th>
									<th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">
										Kategori
									</th>
									<th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">
										Waktu Beli
									</th>
									<th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">
										Status
									</th>
									<th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((ticket, i) => (
									<tr
										key={ticket.id}
										className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50/70 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-neutral-50/30"}`}
									>
										<td className="px-4 py-3">
											<span className="font-mono text-xs text-neutral-700 bg-neutral-100 px-2 py-1 rounded-md">
												{ticket.barcode}
											</span>
										</td>
										<td className="px-4 py-3">
											<p className="font-sans text-sm font-medium text-neutral-900">
												{ticket.buyerName}
											</p>
											<p className="font-sans text-xs text-neutral-400">
												{ticket.buyerEmail}
											</p>
										</td>
										<td className="px-4 py-3">
											<span
												className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${CATEGORY_BADGE_COLORS[ticket.category] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}
											>
												{ticket.category}
											</span>
										</td>
										<td className="px-4 py-3 font-sans text-xs text-neutral-500 whitespace-nowrap">
											{new Date(ticket.purchaseDate).toLocaleDateString(
												"id-ID",
												{ day: "numeric", month: "short", year: "numeric" },
											)}
										</td>
										<td className="px-4 py-3 text-center">
											{ticket.status === "checked_in" ? (
												<Badge variant="success">Sukses</Badge>
											) : ticket.status === "invalid" ? (
												<Badge variant="destructive">Invalid</Badge>
											) : ticket.status === "duplicate" ? (
												<Badge variant="secondary">Duplikat</Badge>
											) : ticket.status === "cancelled" ? (
												<Badge variant="destructive">Dibatalkan</Badge>
											) : ticket.status === "refunded" ? (
												<Badge variant="secondary">Direfund</Badge>
											) : (
												<Badge variant="pending">Menunggu</Badge>
											)}
										</td>
										<td className="px-4 py-3 text-center">
											{ticket.status === "pending" ? (
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleManualValidation(ticket)}
													className="font-sans text-xs gap-1 h-8"
												>
													<CheckCircle className="w-3 h-3" /> Validasi Manual
												</Button>
											) : (
												<span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-sans font-medium">
													<CheckCircle className="w-3 h-3" /> Masuk
												</span>
											)}
										</td>
									</tr>
								))}
								{filtered.length === 0 && (
									<tr>
										<td
											colSpan={6}
											className="px-4 py-20 text-center font-sans text-sm text-neutral-400"
										>
											Tidak ada data tiket untuk filter ini.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<Dialog
				open={showScanModal}
				onOpenChange={(open) => {
					if (!open) handleCloseScanner();
				}}
			>
				<DialogContent className="sm:max-w-xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Camera className="w-5 h-5 text-c-blue" /> Scan Barcode
						</DialogTitle>
						<DialogDescription>
							{event.name} — Scanner sedang aktif dan mengunci sesi.
						</DialogDescription>
					</DialogHeader>
					<div className="py-2">
						<TicketScan />
					</div>
					<DialogFooter className="flex flex-col gap-2">
						<p className="font-sans text-xs text-neutral-400 text-center">
							Menutup scanner akan melepas kunci session.
						</p>
						<Button
							variant="outline"
							onClick={handleCloseScanner}
							className="font-sans text-sm w-full"
						>
							Tutup Scanner & Lepas Kunci
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</TooltipProvider>
	);
}
