"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { useVendorProductStore } from "@/lib/vendor-product-store";
import { FileUploader } from "./FileUploader";

const CATEGORIES = [
	"Audio & Sound",
	"Lighting",
	"Fotografi",
	"Videografi",
	"Dekorasi",
	"Catering",
	"Entertainment",
	"Sewa Alat",
];

const CITIES = [
	"Jakarta",
	"Bandung",
	"Surabaya",
	"Yogyakarta",
	"Semarang",
	"Medan",
	"Makassar",
	"Bali",
	"Balikpapan",
	"Batam",
];

const editProductSchema = z.object({
	name: z.string().min(1, "Nama produk wajib diisi"),
	category: z.string().min(1, "Kategori wajib dipilih"),
	priceFrom: z.coerce.number().positive("Harga harus positif"),
	totalStock: z.coerce.number().min(0, "Total unit tidak boleh negatif"),
	rentalUnit: z.enum(["Hari", "Event", "Bulan"]),
	description: z.string().optional().or(z.literal("")),
	city: z.string().min(1, "Kota wajib diisi"),
	status: z.enum(["active", "sold_out", "escrow_badge", "inactive"]),
});

type EditProductFormValues = z.input<typeof editProductSchema>;

interface EditProductDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditProductDialog({
	open,
	onOpenChange,
}: EditProductDialogProps) {
	const editingProduct = useVendorProductStore((s) => s.editingProduct);
	const closeEditModal = useVendorProductStore((s) => s.closeEditModal);
	const updateProductLocal = useVendorProductStore((s) => s.updateProductLocal);

	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isImageCleared, setIsImageCleared] = useState(false);

	const form = useForm<EditProductFormValues>({
		resolver: zodResolver(editProductSchema),
		defaultValues: {
			name: "",
			category: "",
			priceFrom: 0,
			totalStock: 0,
			rentalUnit: "Hari",
			description: "",
			city: "",
			status: "active",
		},
	});

	useEffect(() => {
		if (editingProduct && open) {
			form.reset({
				name: editingProduct.name,
				category: editingProduct.category,
				priceFrom: editingProduct.priceFrom,
				totalStock: editingProduct.totalStock,
				rentalUnit: editingProduct.rentalUnit,
				description: editingProduct.description || "",
				city: editingProduct.city,
				status: editingProduct.status,
			});
			setImageFile(null);
			setIsImageCleared(false);
		}
	}, [editingProduct, open, form]);

	const handleClose = () => {
		closeEditModal();
		onOpenChange(false);
	};

	const currentTotal = Number(form.watch("totalStock")) || 0;
	const initialTotal = editingProduct?.totalStock || 0;
	const initialStock = editingProduct?.stock || 0;
	const rentedUnits = Math.max(0, initialTotal - initialStock);
	const dynamicStock = Math.max(0, currentTotal - rentedUnits);

	const onSubmit = async (data: EditProductFormValues) => {
		if (!editingProduct) return;

		try {
			await new Promise((r) => setTimeout(r, 800));

			updateProductLocal(
				editingProduct.slug,
				{
					name: data.name,
					category: data.category,
					priceFrom: Number(data.priceFrom),
					totalStock: Number(data.totalStock),
					rentalUnit: data.rentalUnit,
					description: data.description,
					city: data.city,
					status: data.status,
				},
				imageFile || undefined,
			);
			toast.success("Produk berhasil diperbarui.");
			handleClose();
		} catch {
			toast.error("Gagal memperbarui produk.");
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent
				key={editingProduct?.slug}
				className="w-xl max-w-lg md:max-w-xl lg:max-w-2xl p-4 gap-0 flex flex-col max-h-[90dvh]"
			>
				<DialogHeader className="p-5 sm:p-2 pb-4 border-b border-neutral-100 bg-white shrink-0">
					<DialogTitle className="text-xl">Edit Produk</DialogTitle>
					<DialogDescription>Perbarui informasi produk Anda.</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						id="edit-product-form"
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col flex-1 min-h-0 overflow-hidden"
					>
						<div className="overflow-y-auto p-2 flex-1 space-y-2">
							{/* Product Image Section */}
							<div className="mb-4 pb-4 border-b border-neutral-100">
								<p className="font-sans font-medium text-xs text-neutral-500 mb-2">
									Foto Produk <span className="text-red-500 font-bold">*</span>
								</p>
								<div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
									<div className="col-span-2 sm:col-span-1">
										<FileUploader
											currentImage={editingProduct?.imageUrl}
											onFileChange={(file) => {
												setImageFile(file);
												setIsImageCleared(!file);
											}}
										/>
									</div>
									{[1, 2, 3, 4].map((i) => (
										<div
											key={i}
											className="aspect-video sm:aspect-square border-2 border-dashed border-neutral-200 rounded-lg bg-neutral-50/50 flex flex-col items-center justify-center cursor-not-allowed group transition-colors hover:bg-neutral-50"
										>
											<Plus className="w-5 h-5 text-neutral-300 transition-colors group-hover:text-neutral-400" />
											<span className="text-[9px] text-neutral-400 font-sans mt-0.5">
												Tambah
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Product Information Form */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="md:col-span-2">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Nama Produk{" "}
													<span className="text-red-500 font-bold">*</span>
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder="Nama produk..."
														className="h-10"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div>
									<FormField
										control={form.control}
										name="category"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Kategori{" "}
													<span className="text-red-500 font-bold">*</span>
												</FormLabel>
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Pilih kategori" />
														</SelectTrigger>
													</FormControl>
													<SelectContent className="z-[60]">
														{CATEGORIES.map((cat) => (
															<SelectItem key={cat} value={cat}>
																{cat}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div>
									<FormField
										control={form.control}
										name="city"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Kota <span className="text-red-500 font-bold">*</span>
												</FormLabel>
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Pilih kota" />
														</SelectTrigger>
													</FormControl>
													<SelectContent className="z-[60]">
														{CITIES.map((city) => (
															<SelectItem key={city} value={city}>
																{city}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="md:col-span-2 grid grid-cols-2 gap-3">
									<FormField
										control={form.control}
										name="priceFrom"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Harga Sewa (Rp){" "}
													<span className="text-red-500 font-bold">*</span>
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														placeholder="0"
														className="h-10"
														value={field.value as number | string}
														onChange={(e) =>
															field.onChange(e.target.valueAsNumber || 0)
														}
													/>
												</FormControl>
												<FormDescription className="text-xs text-neutral-400 mt-0.5 font-normal">
													{formatCurrency(Number(field.value) || 0)}
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="rentalUnit"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Unit Sewa{" "}
													<span className="text-red-500 font-bold">*</span>
												</FormLabel>
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent className="z-[60]">
														<SelectItem value="Hari">Hari</SelectItem>
														<SelectItem value="Event">Event</SelectItem>
														<SelectItem value="Bulan">Bulan</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="md:col-span-2 grid grid-cols-2 gap-3">
									<div className="flex flex-col space-y-1.5">
										<label className="text-sm font-medium leading-none text-neutral-500 select-none">
											Sisa Stok
										</label>
										<div className="h-10 px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-md flex items-center justify-between text-sm text-neutral-400 cursor-not-allowed select-none">
											<span>{dynamicStock} Unit</span>
											<span className="text-[10px] text-neutral-400 italic">
												Terkunci (Dinamis)
											</span>
										</div>
									</div>

									<FormField
										control={form.control}
										name="totalStock"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Total Unit{" "}
													<span className="text-red-500 font-bold">*</span>
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														min={0}
														className="h-10"
														value={field.value as number | string}
														onChange={(e) =>
															field.onChange(e.target.valueAsNumber || 0)
														}
													/>
												</FormControl>
												{editingProduct && (
													<FormDescription className="text-xs text-neutral-400 mt-0.5 font-normal">
														{dynamicStock} dari {currentTotal} unit tersedia (
														{rentedUnits} unit sedang disewa)
													</FormDescription>
												)}
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="md:col-span-2">
									<FormField
										control={form.control}
										name="status"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Status{" "}
													<span className="text-red-500 font-bold">*</span>
												</FormLabel>
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent className="z-[60]">
														<SelectItem value="active">Aktif</SelectItem>
														<SelectItem value="sold_out">Habis</SelectItem>
														<SelectItem value="escrow_badge">Escrow</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="md:col-span-2">
									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Deskripsi{" "}
													<span className="text-neutral-400 font-normal text-xs">
														(Opsional)
													</span>
												</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														rows={3}
														placeholder="Deskripsi produk..."
														className="min-h-[100px] resize-y"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>

						<div className="p-5 sm:p-6 pt-4 border-t border-neutral-100 bg-white flex justify-end gap-3 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-10">
							<Button
								variant="outline"
								type="button"
								onClick={handleClose}
								disabled={form.formState.isSubmitting}
							>
								Batal
							</Button>
							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
								className="bg-c-blue text-white hover:bg-c-blue/90"
							>
								{form.formState.isSubmitting ? (
									<>
										<svg
											className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
											/>
										</svg>
										Menyimpan...
									</>
								) : (
									"Simpan Perubahan"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
