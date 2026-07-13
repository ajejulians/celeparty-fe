"use client";

import { useState } from "react";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductForm } from "@/components/product/ProductForm";
import { TicketForm } from "@/components/product/TicketForm";
import { Package, Ticket } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddProductPage() {
  return (
    <>
      <ErpHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/user/vendor/dashboard" },
          { label: "Produk & Layanan", href: "/user/vendor/products" },
          { label: "Tambah Baru" },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/user/vendor/products" className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-quick font-bold text-2xl text-neutral-900">Tambah Produk / Layanan</h1>
            <p className="font-sans text-sm text-neutral-500 mt-1">Pilih jenis layanan yang ingin Anda tawarkan</p>
          </div>
        </div>

        <Tabs defaultValue="service" className="w-full">
          <TabsList className="mb-6 bg-white border border-neutral-200 p-1 w-full max-w-md h-auto grid grid-cols-2">
            <TabsTrigger value="service" className="font-quick flex items-center gap-2 py-3 data-[state=active]:bg-c-blue data-[state=active]:text-white">
              <Package className="w-4 h-4" /> Sewa Alat / Jasa
            </TabsTrigger>
            <TabsTrigger value="ticket" className="font-quick flex items-center gap-2 py-3 data-[state=active]:bg-c-blue data-[state=active]:text-white">
              <Ticket className="w-4 h-4" /> Tiket Event
            </TabsTrigger>
          </TabsList>

          <TabsContent value="service">
            <ProductForm />
          </TabsContent>

          <TabsContent value="ticket">
            <TicketForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
