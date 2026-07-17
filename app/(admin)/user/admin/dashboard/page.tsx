"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
	CalendarIcon,
	DollarSign,
	Download,
	RotateCcw,
	Search,
	ShoppingCart,
	Store,
	TrendingUp,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AreaChartComponent } from "@/components/ui/chart";
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
import { cn, formatCurrency } from "@/lib/utils";

const platformRevenue = [
	{ label: "Jan", revenue: 12500000, commission: 1250000 },
	{ label: "Feb", revenue: 14800000, commission: 1480000 },
	{ label: "Mar", revenue: 13200000, commission: 1320000 },
	{ label: "Apr", revenue: 18900000, commission: 1890000 },
	{ label: "Mei", revenue: 17500000, commission: 1750000 },
	{ label: "Jun", revenue: 22100000, commission: 2210000 },
	{ label: "Jul", revenue: 25600000, commission: 2560000 },
];

const vendors = [
	{
		id: "v-001",
		name: "Jakarta Audio Pro",
		productCount: 3,
		totalRevenue: 22500000,
		status: "approved" as const,
	},
	{
		id: "v-002",
		name: "Bandung Visual Story",
		productCount: 2,
		totalRevenue: 9500000,
		status: "approved" as const,
	},
	{
		id: "v-003",
		name: "Surabaya Decor House",
		productCount: 1,
		totalRevenue: 14000000,
		status: "pending" as const,
	},
	{
		id: "v-004",
		name: "Jogja Talent House",
		productCount: 1,
		totalRevenue: 0,
		status: "approved" as const,
	},
];

const totalPlatformRevenue = orders
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
type SortBy = "date_desc" | "date_asc" | "total_desc" | "total_asc";

