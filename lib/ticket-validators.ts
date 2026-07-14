import { z } from "zod";

const indonesianPhoneRegex = /^(\+62|62|08)\d{8,12}$/;

export const ticketCategorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
  price: z.coerce.number().min(0, "Harga minimal 0"),
  quota: z.coerce.number().min(1, "Kuota minimal 1"),
  saleStart: z.string().min(1, "Tanggal mulai penjualan wajib diisi"),
  saleEnd: z.string().min(1, "Tanggal akhir penjualan wajib diisi"),
  benefits: z.string().min(3, "Deskripsi benefit minimal 3 karakter"),
});

export const createEventSchema = z.object({
  eventName: z.string().min(5, "Nama event minimal 5 karakter"),
  eventCategory: z.string().min(1, "Kategori event wajib dipilih"),
  dateStart: z.string().min(1, "Tanggal mulai event wajib diisi"),
  dateEnd: z.string().min(1, "Tanggal akhir event wajib diisi"),
  location: z.string().min(3, "Lokasi wajib diisi"),
  gmapsLink: z.string().url("Format URL tidak valid").or(z.literal("")),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  terms: z.string().min(5, "Syarat & ketentuan minimal 5 karakter"),
  categories: z
    .array(ticketCategorySchema)
    .min(1, "Minimal 1 kategori tiket")
    .refine(
      (cats) => new Set(cats.map((c) => c.name.trim().toLowerCase())).size === cats.length,
      { message: "Nama kategori tidak boleh duplikat" }
    ),
}).refine(
  (data) => {
    if (!data.dateStart || !data.dateEnd) return true;
    return new Date(data.dateEnd) >= new Date(data.dateStart);
  },
  { message: "Tanggal akhir event tidak boleh sebelum tanggal mulai", path: ["dateEnd"] }
);

export type CreateEventInput = z.input<typeof createEventSchema>;
export type CreateEventOutput = z.output<typeof createEventSchema>;
