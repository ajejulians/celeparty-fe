"use client";

import { useState } from "react";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const CKEditorComponent = dynamic(() => import("@/components/blog/CKEditorComponent"), { ssr: false, loading: () => <div className="h-64 bg-neutral-100 rounded-lg animate-pulse" /> });

const blogSchema = z.object({
  title: z.string().min(5, "Judul terlalu pendek"),
  category: z.string().min(1, "Pilih kategori"),
  excerpt: z.string().min(10, "Ringkasan terlalu pendek"),
  content: z.string().min(20, "Konten terlalu pendek"),
  relatedProducts: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function CreateBlogPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    mode: "onBlur",
    defaultValues: {
      content: "",
    }
  });

  const onSubmit = async (data: BlogFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      alert("Artikel berhasil disimpan!");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <ErpHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/user/admin/dashboard" },
          { label: "Blog", href: "/user/admin/blog" },
          { label: "Tulis Artikel" },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/user/admin/blog" className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-quick font-bold text-2xl text-neutral-900">Tulis Artikel Baru</h1>
            <p className="font-sans text-sm text-neutral-500 mt-1">Buat konten menarik untuk pengguna</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-quick text-lg text-c-blue">Informasi Artikel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-sans text-neutral-700">Judul Artikel</Label>
                  <Input {...register("title")} placeholder="Contoh: 5 Tips Memilih Vendor Dokumentasi" className="font-sans text-base h-11" />
                  {errors.title && <p className="text-xs text-c-red font-sans">{errors.title.message}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-sans text-neutral-700">Kategori</Label>
                    <select
                      {...register("category")}
                      className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-blue"
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="Tips & Trik">Tips & Trik</option>
                      <option value="Inspirasi">Inspirasi</option>
                      <option value="Berita">Berita</option>
                      <option value="Panduan">Panduan</option>
                    </select>
                    {errors.category && <p className="text-xs text-c-red font-sans">{errors.category.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="font-sans text-neutral-700">Tautan Produk/Tiket Terkait (Opsional)</Label>
                    <Input {...register("relatedProducts")} placeholder="Contoh: PD-001, TC-002" className="font-sans text-base h-11" />
                    <p className="text-xs text-neutral-500 font-sans">Pisahkan dengan koma jika lebih dari satu</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans text-neutral-700">Ringkasan (Excerpt)</Label>
                  <textarea
                    {...register("excerpt")}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-blue resize-none"
                    placeholder="Tulis ringkasan singkat artikel..."
                  />
                  {errors.excerpt && <p className="text-xs text-c-red font-sans">{errors.excerpt.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="font-sans text-neutral-700">Konten Artikel</Label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <CKEditorComponent value={field.value} onChange={field.onChange} />
                    )}
                  />
                  {errors.content && <p className="text-xs text-c-red font-sans">{errors.content.message}</p>}
                </div>
              </CardContent>
              <CardFooter className="bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3 rounded-b-lg">
                <Link href="/user/admin/blog">
                  <Button type="button" variant="outline" className="font-quick font-semibold h-11">
                    Batal
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="bg-c-blue text-white font-quick font-semibold h-11 px-6 hover:brightness-95">
                  <Save className="w-4 h-4 mr-2" /> {isSubmitting ? "Menyimpan..." : "Simpan Artikel"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </>
  );
}
