"use client";

import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { RecipientFormData } from "@/lib/validators";

interface RecipientFormProps {
	index: number;
	value: Partial<RecipientFormData>;
	errors: Partial<Record<keyof RecipientFormData, string>>;
	onChange: (data: Partial<RecipientFormData>) => void;
}

export function RecipientForm({
	index,
	value,
	errors,
	onChange,
}: RecipientFormProps) {
	const updateField = <K extends keyof RecipientFormData>(
		field: K,
		val: RecipientFormData[K],
	) => {
		onChange({ ...value, [field]: val });
	};

	return (
		<div className="border border-neutral-200 rounded-xl p-4 space-y-4">
			<div className="flex items-center gap-2">
				<div className="w-7 h-7 rounded-full bg-c-blue flex items-center justify-center shrink-0">
					<span className="text-white text-xs font-quick font-bold">
						{index + 1}
					</span>
				</div>
				<h4 className="font-quick font-semibold text-neutral-900 text-sm">
					Data Penerima ke-{index + 1}
				</h4>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div className="flex flex-col gap-1.5 sm:col-span-2">
					<label className="text-sm font-sans font-medium text-neutral-700">
						Nama Lengkap<span className="text-c-red ml-0.5">*</span>
					</label>
					<div className="relative">
						<User className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
						<Input
							placeholder="Sesuai identitas"
							className="pl-10"
							value={value.name ?? ""}
							onChange={(e) => updateField("name", e.target.value)}
						/>
					</div>
					{errors.name && (
						<p className="text-xs font-sans text-c-red">{errors.name}</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label className="text-sm font-sans font-medium text-neutral-700">
						Email<span className="text-c-red ml-0.5">*</span>
					</label>
					<Input
						type="email"
						placeholder="email@contoh.com"
						value={value.email ?? ""}
						onChange={(e) => updateField("email", e.target.value)}
					/>
					{errors.email && (
						<p className="text-xs font-sans text-c-red">{errors.email}</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label className="text-sm font-sans font-medium text-neutral-700">
						No. WhatsApp<span className="text-c-red ml-0.5">*</span>
					</label>
					<Input
						type="tel"
						placeholder="081234567890"
						value={value.whatsapp ?? ""}
						onChange={(e) => updateField("whatsapp", e.target.value)}
					/>
					{errors.whatsapp && (
						<p className="text-xs font-sans text-c-red">{errors.whatsapp}</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label className="text-sm font-sans font-medium text-neutral-700">
						Jenis Identitas<span className="text-c-red ml-0.5">*</span>
					</label>
					<Select
						value={value.identityType ?? ""}
						onValueChange={(v) =>
							updateField(
								"identityType",
								v as RecipientFormData["identityType"],
							)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Pilih jenis identitas" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="KTP">KTP</SelectItem>
							<SelectItem value="SIM">SIM</SelectItem>
							<SelectItem value="Paspor">Paspor</SelectItem>
						</SelectContent>
					</Select>
					{errors.identityType && (
						<p className="text-xs font-sans text-c-red">
							{errors.identityType}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label className="text-sm font-sans font-medium text-neutral-700">
						Nomor Identitas<span className="text-c-red ml-0.5">*</span>
					</label>
					<Input
						placeholder="Nomor KTP / SIM / Paspor"
						value={value.identityNumber ?? ""}
						onChange={(e) => updateField("identityNumber", e.target.value)}
					/>
					{errors.identityNumber && (
						<p className="text-xs font-sans text-c-red">
							{errors.identityNumber}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
