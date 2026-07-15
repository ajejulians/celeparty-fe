"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "./FileUploader";
import { useVendorProductStore } from "@/lib/vendor-product-store";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

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

const editProductSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  priceFrom: z.coerce.number().positive("Harga harus positif"),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif"),
  totalStock: z.coerce.number().min(0, "Total unit tidak boleh negatif"),
  rentalUnit: z.enum(["Hari", "Event", "Bulan"]),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  city: z.string().min(1, "Kota wajib diisi"),
  status: z.enum(["active", "sold_out", "escrow_badge"]),
});

type EditProductFormValues = z.input<typeof editProductSchema>;

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductDialog({ open, onOpenChange }: EditProductDialogProps) {
  const editingProduct = useVendorProductStore((s) => s.editingProduct);
  const closeEditModal = useVendorProductStore((s) => s.closeEditModal);
  const updateProduct = useVendorProductStore((s) => s.updateProduct);

  const form = useForm<EditProductFormValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: "",
      category: "",
      priceFrom: 0,
      stock: 0,
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
        stock: editingProduct.stock,
        totalStock: editingProduct.totalStock,
        rentalUnit: editingProduct.rentalUnit,
        description: editingProduct.description,
        city: editingProduct.city,
        status: editingProduct.status,
      });
    }
  }, [editingProduct, open, form]);

  const handleClose = () => {
    closeEditModal();
    onOpenChange(false);
  };

  const onSubmit = async (data: EditProductFormValues) => {
    if (!editingProduct) return;

    try {
      await new Promise((r) => setTimeout(r, 800));
      updateProduct(editingProduct.slug, {
        name: data.name,
        category: data.category,
        priceFrom: Number(data.priceFrom),
        stock: Number(data.stock),
        totalStock: Number(data.totalStock),
        rentalUnit: data.rentalUnit,
        description: data.description,
        city: data.city,
        status: data.status,
      });
      toast.success("Produk berhasil diperbarui.");
      handleClose();
    } catch {
      toast.error("Gagal memperbarui produk.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>Edit Produk</DialogTitle>
          <DialogDescription>Perbarui informasi produk Anda.</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-4 flex-1">
          <Form {...form}>
            <form id="edit-product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-1">
                  <p className="font-sans font-medium text-xs text-neutral-500 mb-1.5">Foto Produk</p>
                  <FileUploader
                    currentImage={editingProduct?.imageUrl}
                    onFileChange={() => {}}
                  />
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Produk</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nama produk..." className="h-10" />
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
                              <SelectValue placeholder="Pilih kategori" />
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
                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">{formatCurrency(Number(field.value) || 0)}</FormDescription>
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
                          <Select value={field.value} onValueChange={field.onChange}>
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
                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
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
                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kota</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Kota..." className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="sold_out">Habis</SelectItem>
                            <SelectItem value="escrow_badge">Escrow</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} placeholder="Deskripsi produk..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="px-6 py-4 border-t border-neutral-100 shrink-0 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={handleClose} disabled={form.formState.isSubmitting}>
            Batal
          </Button>
          <Button
            type="submit"
            form="edit-product-form"
            disabled={form.formState.isSubmitting}
            className="bg-c-blue text-white hover:bg-c-blue/90"
          >
            {form.formState.isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
