"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
	CalendarIcon,
	CheckCircle,
	ExternalLink,
	Eye,
	MoreVertical,
	RotateCcw,
	Search,
	Store,
	XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { StatCard } from "@/components/dashboard/StatCard";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

type Vendor = {
	id: string;
	name: string;
	email: string;
	city: string;
	status: "approved" | "pending" | "rejected";
	products: number;
	joinDate: string;
};

const initialVendors: Vendor[] = [
	{
		id: "v-001",
		name: "Jakarta Audio Pro",
		email: "vendor@celeparty.com",
		city: "Jakarta",
		status: "approved",
		products: 3,
		joinDate: "2026-06-15",
	},
	{
		id: "v-002",
		name: "Bandung Visual Story",
		email: "bandung@celeparty.com",
		city: "Bandung",
		status: "approved",
		products: 2,
		joinDate: "2026-06-20",
	},
	{
		id: "v-003",
		name: "Surabaya Decor House",
		email: "surabaya@celeparty.com",
		city: "Surabaya",
		status: "pending",
		products: 1,
		joinDate: "2026-07-01",
	},
	{
		id: "v-004",
		name: "Jogja Talent House",
		email: "jogja@celeparty.com",
		city: "Yogyakarta",
		status: "pending",
		products: 1,
		joinDate: "2026-07-05",
	},
];

type StatusFilter = "all" | "approved" | "pending";
type SortBy =
	| "name_asc"
	| "name_desc"
	| "products_desc"
	| "products_asc"
	| "date_desc"
	| "date_asc";

