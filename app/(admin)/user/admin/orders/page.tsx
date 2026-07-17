"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
	CalendarIcon,
	ClipboardList,
	Download,
	Eye,
	FileSpreadsheet,
	FileText,
	MoreVertical,
	PencilLine,
	RotateCcw,
	Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
import { type Order, orders } from "@/lib/data";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

type StatusFilter =
	| "all"
	| "pending"
	| "dp_pending"
	| "dp_paid"
	| "fully_paid"
	| "settlement"
	| "failed"
	| "cancelled"
	| "expired"
	| "dp_refunded";
type SortBy =
	| "date_desc"
	| "date_asc"
	| "total_desc"
	| "total_asc"
	| "name_asc"
	| "name_desc";

export default function AdminOrdersPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
	const [sortBy, setSortBy] = useState<SortBy>("date_desc");
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;

	const totalRevenue = orders
		.filter(
			(o) =>
				o.paymentStatus === "settlement" ||
				o.paymentStatus === "fully_paid" ||
				o.paymentStatus === "dp_paid",
		)
		.reduce(
			(s, o) => s + (o.paymentStatus === "dp_paid" ? o.dpAmount : o.total),
			0,
		);

	const hasActiveFilters =
		searchQuery !== "" ||
		statusFilter !== "all" ||
		dateRange !== undefined ||
		sortBy !== "date_desc";

	const resetFilters = () => {
		setSearchQuery("");
		setStatusFilter("all");
		setDateRange(undefined);
		setSortBy("date_desc");
		setCurrentPage(1);
	};

	const filtered = useMemo(() => {
		let list: Order[] = orders;
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			list = list.filter(
				(o) =>
					o.id.toLowerCase().includes(q) ||
					o.customer.toLowerCase().includes(q) ||
					o.product.toLowerCase().includes(q) ||
					(o.vendorName ?? "").toLowerCase().includes(q),
			);
		}
		if (statusFilter !== "all") {
			list = list.filter((o) => o.paymentStatus === statusFilter);
		}
		if (dateRange?.from) {
			const from = new Date(dateRange.from);
			from.setHours(0, 0, 0, 0);
			const to = dateRange.to
				? new Date(dateRange.to)
				: new Date(dateRange.from);
			to.setHours(23, 59, 59, 999);
			list = list.filter((o) => {
				const d = new Date(o.eventDate);
				return d >= from && d <= to;
			});
		}
		list = [...list].sort((a, b) => {
			switch (sortBy) {
				case "date_asc":
					return (
						new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
					);
				case "total_desc":
					return b.total - a.total;
				case "total_asc":
					return a.total - b.total;
				case "name_asc":
					return a.customer.localeCompare(b.customer);
				case "name_desc":
					return b.customer.localeCompare(a.customer);
				default:
					return (
						new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
					);
			}
		});
		return list;
	}, [searchQuery, statusFilter, dateRange, sortBy]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const paginated = filtered.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	return (
		<>
			<ErpHeader
				breadcrumbs={[
					{ label: "Dashboard", href: "/user/admin/dashboard" },
					{ label: "Semua Pesanan" },
				]}
				notificationCount={5}
			/>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="font-quick font-bold text-2xl text-neutral-900">
						Semua Pesanan
					</h1>
					<p className="font-sans text-sm text-neutral-500 mt-1">
						Kelola seluruh pesanan di platform
					</p>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
					<StatCard
						label="Total Pesanan"
						value={String(orders.length)}
						icon={<ClipboardList className="w-5 h-5" />}
						variant="blue"
					/>
					<StatCard
						label="Pesanan Lunas"
						value={String(
							orders.filter(
								(o) =>
									o.paymentStatus === "settlement" ||
									o.paymentStatus === "fully_paid" ||
									o.paymentStatus === "dp_paid",
							).length,
						)}
						icon={<ClipboardList className="w-5 h-5" />}
						variant="green"
					/>
					<StatCard
						label="Total Revenue"
						value={formatCurrency(totalRevenue)}
						icon={<ClipboardList className="w-5 h-5" />}
						variant="blue"
					/>
				</div>
				<div className="bg-white rounded-lg border border-neutral-200">
					<div className="flex flex-wrap gap-2 p-4 items-center border-b border-neutral-100">
						<div className="relative flex-1 min-w-[180px]">
							<Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
							<Input
								placeholder="Cari pesanan..."
								className="pl-9 h-9 text-sm"
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setCurrentPage(1);
								}}
							/>
						</div>
						<Select
							value={statusFilter}
							onValueChange={(v) => {
								setStatusFilter(v as StatusFilter);
								setCurrentPage(1);
							}}
						>
							<SelectTrigger className="w-40 h-9 text-xs">
								<SelectValue placeholder="Semua Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Semua Status</SelectItem>
								<SelectItem value="pending">Menunggu Bayar</SelectItem>
								<SelectItem value="dp_pending">Menunggu DP</SelectItem>
								<SelectItem value="dp_paid">DP Diterima</SelectItem>
								<SelectItem value="settlement">Lunas</SelectItem>
								<SelectItem value="fully_paid">Lunas Penuh</SelectItem>
								<SelectItem value="failed">Gagal</SelectItem>
								<SelectItem value="cancelled">Dibatalkan</SelectItem>
								<SelectItem value="expired">Kadaluarsa</SelectItem>
								<SelectItem value="dp_refunded">DP Direfund</SelectItem>
							</SelectContent>
						</Select>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className={cn(
										"font-sans text-xs gap-2 h-9 text-neutral-500",
										dateRange && "border-c-blue text-c-blue",
									)}
								>
									<CalendarIcon className="w-3.5 h-3.5" />
									{dateRange?.from
										? dateRange.to
											? `${format(dateRange.from, "dd MMM yyyy", { locale: id })} - ${format(dateRange.to, "dd MMM yyyy", { locale: id })}`
											: format(dateRange.from, "dd MMM yyyy", { locale: id })
										: "Pilih Tanggal"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									initialFocus
									mode="range"
									defaultMonth={dateRange?.from}
									selected={dateRange}
									onSelect={(range) => {
										setDateRange(range);
										setCurrentPage(1);
									}}
									numberOfMonths={1}
									locale={id}
								/>
							</PopoverContent>
						</Popover>
						<Select
							value={sortBy}
							onValueChange={(v) => {
								setSortBy(v as SortBy);
								setCurrentPage(1);
							}}
						>
							<SelectTrigger className="w-44 h-9 text-xs">
								<SelectValue placeholder="Urutkan" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="date_desc">Tanggal Terbaru</SelectItem>
								<SelectItem value="date_asc">Tanggal Terlama</SelectItem>
								<SelectItem value="total_desc">Total Tertinggi</SelectItem>
								<SelectItem value="total_asc">Total Terendah</SelectItem>
								<SelectItem value="name_asc">Nama (A-Z)</SelectItem>
								<SelectItem value="name_desc">Nama (Z-A)</SelectItem>
							</SelectContent>
						</Select>
						<div className="flex gap-2 ml-auto">
							<Button
								variant="outline"
								size="sm"
								className="font-sans text-xs gap-1.5 h-9"
							>
								<Download className="w-3.5 h-3.5" />
								CSV
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="font-sans text-xs gap-1.5 h-9"
							>
								<FileSpreadsheet className="w-3.5 h-3.5" />
								XLSX
							</Button>
						</div>
						{hasActiveFilters && (
							<Button
								variant="ghost"
								size="sm"
								onClick={resetFilters}
								className="h-9 text-xs text-neutral-500 hover:text-neutral-900 gap-1.5"
							>
								<RotateCcw className="w-3.5 h-3.5" />
								Reset Filter
							</Button>
						)}
					</div>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>No. Order</TableHead>
									<TableHead>Customer</TableHead>
									<TableHead>Produk</TableHead>
									<TableHead>Vendor</TableHead>
									<TableHead className="text-right">Total</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Tgl Event</TableHead>
									<TableHead className="text-center">Aksi</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginated.map((o) => (
									<TableRow key={o.id}>
										<TableCell className="font-mono text-xs text-neutral-600">
											{o.orderId}
										</TableCell>
										<TableCell className="font-sans text-sm text-neutral-900">
											{o.customer}
										</TableCell>
										<TableCell className="font-sans text-sm text-neutral-700 max-w-[180px] truncate">
											{o.product}
										</TableCell>
										<TableCell className="font-sans text-xs text-neutral-500">
											{o.vendorName ?? "—"}
										</TableCell>
										<TableCell className="font-quick font-semibold text-sm text-right">
											{formatCurrency(o.total)}
										</TableCell>
										<TableCell>
											<StatusBadge status={o.paymentStatus} />
										</TableCell>
										<TableCell className="font-sans text-xs text-neutral-500">
											{formatDate(o.eventDate)}
										</TableCell>
										<TableCell className="text-center">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
													>
														<MoreVertical className="w-4 h-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-44">
													<DropdownMenuItem className="font-sans text-xs gap-2 cursor-pointer">
														<Eye className="w-3.5 h-3.5" />
														Lihat Detail
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem className="font-sans text-xs gap-2 cursor-pointer">
														<PencilLine className="w-3.5 h-3.5" />
														Ubah Status
													</DropdownMenuItem>
													<DropdownMenuItem className="font-sans text-xs gap-2 cursor-pointer">
														<FileText className="w-3.5 h-3.5" />
														Unduh Invoice
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
								{paginated.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={8}
											className="text-center font-sans text-sm text-neutral-400 py-16"
										>
											Tidak ada pesanan ditemukan.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						totalItems={filtered.length}
						pageSize={pageSize}
						onPageChange={(page) => setCurrentPage(page)}
					/>
				</div>
			</div>
		</>
	);
}
