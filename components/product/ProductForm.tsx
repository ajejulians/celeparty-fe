"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
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
import { useSession } from "@/lib/session";
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

const variantSchema = z.object({
	name: z.string().min(1, "Nama varian wajib diisi"),
	price: z.coerce.number().min(1000, "Harga minimal 1000"),
	quota: z.coerce.number().min(1, "Kuota minimal 1"),
	deadline: z.string().optional(),
});

const productSchema = z.object({
	name: z.string().min(5, "Nama produk minimal 5 karakter"),
	category: z.string().min(1, "Kategori wajib dipilih"),
	city: z.string().min(1, "Kota wajib diisi"),
	description: z.string().min(10, "Deskripsi minimal 10 karakter"),
	priceFrom: z.coerce.number().positive("Harga harus positif"),
	stock: z.coerce.number().min(0, "Stok tidak boleh negatif"),
	totalStock: z.coerce.number().min(0, "Total unit tidak boleh negatif"),
	rentalUnit: z.enum(["Hari", "Event", "Bulan"]),
	isNegotiable: z.boolean().default(false),
	variants: z.array(variantSchema).min(1, "Minimal 1 varian"),
	isEscrowEnabled: z.boolean().default(false),
	logistics: z
		.object({
			shippingRequired: z.boolean().default(false),
			setupRequired: z.boolean().default(false),
		})
		.optional(),
});

type ProductFormInput = z.input<typeof productSchema>;
type ProductFormOutput = z.output<typeof productSchema>;