export default function AdminVendorsPage() {
	const [vendorList, setVendorList] = useState<Vendor[]>(initialVendors);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [cityFilter, setCityFilter] = useState<string>("all");
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
	const [sortBy, setSortBy] = useState<SortBy>("date_desc");
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 5;

	const cities = useMemo(
		() => [...new Set(vendorList.map((v) => v.city))].sort(),
		[vendorList],
	);

	const hasActiveFilters =
		searchQuery !== "" ||
		statusFilter !== "all" ||
		cityFilter !== "all" ||
		dateRange !== undefined ||
		sortBy !== "date_desc";

	const resetFilters = () => {
		setSearchQuery("");
		setStatusFilter("all");
		setCityFilter("all");
		setDateRange(undefined);
		setSortBy("date_desc");
		setCurrentPage(1);
	};

	const handleApprove = (id: string) => {
		setVendorList((prev) =>
			prev.map((v) =>
				v.id === id ? { ...v, status: "approved" as const } : v,
			),
		);
	};

	const handleReject = (id: string) => {
		setVendorList((prev) =>
			prev.map((v) =>
				v.id === id ? { ...v, status: "rejected" as const } : v,
			),
		);
	};

	const filtered = useMemo(() => {
		let list = vendorList;
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			list = list.filter(
				(v) =>
					v.name.toLowerCase().includes(q) ||
					v.email.toLowerCase().includes(q) ||
					v.city.toLowerCase().includes(q),
			);
		}
		if (statusFilter !== "all") {
			list = list.filter((v) => v.status === statusFilter);
		}
		if (cityFilter !== "all") {
			list = list.filter((v) => v.city === cityFilter);
		}
		if (dateRange?.from) {
			const from = new Date(dateRange.from);
			from.setHours(0, 0, 0, 0);
			const to = dateRange.to
				? new Date(dateRange.to)
				: new Date(dateRange.from);
			to.setHours(23, 59, 59, 999);
			list = list.filter((v) => {
				const d = new Date(v.joinDate);
				return d >= from && d <= to;
			});
		}
		list = [...list].sort((a, b) => {
			switch (sortBy) {
				case "name_asc":
					return a.name.localeCompare(b.name);
				case "name_desc":
					return b.name.localeCompare(a.name);
				case "products_desc":
					return b.products - a.products;
				case "products_asc":
					return a.products - b.products;
				case "date_asc":
					return (
						new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
					);
				default:
					return (
						new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
					);
			}
		});
		return list;
	}, [vendorList, searchQuery, statusFilter, cityFilter, dateRange, sortBy]);

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
					{ label: "Vendor" },
				]}
			/>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="font-quick font-bold text-2xl text-neutral-900">
						Vendor
					</h1>
					<p className="font-sans text-sm text-neutral-500 mt-1">
						Kelola semua vendor di platform
					</p>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
					<StatCard
						label="Total Vendor"
						value={String(vendorList.length)}
						icon={<Store className="w-5 h-5" />}
						variant="blue"
					/>
					<StatCard
						label="Aktif"
						value={String(
							vendorList.filter((v) => v.status === "approved").length,
						)}
						icon={<CheckCircle className="w-5 h-5" />}
						variant="green"
					/>
					<StatCard
						label="Menunggu"
						value={String(
							vendorList.filter((v) => v.status === "pending").length,
						)}
						icon={<Store className="w-5 h-5" />}
						variant="amber"
					/>
				</div>
				<div className="bg-white rounded-lg border border-neutral-200">
					<div className="flex flex-wrap gap-2 p-4 items-center border-b border-neutral-100">
						<div className="relative flex-1 min-w-[180px]">
							<Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
							<Input
								placeholder="Cari vendor..."
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
								<SelectItem value="approved">Dikonfirmasi</SelectItem>
								<SelectItem value="pending">Menunggu</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={cityFilter}
							onValueChange={(v) => {
								setCityFilter(v);
								setCurrentPage(1);
							}}
						>
							<SelectTrigger className="w-36 h-9 text-xs">
								<SelectValue placeholder="Semua Kota" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Semua Kota</SelectItem>
								{cities.map((c) => (
									<SelectItem key={c} value={c}>
										{c}
									</SelectItem>
								))}
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
										: "Tgl Bergabung"}
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
								<SelectItem value="name_asc">Nama (A-Z)</SelectItem>
								<SelectItem value="name_desc">Nama (Z-A)</SelectItem>
								<SelectItem value="products_desc">Produk Terbanyak</SelectItem>
								<SelectItem value="products_asc">Produk Tersedikit</SelectItem>
								<SelectItem value="date_desc">Tgl Bergabung Terbaru</SelectItem>
								<SelectItem value="date_asc">Tgl Bergabung Terlama</SelectItem>
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
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Vendor</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Kota</TableHead>
									<TableHead className="text-center">Produk</TableHead>
									<TableHead className="text-center">Status</TableHead>
									<TableHead className="text-center">Aksi</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginated.map((vendor) => (
									<TableRow key={vendor.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 rounded-lg bg-c-blue flex items-center justify-center">
													<span className="font-quick font-bold text-white text-xs">
														{vendor.name.charAt(0)}
														{vendor.name.split(" ")[1]?.charAt(0) || ""}
													</span>
												</div>
												<span className="font-sans font-medium text-sm text-neutral-900">
													{vendor.name}
												</span>
											</div>
										</TableCell>
										<TableCell className="font-sans text-xs text-neutral-600">
											{vendor.email}
										</TableCell>
										<TableCell className="font-sans text-xs text-neutral-600">
											{vendor.city}
										</TableCell>
										<TableCell className="font-quick font-semibold text-sm text-neutral-900 text-center">
											{vendor.products}
										</TableCell>
										<TableCell className="text-center">
											<Badge
												variant={
													vendor.status === "approved"
														? "success"
														: vendor.status === "rejected"
															? "destructive"
															: "pending"
												}
											>
												{vendor.status === "approved"
													? "Dikonfirmasi"
													: vendor.status === "rejected"
														? "Ditolak"
														: "Menunggu"}
											</Badge>
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
														Lihat Profil Vendor
													</DropdownMenuItem>
													<DropdownMenuItem className="font-sans text-xs gap-2 cursor-pointer">
														<ExternalLink className="w-3.5 h-3.5" />
														Hubungi Vendor
													</DropdownMenuItem>
													{vendor.status === "pending" && (
														<>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																className="font-sans text-xs gap-2 text-emerald-600 cursor-pointer"
																onClick={() => handleApprove(vendor.id)}
															>
																<CheckCircle className="w-3.5 h-3.5" />
																Setujui Vendor
															</DropdownMenuItem>
															<DropdownMenuItem
																className="font-sans text-xs gap-2 text-c-red cursor-pointer"
																onClick={() => handleReject(vendor.id)}
															>
																<XCircle className="w-3.5 h-3.5" />
																Tolak Vendor
															</DropdownMenuItem>
														</>
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
								{paginated.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center font-sans text-sm text-neutral-400 py-16"
										>
											Tidak ada vendor ditemukan.
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
