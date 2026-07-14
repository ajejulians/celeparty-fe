"use client";

import { useState } from "react";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { getProductsByVendor, type Product } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Plus, Search, Pencil, Eye, ImageOff } from "lucide-react";
import Link from "next/link";

/* ─── helpers ─── */

function ProductThumb({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);

  if (!product.imageUrl || failed) {
    return (
      <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
        <ImageOff className="w-5 h-5 text-slate-400" />
      </div>
    );
  }

  return (
    <img
      src={product.imageUrl}
      alt={product.name}
      className="w-16 h-16 rounded-lg object-cover border border-neutral-100 shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

function ProductInfo({ product }: { product: Product }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-quick font-semibold text-sm text-neutral-900 line-clamp-1">{product.name}</p>
        {product.isNegotiable && (
          <Badge variant="success" className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 border-green-200 shrink-0">
            Bisa Nego
          </Badge>
        )}
      </div>
      <p className="font-sans text-xs text-neutral-400 mt-0.5">{product.category}</p>
    </div>
  );
}

function PriceCell({ product }: { product: Product }) {
  return (
    <div className="text-right font-quick font-semibold text-sm text-neutral-900 whitespace-nowrap">
      {formatCurrency(product.priceFrom)}
      <span className="font-sans font-normal text-xs text-neutral-400 ml-1">/ {product.rentalUnit}</span>
    </div>
  );
}

function PriceMobile({ product }: { product: Product }) {
  return (
    <p className="font-quick font-semibold text-sm text-neutral-900">
      {formatCurrency(product.priceFrom)}
      <span className="font-sans font-normal text-xs text-neutral-400 ml-1">/ {product.rentalUnit}</span>
    </p>
  );
}

/* ─── table row ─── */

function DesktopProductRow({ product }: { product: Product }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <ProductThumb product={product} />
          <ProductInfo product={product} />
        </div>
      </TableCell>
      <TableCell className="font-sans text-xs text-neutral-600">{product.category}</TableCell>
      <TableCell className="text-right">
        <PriceCell product={product} />
      </TableCell>
      <TableCell className="text-center">
        <StatusBadge status={product.status} />
      </TableCell>
      <TableCell>
        <div className="flex justify-center gap-1">
          <button className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue transition-colors" title="Edit">
            <Pencil className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue transition-colors" title="Lihat">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}

/* ─── mobile card ─── */

function MobileProductCard({ product }: { product: Product }) {
  return (
    <Card className="rounded-xl border-neutral-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <ProductThumb product={product} />
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-quick font-semibold text-sm text-neutral-900 line-clamp-2">{product.name}</p>
                {product.isNegotiable && (
                  <Badge variant="success" className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 border-green-200 shrink-0">
                    Bisa Nego
                  </Badge>
                )}
              </div>
              <p className="font-sans text-xs text-neutral-400 mt-1">{product.category} · {product.city}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PriceMobile product={product} />
                <StatusBadge status={product.status} />
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue transition-colors" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue transition-colors" title="Lihat">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── page ─── */

export default function VendorProductsPage() {
  const session = useSession();
  const vendorProducts = getProductsByVendor(session.vendorId);
  const [search, setSearch] = useState("");

  const filtered = search
    ? vendorProducts.filter((p) => {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
        );
      })
    : vendorProducts;

  return (
    <>
      <ErpHeader breadcrumbs={[{ label: "Dashboard", href: "/user/vendor/dashboard" }, { label: "Produk & Jasa" }]} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-quick font-bold text-2xl text-neutral-900">Produk &amp; Jasa</h1>
            <p className="font-sans text-sm text-neutral-500 mt-1">Kelola produk sewa dan jasa vendor Anda</p>
          </div>
          <Link
            href="/user/vendor/products/add-product"
            className="inline-flex items-center gap-2 bg-c-blue text-white font-quick font-semibold text-sm px-4 py-2.5 rounded-lg min-h-[44px] hover:bg-c-blue/90 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Produk" value={String(vendorProducts.length)} icon={<Package className="w-5 h-5" />} variant="blue" />
          <StatCard label="Aktif" value={String(vendorProducts.filter((p) => p.status === "active").length)} icon={<Eye className="w-5 h-5" />} variant="green" />
          <StatCard label="Tidak Aktif" value={String(vendorProducts.filter((p) => p.status !== "active").length)} icon={<Package className="w-5 h-5" />} variant="red" />
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
          <div className="p-4 border-b border-neutral-100">
            <div className="relative max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                placeholder="Cari produk..."
                className="pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg w-full font-sans focus:outline-none focus:border-c-blue"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Harga Sewa</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((p) => <DesktopProductRow key={p.slug} product={p} />)
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center font-sans text-sm text-neutral-400 py-12">
                      Produk tidak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3 p-4">
            {filtered.length > 0 ? (
              filtered.map((p) => <MobileProductCard key={p.slug} product={p} />)
            ) : (
              <p className="text-center font-sans text-sm text-neutral-400 py-12">Produk tidak ditemukan.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
