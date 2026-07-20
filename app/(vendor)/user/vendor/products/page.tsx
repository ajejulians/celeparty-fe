"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type RowSelectionState,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	Eye,
	ImageOff,
	Package,
	Pencil,
	Plus,
	RotateCcw,
	Search,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { EditProductDialog } from "@/components/product/EditProductDialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Product } from "@/lib/data";
import { useSession, withAuth } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";
import { useVendorProductStore } from "@/lib/vendor-product-store";

function ProductThumb({ product }: { product: Product }) {
	const [failed, setFailed] = useState(false);

	if (!product.imageUrl || failed) {
		return (
			<div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
				<ImageOff className="w-4 h-4 text-slate-400" />
			</div>
		);
	}

	return (
		<img
			src={product.imageUrl}
			alt={product.name}
			className="w-12 h-12 rounded-lg object-cover border border-neutral-100 shrink-0"
			onError={() => setFailed(true)}
		/>
	);
}

function VendorProductsPage() {
	const session = useSession();
	const storeProducts = useVendorProductStore((s) => s.products);
	const fetchVendorProducts = useVendorProductStore((s) => s.fetchVendorProducts);
	const openEditModal = useVendorProductStore((s) => s.openEditModal);
	const deleteProducts = useVendorProductStore((s) => s.deleteProducts);
	const updateProductStatus = useVendorProductStore(
		(s) => s.updateProductStatus,
	);

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [globalFilter, setGlobalFilter] = useState("");
	const pageSize = 10;
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [deleteDialog, setDeleteDialog] = useState<{
		open: boolean;
		slugs: string[];
		isMultiple: boolean;
	}>({ open: false, slugs: [], isMultiple: false });
	const [statusDialog, setStatusDialog] = useState<{
		open: boolean;
		slugs: string[];
	}>({ open: false, slugs: [] });
	const [selectedBulkStatus, setSelectedBulkStatus] =
		useState<Product["status"]>("active");

	useEffect(() => {
		if (!session.vendorId) return;
		fetchVendorProducts(session.vendorId);
	}, [session.vendorId, fetchVendorProducts]);

	const products = storeProducts;

	const hasActiveFilters =
		globalFilter !== "" ||
		columnFilters.some((f) => f.id === "category" || f.id === "status");

	const resetFilters = useCallback(() => {
		setGlobalFilter("");
		setColumnFilters((prev) =>
			prev.filter((f) => f.id !== "category" && f.id !== "status"),
		);
	}, []);

	const columns = useMemo<ColumnDef<Product>[]>(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
						aria-label="Select all"
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
					/>
				),
				enableSorting: false,
			},
			{
				accessorKey: "name",
				header: ({ column }) => (
					<button
						className="inline-flex items-center gap-1 font-sans font-semibold text-xs text-neutral-500 uppercase tracking-wide hover:text-neutral-700"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Produk
						{column.getIsSorted() === "asc" ? (
							<ArrowUp className="w-3 h-3" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowDown className="w-3 h-3" />
						) : (
							<ArrowUpDown className="w-3 h-3" />
						)}
					</button>
				),
				cell: ({ row }) => {
					const p = row.original;
					return (
						<div className="flex items-center gap-3">
							<ProductThumb product={p} />
							<div className="min-w-0">
								<div className="flex items-center gap-2 flex-wrap">
									<p className="font-quick font-semibold text-sm text-neutral-900 line-clamp-1">
										{p.name}
									</p>
									{p.isNegotiable && (
										<Badge
											variant="success"
											className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 border-green-200 shrink-0"
										>
											Bisa Nego
										</Badge>
									)}
								</div>
								<p className="font-sans text-xs text-neutral-400 mt-0.5">
									{p.category}
								</p>
							</div>
						</div>
					);
				},
				enableColumnFilter: true,
			},
			{
				accessorKey: "category",
				header: "Kategori",
				cell: ({ row }) => (
					<span className="font-sans text-xs text-neutral-600">
						{row.original.category}
					</span>
				),
			},
			{
				accessorKey: "priceFrom",
				header: ({ column }) => (
					<button
						className="inline-flex items-center gap-1 font-sans font-semibold text-xs text-neutral-500 uppercase tracking-wide hover:text-neutral-700"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Harga Sewa
						{column.getIsSorted() === "asc" ? (
							<ArrowUp className="w-3 h-3" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowDown className="w-3 h-3" />
						) : (
							<ArrowUpDown className="w-3 h-3" />
						)}
					</button>
				),
				cell: ({ row }) => (
					<div className="text-right font-quick font-semibold text-sm text-neutral-900 whitespace-nowrap">
						{formatCurrency(row.original.priceFrom)}
						<span className="font-sans font-normal text-xs text-neutral-400 ml-1">
							/ {row.original.rentalUnit}
						</span>
					</div>
				),
			},
			{
				accessorKey: "stock",
				header: ({ column }) => (
					<button
						className="inline-flex items-center gap-1 font-sans font-semibold text-xs text-neutral-500 uppercase tracking-wide hover:text-neutral-700"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Stok
						{column.getIsSorted() === "asc" ? (
							<ArrowUp className="w-3 h-3" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowDown className="w-3 h-3" />
						) : (
							<ArrowUpDown className="w-3 h-3" />
						)}
					</button>
				),
				cell: ({ row }) => {
					const p = row.original;
					return (
						<span className="text-center block font-quick font-semibold text-sm">
							<span
								className={p.stock === 0 ? "text-c-red" : "text-neutral-900"}
							>
								{p.stock}
							</span>
							<span className="text-neutral-400 font-sans font-normal">
								{" "}
								/ {p.totalStock}
							</span>
						</span>
					);
				},
			},
			{
				accessorKey: "date",
				header: ({ column }) => (
					<button
						className="inline-flex items-center gap-1 font-sans font-semibold text-xs text-neutral-500 uppercase tracking-wide hover:text-neutral-700"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Tanggal
						{column.getIsSorted() === "asc" ? (
							<ArrowUp className="w-3 h-3" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowDown className="w-3 h-3" />
						) : (
							<ArrowUpDown className="w-3 h-3" />
						)}
					</button>
				),
				cell: ({ row }) => (
					<span className="font-sans text-xs text-neutral-600">
						{new Date(row.original.date).toLocaleDateString("id-ID", {
							day: "numeric",
							month: "short",
							year: "numeric",
						})}
					</span>
				),
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: ({ row }) => (
					<div className="flex justify-center">
						<StatusBadge status={row.original.status} />
					</div>
				),
				filterFn: "equalsString",
			},
			{
				id: "actions",
				header: () => <span className="block text-center">Aksi</span>,
				cell: ({ row }) => (
					<div className="flex justify-center gap-1">
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue transition-colors"
									onClick={() => {
										openEditModal(row.original);
										setIsEditOpen(true);
									}}
									aria-label="Edit produk"
								>
									<Pencil className="w-4 h-4" />
								</button>
							</TooltipTrigger>
							<TooltipContent>Edit</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={`/products/${row.original.slug}`}
									className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue transition-colors inline-flex"
									aria-label="Lihat produk"
								>
									<Eye className="w-4 h-4" />
								</Link>
							</TooltipTrigger>
							<TooltipContent>Lihat</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									className="p-1.5 rounded-md text-neutral-500 hover:bg-red-50 hover:text-c-red transition-colors"
									onClick={() =>
										setDeleteDialog({
											open: true,
											slugs: [row.original.slug],
											isMultiple: false,
										})
									}
									aria-label="Hapus produk"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</TooltipTrigger>
							<TooltipContent>Hapus</TooltipContent>
						</Tooltip>
					</div>
				),
				enableSorting: false,
			},
		],
		[openEditModal],
	);

	const table = useReactTable({
		data: products,
		columns,
		state: {
			sorting,
			columnFilters,
			rowSelection,
			globalFilter,
		},
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableRowSelection: true,
	});

	const selectedSlugs = useMemo(() => {
		return table.getSelectedRowModel().rows.map((r) => r.original.slug);
	}, [table.getSelectedRowModel]);

	const handleBulkDelete = useCallback(() => {
		if (selectedSlugs.length === 0) return;
		setDeleteDialog({ open: true, slugs: selectedSlugs, isMultiple: true });
	}, [selectedSlugs]);

	const confirmDelete = useCallback(() => {
		deleteProducts(deleteDialog.slugs);
		setRowSelection({});
		setDeleteDialog({ open: false, slugs: [], isMultiple: false });
		table.resetRowSelection();
		toast.success(
			deleteDialog.isMultiple
				? `${deleteDialog.slugs.length} produk berhasil dihapus.`
				: "Produk berhasil dihapus.",
		);
	}, [deleteDialog, deleteProducts, table]);

	const handleBulkStatus = useCallback(() => {
		if (selectedSlugs.length === 0) return;
		setSelectedBulkStatus("active");
		setStatusDialog({ open: true, slugs: selectedSlugs });
	}, [selectedSlugs]);

	const confirmStatus = useCallback(
		(status: Product["status"]) => {
			updateProductStatus(statusDialog.slugs, status);
			setRowSelection({});
			setStatusDialog({ open: false, slugs: [] });
			table.resetRowSelection();
			toast.success(
				`Status ${statusDialog.slugs.length} produk berhasil diubah.`,
			);
		},
		[statusDialog, updateProductStatus, table],
	);

	const handlePageChange = useCallback(
		(page: number) => table.setPageIndex(page - 1),
		[table],
	);

	const totalProducts = products.length;
	const activeProducts = products.filter((p) => p.status === "active").length;
	const inactiveProducts = products.filter((p) => p.status !== "active").length;

	return (
		<>
			<ErpHeader
				breadcrumbs={[
					{ label: "Dashboard", href: "/user/vendor/dashboard" },
					{ label: "Produk & Jasa" },
				]}
			/>
			<div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center justify-between flex-wrap gap-4 mb-8">
					<div>
						<h1 className="font-quick font-bold text-2xl text-neutral-900">
							Produk &amp; Jasa
						</h1>
						<p className="font-sans text-sm text-neutral-500 mt-1">
							Kelola produk sewa dan jasa vendor Anda
						</p>
					</div>
					<Link
						href="/user/vendor/products/add-product"
						className={buttonVariants({ size: "default", className: "gap-2" })}
					>
						<Plus className="w-4 h-4" />
						Tambah Produk
					</Link>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
					<Card>
						<CardContent className="pt-6 px-4 pb-4 flex items-center gap-4">
							<div className="w-10 h-10 rounded-lg bg-c-blue/10 flex items-center justify-center shrink-0">
								<Package className="w-5 h-5 text-c-blue" />
							</div>
							<div>
								<p className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">
									Total Produk
								</p>
								<p className="font-quick font-bold text-2xl text-neutral-900">
									{totalProducts}
								</p>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6 px-4 pb-4 flex items-center gap-4">
							<div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
								<Eye className="w-5 h-5 text-emerald-600" />
							</div>
							<div>
								<p className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">
									Produk Aktif
								</p>
								<p className="font-quick font-bold text-2xl text-neutral-900">
									{activeProducts}
								</p>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6 px-4 pb-4 flex items-center gap-4">
							<div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
								<Package className="w-5 h-5 text-red-600" />
							</div>
							<div>
								<p className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">
									Produk Tidak Aktif
								</p>
								<p className="font-quick font-bold text-2xl text-neutral-900">
									{inactiveProducts}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
					<div className="p-4 border-b border-neutral-100">
						<div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
							<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
								<div className="relative max-w-xs w-full">
									<Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
									<Input
										placeholder="Cari produk..."
										className="pl-9 text-sm h-9"
										value={globalFilter}
										onChange={(e) => setGlobalFilter(e.target.value)}
									/>
								</div>
								<Select
									value={
										(columnFilters.find((f) => f.id === "category")
											?.value as string) ?? "all"
									}
									onValueChange={(v) => {
										if (v === "all") {
											setColumnFilters((prev) =>
												prev.filter((f) => f.id !== "category"),
											);
										} else {
											setColumnFilters((prev) => [
												...prev.filter((f) => f.id !== "category"),
												{ id: "category", value: v },
											]);
										}
									}}
								>
									<SelectTrigger className="w-full sm:w-40 h-9">
										<SelectValue placeholder="Kategori" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Semua Kategori</SelectItem>
										<SelectItem value="Audio & Sound">Audio & Sound</SelectItem>
										<SelectItem value="Fotografi">Fotografi</SelectItem>
										<SelectItem value="Dekorasi">Dekorasi</SelectItem>
										<SelectItem value="Catering">Catering</SelectItem>
										<SelectItem value="Entertainment">Entertainment</SelectItem>
										<SelectItem value="Sewa Alat">Sewa Alat</SelectItem>
									</SelectContent>
								</Select>
								<Select
									value={
										(columnFilters.find((f) => f.id === "status")
											?.value as string) ?? "all"
									}
									onValueChange={(v) => {
										if (v === "all") {
											setColumnFilters((prev) =>
												prev.filter((f) => f.id !== "status"),
											);
										} else {
											setColumnFilters((prev) => [
												...prev.filter((f) => f.id !== "status"),
												{ id: "status", value: v },
											]);
										}
									}}
								>
									<SelectTrigger className="w-full sm:w-40 h-9">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Semua Status</SelectItem>
										<SelectItem value="active">Aktif</SelectItem>
										<SelectItem value="sold_out">Habis</SelectItem>
										<SelectItem value="escrow_badge">Escrow</SelectItem>
									</SelectContent>
								</Select>
								{hasActiveFilters && (
									<Button
										variant="ghost"
										size="sm"
										onClick={resetFilters}
										className="h-9 text-xs gap-1"
									>
										<RotateCcw className="w-3.5 h-3.5" />
										Reset Filter
									</Button>
								)}
							</div>

							{selectedSlugs.length > 0 && (
								<div className="flex items-center gap-2 flex-wrap">
									<span className="font-sans text-xs text-neutral-500">
										{selectedSlugs.length} dipilih
									</span>
									<Button
										variant="outline"
										size="sm"
										onClick={handleBulkStatus}
										className="h-8 text-xs"
									>
										Ubah Status
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={handleBulkDelete}
										className="h-8 text-xs"
									>
										<Trash2 className="w-3.5 h-3.5 mr-1" />
										Hapus
									</Button>
								</div>
							)}
						</div>
					</div>

					<div className="hidden md:block overflow-x-auto">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead
												key={header.id}
												className={
													header.id === "actions" ||
													header.id === "status" ||
													header.id === "select"
														? "text-center"
														: ""
												}
												style={
													header.id === "select" ? { width: 40 } : undefined
												}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows.length > 0 ? (
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() ? "selected" : undefined}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="text-center font-sans text-sm text-neutral-400 py-12"
										>
											Produk tidak ditemukan.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					<div className="md:hidden space-y-3 p-4">
						{table.getRowModel().rows.length > 0 ? (
							table.getRowModel().rows.map((row) => {
								const p = row.original;
								return (
									<Card
										key={p.slug}
										className="rounded-xl border-neutral-200 shadow-sm"
									>
										<CardContent className="p-4">
											<div className="flex items-start gap-3">
												<ProductThumb product={p} />
												<div className="flex-1 min-w-0 space-y-2">
													<div className="flex items-start justify-between gap-2">
														<div>
															<div className="flex items-center gap-2 flex-wrap">
																<p className="font-quick font-semibold text-sm text-neutral-900 line-clamp-2">
																	{p.name}
																</p>
																{p.isNegotiable && (
																	<Badge
																		variant="success"
																		className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 border-green-200 shrink-0"
																	>
																		Bisa Nego
																	</Badge>
																)}
															</div>
															<p className="font-sans text-xs text-neutral-400 mt-1">
																{p.category} · {p.city}
															</p>
														</div>
														<Checkbox
															checked={row.getIsSelected()}
															onCheckedChange={(value) =>
																row.toggleSelected(!!value)
															}
															aria-label="Pilih produk"
															className="shrink-0 mt-0.5"
														/>
													</div>
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-3">
															<p className="font-quick font-semibold text-sm text-neutral-900">
																{formatCurrency(p.priceFrom)}
																<span className="font-sans font-normal text-xs text-neutral-400 ml-1">
																	/ {p.rentalUnit}
																</span>
															</p>
															<StatusBadge status={p.status} />
														</div>
														<div className="flex gap-1">
															<button
																className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue transition-colors"
																onClick={() => {
																	openEditModal(p);
																	setIsEditOpen(true);
																}}
																aria-label="Edit"
															>
																<Pencil className="w-4 h-4" />
															</button>
															<button
																className="p-1.5 rounded-md text-neutral-500 hover:bg-red-50 hover:text-c-red transition-colors"
																onClick={() =>
																	setDeleteDialog({
																		open: true,
																		slugs: [p.slug],
																		isMultiple: false,
																	})
																}
																aria-label="Hapus"
															>
																<Trash2 className="w-4 h-4" />
															</button>
														</div>
													</div>
													<p className="font-quick text-xs">
														<span
															className={
																p.stock === 0
																	? "text-c-red font-semibold"
																	: "text-neutral-600"
															}
														>
															{p.stock}
														</span>
														<span className="text-neutral-400">
															{" "}
															/ {p.totalStock} tersedia
														</span>
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})
						) : (
							<p className="text-center font-sans text-sm text-neutral-400 py-12">
								Produk tidak ditemukan.
							</p>
						)}
					</div>

					<Pagination
						currentPage={table.getState().pagination.pageIndex + 1}
						totalPages={table.getPageCount()}
						totalItems={table.getFilteredRowModel().rows.length}
						pageSize={pageSize}
						onPageChange={handlePageChange}
						className="border-t border-neutral-100 px-6 py-4"
					/>
				</div>
			</div>

			<EditProductDialog open={isEditOpen} onOpenChange={setIsEditOpen} />

			<AlertDialog
				open={deleteDialog.open}
				onOpenChange={(v) => setDeleteDialog((prev) => ({ ...prev, open: v }))}
				title={deleteDialog.isMultiple ? "Hapus Produk" : "Hapus Produk"}
				description={
					deleteDialog.isMultiple
						? `Anda yakin ingin menghapus ${deleteDialog.slugs.length} produk? Tindakan ini tidak dapat dibatalkan.`
						: "Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
				}
				confirmLabel="Hapus"
				variant="destructive"
				onConfirm={confirmDelete}
			/>

			<Dialog
				open={statusDialog.open}
				onOpenChange={(v) => setStatusDialog((prev) => ({ ...prev, open: v }))}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Ubah Status Produk</DialogTitle>
						<DialogDescription>
							Pilih status baru untuk {statusDialog.slugs.length} produk
							terpilih.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<Select
							value={selectedBulkStatus}
							onValueChange={(v) =>
								setSelectedBulkStatus(v as Product["status"])
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="z-[60]">
								<SelectItem value="active">Aktif</SelectItem>
								<SelectItem value="sold_out">Habis</SelectItem>
								<SelectItem value="escrow_badge">Escrow</SelectItem>
								<SelectItem value="inactive">Nonaktif</SelectItem>
								<SelectItem value="inactive">Nonaktif</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() =>
								setStatusDialog((prev) => ({ ...prev, open: false }))
							}
						>
							Batal
						</Button>
						<Button onClick={() => confirmStatus(selectedBulkStatus)}>
							Simpan
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default withAuth(VendorProductsPage, "vendor");
