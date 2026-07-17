"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
	Ban,
	CalendarIcon,
	Eye,
	MoreVertical,
	RotateCcw,
	Search,
	Shield,
	User,
	UserCog,
	Users,
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

type UserEntry = {
	id: string;
	name: string;
	email: string;
	role: "customer" | "admin";
	phone: string;
	joinDate: string;
};

const initialUsers: UserEntry[] = [
	{
		id: "u-001",
		name: "Budi Santoso",
		email: "customer@celeparty.com",
		role: "customer",
		phone: "081234567890",
		joinDate: "2026-06-10",
	},
	{
		id: "u-002",
		name: "Siti Nurhaliza",
		email: "siti@celeparty.com",
		role: "customer",
		phone: "081298765432",
		joinDate: "2026-06-15",
	},
	{
		id: "u-003",
		name: "Ahmad Fauzi",
		email: "ahmad@celeparty.com",
		role: "customer",
		phone: "081355566677",
		joinDate: "2026-07-01",
	},
	{
		id: "u-004",
		name: "Dimas Aryo",
		email: "dimas@celeparty.com",
		role: "admin",
		phone: "081388899900",
		joinDate: "2026-06-01",
	},
];

type RoleFilter = "all" | "customer" | "admin";
type SortBy = "name_asc" | "name_desc" | "date_desc" | "date_asc";

export default function AdminUsersPage() {
	const [userList, setUserList] = useState<UserEntry[]>(initialUsers);
	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
	const [sortBy, setSortBy] = useState<SortBy>("date_desc");
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 5;

	const hasActiveFilters =
		searchQuery !== "" ||
		roleFilter !== "all" ||
		dateRange !== undefined ||
		sortBy !== "date_desc";

	const resetFilters = () => {
		setSearchQuery("");
		setRoleFilter("all");
		setDateRange(undefined);
		setSortBy("date_desc");
		setCurrentPage(1);
	};

	const handleToggleRole = (id: string) => {
		setUserList((prev) =>
			prev.map((u) =>
				u.id === id
					? {
							...u,
							role:
								u.role === "admin" ? ("customer" as const) : ("admin" as const),
						}
					: u,
			),
		);
	};

	const handleDeactivate = (id: string) => {
		setUserList((prev) => prev.filter((u) => u.id !== id));
	};

	const filtered = useMemo(() => {
		let list = userList;
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			list = list.filter(
				(u) =>
					u.name.toLowerCase().includes(q) ||
					u.email.toLowerCase().includes(q) ||
					u.phone.toLowerCase().includes(q),
			);
		}
		if (roleFilter !== "all") {
			list = list.filter((u) => u.role === roleFilter);
		}
		if (dateRange?.from) {
			const from = new Date(dateRange.from);
			from.setHours(0, 0, 0, 0);
			const to = dateRange.to
				? new Date(dateRange.to)
				: new Date(dateRange.from);
			to.setHours(23, 59, 59, 999);
			list = list.filter((u) => {
				const d = new Date(u.joinDate);
				return d >= from && d <= to;
			});
		}
		list = [...list].sort((a, b) => {
			switch (sortBy) {
				case "name_asc":
					return a.name.localeCompare(b.name);
				case "name_desc":
					return b.name.localeCompare(a.name);
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
	}, [userList, searchQuery, roleFilter, dateRange, sortBy]);

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
					{ label: "Pengguna" },
				]}
			/>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="font-quick font-bold text-2xl text-neutral-900">
						Pengguna
					</h1>
					<p className="font-sans text-sm text-neutral-500 mt-1">
						Kelola semua pengguna platform
					</p>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
					<StatCard
						label="Total Pengguna"
						value={String(userList.length)}
						icon={<Users className="w-5 h-5" />}
						variant="blue"
					/>
					<StatCard
						label="Customer"
						value={String(userList.filter((u) => u.role === "customer").length)}
						icon={<User className="w-5 h-5" />}
						variant="green"
					/>
					<StatCard
						label="Admin"
						value={String(userList.filter((u) => u.role === "admin").length)}
						icon={<Shield className="w-5 h-5" />}
						variant="amber"
					/>
				</div>
				<div className="bg-white rounded-lg border border-neutral-200">
					<div className="flex flex-wrap gap-2 p-4 items-center border-b border-neutral-100">
						<div className="relative flex-1 min-w-[180px]">
							<Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
							<Input
								placeholder="Cari pengguna..."
								className="pl-9 h-9 text-sm"
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setCurrentPage(1);
								}}
							/>
						</div>
						<Select
							value={roleFilter}
							onValueChange={(v) => {
								setRoleFilter(v as RoleFilter);
								setCurrentPage(1);
							}}
						>
							<SelectTrigger className="w-36 h-9 text-xs">
								<SelectValue placeholder="Semua Role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Semua Role</SelectItem>
								<SelectItem value="customer">Customer</SelectItem>
								<SelectItem value="admin">Admin</SelectItem>
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
										: "Tgl Daftar"}
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
								<SelectItem value="date_desc">Tgl Daftar Terbaru</SelectItem>
								<SelectItem value="date_asc">Tgl Daftar Terlama</SelectItem>
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
									<TableHead>Nama</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>No. HP</TableHead>
									<TableHead className="text-center">Role</TableHead>
									<TableHead>Tgl Daftar</TableHead>
									<TableHead className="text-center">Aksi</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginated.map((user) => (
									<TableRow key={user.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 rounded-full bg-c-blue-100 flex items-center justify-center">
													<span className="font-quick font-bold text-c-blue text-xs">
														{user.name.charAt(0)}
													</span>
												</div>
												<span className="font-sans font-medium text-sm text-neutral-900">
													{user.name}
												</span>
											</div>
										</TableCell>
										<TableCell className="font-sans text-xs text-neutral-600">
											{user.email}
										</TableCell>
										<TableCell className="font-sans text-xs text-neutral-600">
											{user.phone}
										</TableCell>
										<TableCell className="text-center">
											<Badge
												variant={
													user.role === "admin" ? "default" : "secondary"
												}
											>
												{user.role === "admin" ? "Admin" : "Customer"}
											</Badge>
										</TableCell>
										<TableCell className="font-sans text-xs text-neutral-500">
											{new Date(user.joinDate).toLocaleDateString("id-ID", {
												day: "numeric",
												month: "long",
												year: "numeric",
											})}
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
													<DropdownMenuItem
														className="font-sans text-xs gap-2 cursor-pointer"
														onClick={() => handleToggleRole(user.id)}
													>
														<UserCog className="w-3.5 h-3.5" />
														{user.role === "admin"
															? "Jadikan Customer"
															: "Jadikan Admin"}
													</DropdownMenuItem>
													<DropdownMenuItem
														className="font-sans text-xs gap-2 text-c-red cursor-pointer"
														onClick={() => handleDeactivate(user.id)}
													>
														<Ban className="w-3.5 h-3.5" />
														Nonaktifkan Pengguna
													</DropdownMenuItem>
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
											Tidak ada pengguna ditemukan.
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
