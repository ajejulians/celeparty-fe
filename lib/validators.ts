import { z } from "zod";

export const recipientSchema = z.object({
	name: z
		.string()
		.min(2, "Nama minimal 2 karakter")
		.max(100, "Nama maksimal 100 karakter"),
	email: z.string().email("Format email tidak valid"),
	whatsapp: z
		.string()
		.regex(
			/^08\d{8,12}$/,
			"Format WhatsApp tidak valid (contoh: 081234567890)",
		),
	identityType: z.enum(["KTP", "SIM", "Paspor"], {
		message: "Pilih jenis identitas",
	}),
	identityNumber: z
		.string()
		.min(6, "Nomor identitas minimal 6 karakter")
		.max(30, "Nomor identitas maksimal 30 karakter"),
});

export type RecipientFormData = z.infer<typeof recipientSchema>;

export const checkoutFormSchema = z.object({
	recipients: z.array(recipientSchema).min(1, "Minimal 1 penerima"),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const rentalFormSchema = z.object({
	customerName: z
		.string()
		.min(2, "Nama minimal 2 karakter")
		.max(100, "Nama maksimal 100 karakter"),
	customerEmail: z.string().email("Format email tidak valid"),
	whatsapp: z
		.string()
		.regex(
			/^08\d{8,12}$/,
			"Format WhatsApp tidak valid (contoh: 081234567890)",
		),
	eventDate: z.string().min(1, "Tanggal event wajib diisi"),
	eventType: z.string().min(1, "Jenis acara wajib diisi"),
	note: z.string().optional(),
});

export type RentalFormData = z.infer<typeof rentalFormSchema>;

export const identityTypeLabels: Record<string, string> = {
	KTP: "KTP",
	SIM: "SIM",
	Paspor: "Paspor",
};
