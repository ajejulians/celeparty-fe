"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploader } from "@/components/product/FileUploader";
import { createEventSchema, type CreateEventInput, type CreateEventOutput } from "@/lib/ticket-validators";
import { EVENT_CATEGORIES } from "@/lib/ticket-data";
import {
  ArrowLeft, Save, ImageUp, CalendarDays, MapPin, ExternalLink,
  FileText, Ticket, Plus, Trash2, Info,
} from "lucide-react";

const CKEditorComponent = dynamic(() => import("@/components/blog/CKEditorComponent"), {
  ssr: false,
  loading: () => <div className="h-64 bg-neutral-100 rounded-lg animate-pulse flex items-center justify-center"><p className="font-sans text-sm text-neutral-400">Memuat editor...</p></div>,
});

export default function CreateEventPage() {
  const router = useRouter();
  const [banner, setBanner] = useState<File | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventInput, any, CreateEventOutput>({
    resolver: zodResolver(createEventSchema),
    mode: "onBlur",
    defaultValues: {
      categories: [{ name: "", price: 0, quota: 100, saleStart: "", saleEnd: "", benefits: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ name: "categories", control });
  const watchedCategories = watch("categories");

  const onSubmit = async (data: CreateEventOutput) => {
    console.log("Create event:", data, banner);
    await new Promise((r) => setTimeout(r, 1200));
    alert("Event berhasil dibuat!");
    router.push("/user/vendor/tickets");
  };

  return (
    <>
      <ErpHeader breadcrumbs={[
        { label: "Dashboard", href: "/user/vendor/dashboard" },
        { label: "Tiket Event", href: "/user/vendor/tickets" },
        { label: "Buat Event Baru" },
      ]} />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/user/vendor/tickets" className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-quick font-bold text-2xl text-neutral-900">Buat Event Baru</h1>
            <p className="text-sm text-neutral-500 font-sans mt-1">Lengkapi detail event dan definisikan kategori tiket</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
          {/* CARD 1 — Detail Utama (banner full-width) */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <ImageUp className="w-5 h-5 text-c-blue" />
              <h2 className="font-quick font-semibold text-xl text-neutral-900">Detail Utama</h2>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-sans text-neutral-500">Banner / Poster Event</Label>
              <FileUploader onFileChange={setBanner} />
              <p className="font-sans text-xs text-neutral-400">
                <Info className="w-3 h-3 inline mr-1" />Rasio 16:9, maks 5MB. Format PNG/JPG.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-sans text-neutral-500">Nama Event <span className="text-c-red">*</span></Label>
              <Input {...register("eventName")} placeholder="Contoh: Java Jazz Festival 2026" className="font-sans text-base h-11" />
              {errors.eventName && <p className="text-xs text-c-red font-sans mt-1">{errors.eventName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-sans text-neutral-500">Kategori Event <span className="text-c-red">*</span></Label>
              <Controller
                name="eventCategory"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="font-sans">
                      <SelectValue placeholder="Pilih kategori event..." />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.eventCategory && <p className="text-xs text-c-red font-sans mt-1">{errors.eventCategory.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-sans text-neutral-500">Waktu Mulai <span className="text-c-red">*</span></Label>
                <div className="relative">
                  <CalendarDays className="w-4 h-4 absolute left-3 top-3.5 text-neutral-400 pointer-events-none" />
                  <Input type="datetime-local" {...register("dateStart")} className="font-sans text-base h-11 pl-10" />
                </div>
                {errors.dateStart && <p className="text-xs text-c-red font-sans mt-1">{errors.dateStart.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-sans text-neutral-500">Waktu Selesai <span className="text-c-red">*</span></Label>
                <div className="relative">
                  <CalendarDays className="w-4 h-4 absolute left-3 top-3.5 text-neutral-400 pointer-events-none" />
                  <Input type="datetime-local" {...register("dateEnd")} className="font-sans text-base h-11 pl-10" />
                </div>
                {errors.dateEnd && <p className="text-xs text-c-red font-sans mt-1">{errors.dateEnd.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-sans text-neutral-500">Lokasi / Venue <span className="text-c-red">*</span></Label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-neutral-400 pointer-events-none" />
                  <Input {...register("location")} placeholder="Contoh: JIExpo Kemayoran, Jakarta" className="font-sans text-base h-11 pl-10" />
                </div>
                {errors.location && <p className="text-xs text-c-red font-sans mt-1">{errors.location.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-sans text-neutral-500">Link Google Maps</Label>
                <div className="relative">
                  <ExternalLink className="w-4 h-4 absolute left-3 top-3.5 text-neutral-400 pointer-events-none" />
                  <Input {...register("gmapsLink")} placeholder="https://maps.google.com/?q=..." className="font-sans text-base h-11 pl-10" />
                </div>
                {errors.gmapsLink && <p className="text-xs text-c-red font-sans mt-1">{errors.gmapsLink.message}</p>}
              </div>
            </div>
          </div>

          {/* CARD 2 — Deskripsi & Aturan */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <FileText className="w-5 h-5 text-c-blue" />
              <h2 className="font-quick font-semibold text-xl text-neutral-900">Deskripsi & Aturan</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-sans text-neutral-500">Deskripsi Event <span className="text-c-red">*</span></Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <CKEditorComponent value={field.value} onChange={field.onChange} />
                  )}
                />
                {errors.description && <p className="text-xs text-c-red font-sans mt-1">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-sans text-neutral-500">Syarat & Ketentuan <span className="text-c-red">*</span></Label>
                <Textarea
                  {...register("terms")}
                  rows={5}
                  placeholder="Contoh: Tiket tidak dapat dikembalikan. Usia minimum 18 tahun. Dilarang membawa makanan dari luar..."
                />
                {errors.terms && <p className="text-xs text-c-red font-sans mt-1">{errors.terms.message}</p>}
              </div>
            </div>
          </div>

          {/* CARD 3 — Kategori Tiket */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-c-blue" />
                <h2 className="font-quick font-semibold text-xl text-neutral-900">Kategori Tiket</h2>
              </div>
              <Button
                type="button"
                onClick={() => append({ name: "", price: 0, quota: 100, saleStart: "", saleEnd: "", benefits: "" })}
                variant="outline"
                size="sm"
                className="font-quick text-xs gap-1 h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Kategori Tiket
              </Button>
            </div>

            {errors.categories && !Array.isArray(errors.categories) && (
              <p className="text-xs text-c-red font-sans">{errors.categories.message}</p>
            )}
            {errors.categories?.root && (
              <p className="text-xs text-c-red font-sans">{errors.categories.root.message}</p>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => {
                const cat = watchedCategories?.[index];
                const isFree = cat !== undefined && Number(cat.price) === 0;
                return (
                  <div key={field.id} className="border border-neutral-200 rounded-lg p-4 sm:p-5 bg-neutral-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-c-blue text-white font-quick font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-quick font-semibold text-sm text-neutral-700">
                          {cat?.name?.trim() || `Kategori ${index + 1}`}
                          {isFree && <span className="ml-2 text-xs text-c-green font-bold font-sans">GRATIS</span>}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="p-2 text-neutral-400 hover:text-c-red hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-sans text-neutral-500">Nama Tiket <span className="text-c-red">*</span></Label>
                        <Input {...register(`categories.${index}.name`)} placeholder="Contoh: VIP, Reguler, Early Bird" className="font-sans h-10 bg-white" />
                        {errors.categories?.[index]?.name && <p className="text-[10px] text-c-red font-sans">{errors.categories[index]?.name?.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-sans text-neutral-500">Harga (Rp) <span className="text-c-red">*</span></Label>
                        <Input type="number" min={0} {...register(`categories.${index}.price`)} placeholder="0" className="font-sans h-10 bg-white" />
                        {errors.categories?.[index]?.price && <p className="text-[10px] text-c-red font-sans">{errors.categories[index]?.price?.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-sans text-neutral-500">Kuota <span className="text-c-red">*</span></Label>
                        <Input type="number" min={1} {...register(`categories.${index}.quota`)} placeholder="100" className="font-sans h-10 bg-white" />
                        {errors.categories?.[index]?.quota && <p className="text-[10px] text-c-red font-sans">{errors.categories[index]?.quota?.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-sans text-neutral-500">Mulai Penjualan <span className="text-c-red">*</span></Label>
                        <Input type="date" {...register(`categories.${index}.saleStart`)} className="font-sans h-10 bg-white" />
                        {errors.categories?.[index]?.saleStart && <p className="text-[10px] text-c-red font-sans">{errors.categories[index]?.saleStart?.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-sans text-neutral-500">Akhir Penjualan <span className="text-c-red">*</span></Label>
                        <Input type="date" {...register(`categories.${index}.saleEnd`)} className="font-sans h-10 bg-white" />
                        {errors.categories?.[index]?.saleEnd && <p className="text-[10px] text-c-red font-sans">{errors.categories[index]?.saleEnd?.message}</p>}
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label className="text-sm font-sans text-neutral-500">Deskripsi Benefit <span className="text-c-red">*</span></Label>
                        <Textarea
                          {...register(`categories.${index}.benefits`)}
                          rows={2}
                          placeholder="Contoh: Free merchandise, akses lounge, welcome drink..."
                          className="font-sans text-sm resize-none bg-white"
                        />
                        {errors.categories?.[index]?.benefits && <p className="text-[10px] text-c-red font-sans">{errors.categories[index]?.benefits?.message}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky Footer Action Bar */}
          <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-10 bg-white border-t border-neutral-200 shadow-md p-4 flex justify-end gap-3">
            <Link href="/user/vendor/tickets">
              <Button type="button" variant="outline" className="font-quick font-semibold h-11 px-6">Batal</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="font-quick font-semibold h-11 px-8 bg-c-blue text-white hover:brightness-95 gap-2">
              <Save className="w-4 h-4" />
              {isSubmitting ? "Menyimpan..." : "Simpan Event"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}