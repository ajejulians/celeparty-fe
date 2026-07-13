"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ShieldCheck, Info } from "lucide-react";
import { FileUploader } from "./FileUploader";

const variantSchema = z.object({
  name: z.string().min(1, "Nama varian wajib diisi"),
  price: z.coerce.number().min(1000, "Harga minimal 1000"),
  quota: z.coerce.number().min(1, "Kuota minimal 1"),
  deadline: z.string().optional(),
});

const productSchema = z.object({
  name: z.string().min(5, "Nama produk minimal 5 karakter"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  variants: z.array(variantSchema).min(1, "Minimal 1 varian"),
  isEscrowEnabled: z.boolean().default(false),
  logistics: z.object({
    shippingRequired: z.boolean().default(false),
    setupRequired: z.boolean().default(false),
  }).optional(),
});

type ProductFormInput = z.input<typeof productSchema>;
type ProductFormOutput = z.output<typeof productSchema>;

export function ProductForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, any, ProductFormOutput>({
    resolver: zodResolver(productSchema),
    mode: "onBlur",
    defaultValues: {
      variants: [{ name: "", price: 0, quota: 1, deadline: "" }],
      isEscrowEnabled: false,
      logistics: { shippingRequired: false, setupRequired: false },
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control,
  });

  const isEscrowEnabled = watch("isEscrowEnabled");

  const onSubmit = async (data: ProductFormOutput) => {
    console.log("Submit data:", data, imageFile);
    // Simulate API
    await new Promise((r) => setTimeout(r, 1000));
    alert("Produk berhasil ditambahkan");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-6">
        <h2 className="font-quick font-bold text-lg text-neutral-900 border-b border-neutral-100 pb-3">Informasi Dasar</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Label className="font-sans text-neutral-700 mb-2 block">Foto Produk</Label>
            <FileUploader onFileChange={setImageFile} />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label className="font-sans text-neutral-700">Nama Produk / Jasa</Label>
              <Input {...register("name")} placeholder="Contoh: Sewa Sound System 5000W" className="font-sans text-base h-11" />
              {errors.name && <p className="text-xs text-c-red font-sans">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="font-sans text-neutral-700">Kategori</Label>
              <select {...register("category")} className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-blue">
                <option value="">Pilih Kategori</option>
                <option value="Audio & Sound">Audio & Sound</option>
                <option value="Lighting">Lighting</option>
                <option value="Fotografi">Fotografi</option>
                <option value="Videografi">Videografi</option>
                <option value="Dekorasi">Dekorasi</option>
                <option value="Catering">Catering</option>
              </select>
              {errors.category && <p className="text-xs text-c-red font-sans">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="font-sans text-neutral-700">Deskripsi Lengkap</Label>
              <textarea {...register("description")} rows={4} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-blue resize-none" placeholder="Jelaskan detail spesifikasi produk/jasa Anda..." />
              {errors.description && <p className="text-xs text-c-red font-sans">{errors.description.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Escrow & Logistics */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-6">
        <h2 className="font-quick font-bold text-lg text-neutral-900 border-b border-neutral-100 pb-3">Pembayaran & Logistik (Khusus Sewa Alat)</h2>
        
        <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50 flex items-start gap-4">
          <div className="pt-1">
            <input type="checkbox" id="escrow" {...register("isEscrowEnabled")} className="w-5 h-5 accent-c-blue" />
          </div>
          <div>
            <label htmlFor="escrow" className="font-quick font-semibold text-neutral-900 cursor-pointer select-none">
              Aktifkan Opsi Pembayaran Escrow (DP 30% & Pelunasan 70%)
            </label>
            <p className="font-sans text-sm text-neutral-500 mt-1">
              Sistem akan menahan dana DP dan meminta pelunasan sebelum tanggal loading. Cocok untuk sewa alat besar.
            </p>
          </div>
          <div className="ml-auto hidden sm:block">
            <ShieldCheck className={`w-8 h-8 ${isEscrowEnabled ? 'text-c-blue' : 'text-neutral-300'}`} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="shipping" {...register("logistics.shippingRequired")} className="w-4 h-4 accent-c-blue" />
            <label htmlFor="shipping" className="font-sans text-sm text-neutral-700 cursor-pointer select-none">Membutuhkan Pengiriman Alamat</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="setup" {...register("logistics.setupRequired")} className="w-4 h-4 accent-c-blue" />
            <label htmlFor="setup" className="font-sans text-sm text-neutral-700 cursor-pointer select-none">Membutuhkan Waktu Setup/Loading</label>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h2 className="font-quick font-bold text-lg text-neutral-900">Varian & Harga</h2>
          <Button type="button" onClick={() => append({ name: "", price: 0, quota: 1, deadline: "" })} variant="outline" size="sm" className="font-quick text-xs gap-1 h-8">
            <Plus className="w-3.5 h-3.5" /> Tambah Varian
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-neutral-50 p-4 rounded-lg border border-neutral-100">
              <div className="sm:col-span-4 space-y-1">
                <Label className="font-sans text-xs text-neutral-500">Nama Varian</Label>
                <Input {...register(`variants.${index}.name`)} placeholder="Contoh: Paket VIP" className="font-sans text-base h-10 bg-white" />
                {errors.variants?.[index]?.name && <p className="text-[10px] text-c-red font-sans">{errors.variants[index]?.name?.message}</p>}
              </div>
              
              <div className="sm:col-span-3 space-y-1">
                <Label className="font-sans text-xs text-neutral-500">Harga (Rp)</Label>
                <Input type="number" {...register(`variants.${index}.price`)} placeholder="0" className="font-sans text-base h-10 bg-white" />
                {errors.variants?.[index]?.price && <p className="text-[10px] text-c-red font-sans">{errors.variants[index]?.price?.message}</p>}
              </div>
              
              <div className="sm:col-span-2 space-y-1">
                <Label className="font-sans text-xs text-neutral-500">Kuota</Label>
                <Input type="number" {...register(`variants.${index}.quota`)} placeholder="1" className="font-sans text-base h-10 bg-white" />
                {errors.variants?.[index]?.quota && <p className="text-[10px] text-c-red font-sans">{errors.variants[index]?.quota?.message}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <Label className="font-sans text-xs text-neutral-500 line-clamp-1">Batas Waktu (Opsional)</Label>
                <Input type="date" {...register(`variants.${index}.deadline`)} className="font-sans text-base h-10 bg-white" />
              </div>

              <div className="sm:col-span-1 flex justify-end">
                <button type="button" onClick={() => remove(index)} disabled={fields.length === 1} className="p-2.5 text-neutral-400 hover:text-c-red hover:bg-red-50 rounded-md transition-colors disabled:opacity-50">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" className="font-quick font-semibold h-11 w-32">Batal</Button>
        <Button type="submit" disabled={isSubmitting} className="font-quick font-semibold h-11 px-8 bg-c-blue text-white hover:brightness-95">
          {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
        </Button>
      </div>
    </form>
  );
}