export function ProductForm() {
	const router = useRouter();
	const session = useSession();
	const addProduct = useVendorProductStore((s) => s.addProduct);
	const [imageFile, setImageFile] = useState<File | null>(null);

	const form = useForm<ProductFormInput, any, ProductFormOutput>({
		resolver: zodResolver(productSchema),
		mode: "onBlur",
		defaultValues: {
			city: "",
			priceFrom: 0,
			stock: 0,
			totalStock: 0,
			rentalUnit: "Hari",
			isNegotiable: false,
			variants: [{ name: "", price: 0, quota: 1, deadline: "" }],
			isEscrowEnabled: false,
			logistics: { shippingRequired: false, setupRequired: false },
		},
	});

	const { fields, append, remove } = useFieldArray({
		name: "variants",
		control: form.control,
	});

	const isEscrowEnabled = form.watch("isEscrowEnabled");

	const onSubmit = async (data: ProductFormOutput) => {
		try {
			await new Promise((r) => setTimeout(r, 800));
			addProduct({
				name: data.name,
				category: data.category,
				city: data.city,
				description: data.description,
				priceFrom: data.priceFrom,
				stock: data.stock,
				totalStock: data.totalStock,
				rentalUnit: data.rentalUnit,
				isNegotiable: data.isNegotiable,
				isActive: true,
				escrow: data.isEscrowEnabled,
				status: data.isEscrowEnabled ? "escrow_badge" : "active",
				imageUrl: imageFile ? URL.createObjectURL(imageFile) : "",
				variants: data.variants.map((v) => ({ name: v.name, price: v.price })),
				vendorName: session.vendorName || "Vendor",
				vendorId: session.vendorId || "unknown",
			});
			toast.success("Produk berhasil ditambahkan!");
			router.push("/user/vendor/products");
		} catch {
			toast.error("Gagal menambahkan produk.");
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
				<div className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 space-y-4">
					<h2 className="font-quick font-bold text-lg text-neutral-900 border-b border-neutral-100 pb-3">
						Informasi Dasar
					</h2>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
						<div className="lg:col-span-1">
							<p className="font-sans font-medium text-xs text-neutral-500 mb-1.5">
								Foto Produk
							</p>
							<FileUploader onFileChange={setImageFile} />
						</div>

						<div className="lg:col-span-2 space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nama Produk / Jasa</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Contoh: Sewa Sound System 5000W"
												className="h-10"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Kategori</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Pilih Kategori" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
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

							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Kota</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Contoh: Jakarta"
												className="h-10"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-3">
								<FormField
									control={form.control}
									name="priceFrom"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Harga Sewa (Rp)</FormLabel>
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
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="rentalUnit"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Unit Sewa</FormLabel>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
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

							<div className="grid grid-cols-2 gap-3">
								<FormField
									control={form.control}
									name="stock"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Sisa Stok</FormLabel>
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
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="totalStock"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Total Unit</FormLabel>
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
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="isNegotiable"
								render={({ field }) => (
									<FormItem className="flex items-start gap-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												id="negotiable"
											/>
										</FormControl>
										<label
											htmlFor="negotiable"
											className="font-sans text-sm text-neutral-700 cursor-pointer select-none"
										>
											Bisa Nego
										</label>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Deskripsi Lengkap</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												rows={4}
												placeholder="Jelaskan detail spesifikasi produk/jasa Anda..."
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>

				<div className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 space-y-4">
					<h2 className="font-quick font-bold text-lg text-neutral-900 border-b border-neutral-100 pb-3">
						Pembayaran & Logistik (Khusus Sewa Alat)
					</h2>

					<div className="p-3 sm:p-4 rounded-lg border border-neutral-200 bg-neutral-50 flex items-start gap-3">
						<FormField
							control={form.control}
							name="isEscrowEnabled"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											id="escrow"
											className="mt-0.5"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="min-w-0">
							<label
								htmlFor="escrow"
								className="font-quick font-semibold text-sm text-neutral-900 cursor-pointer select-none"
							>
								Aktifkan Opsi Pembayaran Escrow (DP 30% & Pelunasan 70%)
							</label>
							<p className="font-sans text-xs text-neutral-500 mt-0.5 leading-snug">
								Sistem akan menahan dana DP dan meminta pelunasan sebelum
								tanggal loading. Cocok untuk sewa alat besar.
							</p>
						</div>
						<ShieldCheck
							className={`w-7 h-7 hidden sm:block shrink-0 ml-auto ${isEscrowEnabled ? "text-c-blue" : "text-neutral-300"}`}
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<FormField
							control={form.control}
							name="logistics.shippingRequired"
							render={({ field }) => (
								<div className="flex items-center gap-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											id="shipping"
										/>
									</FormControl>
									<label
										htmlFor="shipping"
										className="font-sans text-sm text-neutral-700 cursor-pointer select-none"
									>
										Membutuhkan Pengiriman Alamat
									</label>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="logistics.setupRequired"
							render={({ field }) => (
								<div className="flex items-center gap-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											id="setup"
										/>
									</FormControl>
									<label
										htmlFor="setup"
										className="font-sans text-sm text-neutral-700 cursor-pointer select-none"
									>
										Membutuhkan Waktu Setup/Loading
									</label>
								</div>
							)}
						/>
					</div>
				</div>

				<div className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 space-y-4">
					<div className="flex items-center justify-between border-b border-neutral-100 pb-3">
						<h2 className="font-quick font-bold text-lg text-neutral-900">
							Varian & Harga
						</h2>
						<Button
							type="button"
							onClick={() =>
								append({ name: "", price: 0, quota: 1, deadline: "" })
							}
							variant="outline"
							size="sm"
							className="font-quick text-xs gap-1 h-8"
						>
							<Plus className="w-3.5 h-3.5" /> Tambah Varian
						</Button>
					</div>

					<div className="space-y-3">
						{fields.map((field, index) => (
							<div
								key={field.id}
								className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-neutral-50 p-3 sm:p-4 rounded-lg border border-neutral-100"
							>
								<div className="sm:col-span-4 space-y-1">
									<p className="font-sans text-xs font-medium text-neutral-400">
										Nama Varian
									</p>
									<Input
										{...form.register(`variants.${index}.name`)}
										placeholder="Contoh: Paket VIP"
										className="h-9 bg-white"
									/>
									{form.formState.errors.variants?.[index]?.name && (
										<p className="text-[10px] text-c-red font-sans">
											{form.formState.errors.variants[index]?.name?.message}
										</p>
									)}
								</div>

								<div className="sm:col-span-3 space-y-1">
									<p className="font-sans text-xs font-medium text-neutral-400">
										Harga (Rp)
									</p>
									<Input
										type="number"
										{...form.register(`variants.${index}.price`)}
										placeholder="0"
										className="h-9 bg-white"
									/>
									{form.formState.errors.variants?.[index]?.price && (
										<p className="text-[10px] text-c-red font-sans">
											{form.formState.errors.variants[index]?.price?.message}
										</p>
									)}
								</div>

								<div className="sm:col-span-2 space-y-1">
									<p className="font-sans text-xs font-medium text-neutral-400">
										Kuota
									</p>
									<Input
										type="number"
										{...form.register(`variants.${index}.quota`)}
										placeholder="1"
										className="h-9 bg-white"
									/>
									{form.formState.errors.variants?.[index]?.quota && (
										<p className="text-[10px] text-c-red font-sans">
											{form.formState.errors.variants[index]?.quota?.message}
										</p>
									)}
								</div>

								<div className="sm:col-span-2 space-y-1">
									<p className="font-sans text-xs font-medium text-neutral-400 line-clamp-1">
										Batas Waktu
									</p>
									<Input
										type="date"
										{...form.register(`variants.${index}.deadline`)}
										className="h-9 bg-white"
									/>
								</div>

								<div className="sm:col-span-1 flex justify-end">
									<button
										type="button"
										onClick={() => remove(index)}
										disabled={fields.length === 1}
										className="p-2 text-neutral-400 hover:text-c-red hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="flex justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						className="font-quick font-semibold h-10 px-6"
						onClick={() => router.push("/user/vendor/products")}
					>
						Batal
					</Button>
					<Button
						type="submit"
						disabled={form.formState.isSubmitting}
						className="font-quick font-semibold h-10 px-6 bg-c-blue text-white hover:brightness-95"
					>
						{form.formState.isSubmitting ? "Menyimpan..." : "Simpan Produk"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
