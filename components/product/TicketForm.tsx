"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Ticket, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploader } from "./FileUploader";

const ticketVariantSchema = z.object({
	name: z.string().min(1, "Nama varian wajib diisi"),
	price: z.coerce.number().min(1000, "Harga minimal 1000"),
	quota: z.coerce.number().min(1, "Kuota minimal 1"),
});

const schemaTicket = z.object({
	name: z.string().min(5, "Nama event minimal 5 karakter"),
	eventDate: z.string().min(1, "Tanggal event wajib diisi"),
	location: z.string().min(5, "Lokasi wajib diisi"),
	description: z.string().min(10, "Deskripsi minimal 10 karakter"),
	variants: z.array(ticketVariantSchema).min(1, "Minimal 1 varian tiket"),
});

type TicketFormInput = z.input<typeof schemaTicket>;
type TicketFormOutput = z.output<typeof schemaTicket>;

export function TicketForm() {
	const [imageFile, setImageFile] = useState<File | null>(null);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<TicketFormInput, any, TicketFormOutput>({
		resolver: zodResolver(schemaTicket),
		mode: "onBlur",
		defaultValues: {
			variants: [{ name: "", price: 0, quota: 100 }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		name: "variants",
		control,
	});

	const onSubmit = async (data: TicketFormOutput) => {
		console.log("Submit ticket data:", data, imageFile);
		await new Promise((r) => setTimeout(r, 1000));
		alert("Tiket Event berhasil ditambahkan");
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
			{/* Basic Info */}
			<div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-6">
				<div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
					<Ticket className="w-5 h-5 text-c-blue" />
					<h2 className="font-quick font-bold text-lg text-neutral-900">
						Informasi Event & Tiket
					</h2>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-1">
						<Label className="font-sans text-neutral-700 mb-2 block">
							Poster Event
						</Label>
						<FileUploader onFileChange={setImageFile} />
					</div>

					<div className="lg:col-span-2 space-y-6">
						<div className="space-y-2">
							<Label className="font-sans text-neutral-700">Nama Event</Label>
							<Input
								{...register("name")}
								placeholder="Contoh: Java Jazz Festival 2026"
								className="font-sans text-base h-11"
							/>
							{errors.name && (
								<p className="text-xs text-c-red font-sans">
									{errors.name.message}
								</p>
							)}
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="font-sans text-neutral-700">
									Tanggal Pelaksanaan
								</Label>
								<Input
									type="date"
									{...register("eventDate")}
									className="font-sans text-base h-11"
								/>
								{errors.eventDate && (
									<p className="text-xs text-c-red font-sans">
										{errors.eventDate.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label className="font-sans text-neutral-700">
									Lokasi / Venue
								</Label>
								<Input
									{...register("location")}
									placeholder="Contoh: JIExpo Kemayoran"
									className="font-sans text-base h-11"
								/>
								{errors.location && (
									<p className="text-xs text-c-red font-sans">
										{errors.location.message}
									</p>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label className="font-sans text-neutral-700">
								Deskripsi Event
							</Label>
							<textarea
								{...register("description")}
								rows={4}
								className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-blue resize-none"
								placeholder="Deskripsikan acara Anda..."
							/>
							{errors.description && (
								<p className="text-xs text-c-red font-sans">
									{errors.description.message}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Variants */}
			<div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-6">
				<div className="flex items-center justify-between border-b border-neutral-100 pb-3">
					<h2 className="font-quick font-bold text-lg text-neutral-900">
						Kategori Tiket & Harga
					</h2>
					<Button
						type="button"
						onClick={() => append({ name: "", price: 0, quota: 100 })}
						variant="outline"
						size="sm"
						className="font-quick text-xs gap-1 h-8"
					>
						<Plus className="w-3.5 h-3.5" /> Tambah Kategori
					</Button>
				</div>

				<div className="space-y-4">
					{fields.map((field, index) => (
						<div
							key={field.id}
							className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-neutral-50 p-4 rounded-lg border border-neutral-100"
						>
							<div className="sm:col-span-5 space-y-1">
								<Label className="font-sans text-xs text-neutral-500">
									Nama Kategori (Varian)
								</Label>
								<Input
									{...register(`variants.${index}.name`)}
									placeholder="Contoh: Early Bird VIP"
									className="font-sans text-base h-10 bg-white"
								/>
								{errors.variants?.[index]?.name && (
									<p className="text-[10px] text-c-red font-sans">
										{errors.variants[index]?.name?.message}
									</p>
								)}
							</div>

							<div className="sm:col-span-4 space-y-1">
								<Label className="font-sans text-xs text-neutral-500">
									Harga (Rp)
								</Label>
								<Input
									type="number"
									{...register(`variants.${index}.price`)}
									placeholder="0"
									className="font-sans text-base h-10 bg-white"
								/>
								{errors.variants?.[index]?.price && (
									<p className="text-[10px] text-c-red font-sans">
										{errors.variants[index]?.price?.message}
									</p>
								)}
							</div>

							<div className="sm:col-span-2 space-y-1">
								<Label className="font-sans text-xs text-neutral-500">
									Kuota Tiket
								</Label>
								<Input
									type="number"
									{...register(`variants.${index}.quota`)}
									placeholder="100"
									className="font-sans text-base h-10 bg-white"
								/>
								{errors.variants?.[index]?.quota && (
									<p className="text-[10px] text-c-red font-sans">
										{errors.variants[index]?.quota?.message}
									</p>
								)}
							</div>

							<div className="sm:col-span-1 flex justify-end">
								<button
									type="button"
									onClick={() => remove(index)}
									disabled={fields.length === 1}
									className="p-2.5 text-neutral-400 hover:text-c-red hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
								>
									<Trash2 className="w-5 h-5" />
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="flex justify-end gap-4">
				<Button
					type="button"
					variant="outline"
					className="font-quick font-semibold h-11 w-32"
				>
					Batal
				</Button>
				<Button
					type="submit"
					disabled={isSubmitting}
					className="font-quick font-semibold h-11 px-8 bg-c-blue text-white hover:brightness-95"
				>
					{isSubmitting ? "Menyimpan..." : "Simpan Tiket Event"}
				</Button>
			</div>
		</form>
	);
}