export default function AdminDashboardV2Page() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
	const [sortBy, setSortBy] = useState<SortBy>("date_desc");
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 5;

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
			<ErpHeader breadcrumbs={[{ label: "Dashboard" }]} notificationCount={5} />
			<div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="font-quick font-bold text-3xl text-neutral-900 tracking-tight">
							Dashboard Admin
						</h1>
						<p className="font-sans text-sm text-neutral-500 mt-1">
							Selamat datang, Admin &#x2014; berikut ikhtisar platform Celeparty
						</p>
					</div>
					<Button variant="outline" size="sm">
						<Download className="w-4 h-4 mr-2" />
						Unduh Laporan
					</Button>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-sans font-medium text-neutral-500">
								Total Revenue
							</CardTitle>
							<div className="w-9 h-9 rounded-lg bg-c-blue-50 flex items-center justify-center">
								<DollarSign className="w-4 h-4 text-c-blue" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-quick font-bold text-neutral-900">
								{formatCurrency(totalPlatformRevenue)}
							</div>
							<p className="text-xs font-sans text-neutral-500 mt-1 flex items-center gap-1">
								<TrendingUp className="w-3.5 h-3.5 text-status-success" />
								<span className="text-status-success font-medium">+15.8%</span>
								dari bulan lalu
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-sans font-medium text-neutral-500">
								Total Pesanan
							</CardTitle>
							<div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
								<ShoppingCart className="w-4 h-4 text-amber-600" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-quick font-bold text-neutral-900">
								{orders.length}
							</div>
							<p className="text-xs font-sans text-neutral-500 mt-1 flex items-center gap-1">
								<TrendingUp className="w-3.5 h-3.5 text-status-success" />
								<span className="text-status-success font-medium">+7</span>bulan
								ini
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-sans font-medium text-neutral-500">
								Vendor Aktif
							</CardTitle>
							<div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
								<Store className="w-4 h-4 text-emerald-600" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-quick font-bold text-neutral-900">
								{vendors.length}
							</div>
							<p className="text-xs font-sans text-neutral-500 mt-1">
								{vendors.filter((v) => v.status === "pending").length} menunggu
								verifikasi
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-sans font-medium text-neutral-500">
								Pengguna
							</CardTitle>
							<div className="w-9 h-9 rounded-lg bg-c-blue-50 flex items-center justify-center">
								<Users className="w-4 h-4 text-c-blue" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-quick font-bold text-neutral-900">
								12
							</div>
							<p className="text-xs font-sans text-neutral-500 mt-1 flex items-center gap-1">
								<TrendingUp className="w-3.5 h-3.5 text-status-success" />
								<span className="text-status-success font-medium">+5</span>
								minggu ini
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-6 md:grid-cols-7">
					<Card className="md:col-span-4">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Revenue Platform</CardTitle>
									<CardDescription>
										Total transaksi dan komisi platform per bulan
									</CardDescription>
								</div>
								<Button variant="outline" size="sm">
									<Download className="w-4 h-4 mr-2" />
									CSV
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<AreaChartComponent
								data={platformRevenue}
								config={{
									revenue: { label: "Revenue", color: "#3E2882" },
									commission: { label: "Komisi", color: "#CBD002" },
								}}
							/>
						</CardContent>
					</Card>
					<Card className="md:col-span-3">
						<CardHeader>
							<CardTitle>Vendor Teratas</CardTitle>
							<CardDescription>
								Berdasarkan total pendapatan bulan ini
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{vendors.map((vendor) => (
									<div key={vendor.id} className="flex items-center gap-4">
										<div className="w-9 h-9 rounded-full bg-c-blue-50 flex items-center justify-center shrink-0">
											<span className="font-quick font-bold text-xs text-c-blue">
												{vendor.name.charAt(0)}
											</span>
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<p className="font-sans font-medium text-sm text-neutral-900 truncate">
													{vendor.name}
												</p>
												{vendor.status === "pending" && (
													<span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-amber-50 text-amber-700">
														Menunggu
													</span>
												)}
											</div>
											<p className="font-sans text-xs text-neutral-500">
												{vendor.productCount} produk
											</p>
										</div>
										<div className="text-right">
											<p className="font-quick font-semibold text-sm text-neutral-900">
												{formatCurrency(vendor.totalRevenue)}
											</p>
											<p className="font-sans text-xs text-neutral-500">
												total
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>Semua Pesanan</CardTitle>
							<CardDescription>
								Seluruh pesanan di platform Celeparty
							</CardDescription>
						</div>
						<Button variant="outline" size="sm">
							<Download className="w-4 h-4 mr-2" />
							Export
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-wrap gap-2 items-center">
							<div className="relative flex-1 min-w-[180px]">
								<Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
								<Input
									placeholder="Cari pesanan..."
									value={searchQuery}
									onChange={(e) => {
										setSearchQuery(e.target.value);
										setCurrentPage(1);
									}}
									className="pl-9 h-9 text-sm"
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
								</SelectContent>
							</Select>
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
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Customer</TableHead>
									<TableHead>Produk</TableHead>
									<TableHead>Vendor</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Total</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginated.map((order) => (
									<TableRow key={order.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 rounded-full bg-c-blue-50 flex items-center justify-center">
													<span className="font-quick font-bold text-xs text-c-blue">
														{order.customer.charAt(0)}
													</span>
												</div>
												<div>
													<p className="font-sans font-medium text-sm text-neutral-900">
														{order.customer}
													</p>
													<p className="font-mono text-xs text-neutral-500">
														{order.orderId}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<p className="font-sans text-sm text-neutral-700 max-w-[200px] truncate">
												{order.product}
											</p>
											<p className="font-sans text-xs text-neutral-500">
												{order.variant}
											</p>
										</TableCell>
										<TableCell>
											<p className="font-sans text-sm text-neutral-700">
												{order.vendorName ?? "—"}
											</p>
										</TableCell>
										<TableCell>
											<StatusBadge status={order.paymentStatus} />
										</TableCell>
										<TableCell className="text-right">
											<p className="font-quick font-semibold text-sm text-neutral-900">
												{formatCurrency(order.total)}
											</p>
										</TableCell>
									</TableRow>
								))}
								{paginated.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center font-sans text-sm text-neutral-400 py-12"
										>
											Tidak ada pesanan ditemukan.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							totalItems={filtered.length}
							pageSize={pageSize}
							onPageChange={(page) => setCurrentPage(page)}
						/>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
