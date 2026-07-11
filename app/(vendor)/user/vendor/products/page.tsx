import { ErpHeader } from "@/components/layout/ErpHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { products } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { Package, Plus, Search, Pencil, Eye } from "lucide-react";

export default function VendorProductsPage() {
  return (
    <>
      <ErpHeader breadcrumbs={[{ label: "Dashboard", href: "/user/vendor/dashboard" }, { label: "Produk & Jasa" }]} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="font-quick font-bold text-2xl text-neutral-900">Produk & Jasa</h1><p className="font-sans text-sm text-neutral-500 mt-1">Kelola produk dan layanan Anda</p></div>
          <button className="inline-flex items-center gap-2 bg-c-blue text-white font-quick font-semibold text-sm px-4 py-2.5 rounded-lg min-h-[44px] hover:bg-c-blue/90 active:scale-[0.98] transition-all"><Plus className="w-4 h-4" />Tambah Produk</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Produk" value={String(products.length)} icon={<Package className="w-5 h-5" />} variant="blue" />
          <StatCard label="Aktif" value={String(products.filter(p => p.status === "active").length)} icon={<Eye className="w-5 h-5" />} variant="green" />
          <StatCard label="Tidak Aktif" value={String(products.filter(p => p.status !== "active").length)} icon={<Package className="w-5 h-5" />} variant="red" />
        </div>
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="p-4 border-b border-neutral-100"><div className="relative max-w-xs"><Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" /><input placeholder="Cari produk..." className="pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg w-full font-sans focus:outline-none focus:border-c-blue" /></div></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[600px]"><thead><tr className="bg-neutral-50 border-b border-neutral-200"><th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Produk</th><th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Kategori</th><th className="text-right text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Harga</th><th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Status</th><th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Aksi</th></tr></thead><tbody>{products.map((p,i)=><tr key={p.slug} className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 ${i%2===0?"bg-white":"bg-neutral-50/50"}`}><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-md bg-neutral-100 shrink-0"/><div><p className="font-sans font-medium text-sm text-neutral-900 line-clamp-1">{p.name}</p><p className="text-xs font-sans text-neutral-500">{p.city}</p></div></div></td><td className="px-4 py-3 font-sans text-xs text-neutral-600">{p.category}</td><td className="px-4 py-3 font-quick font-semibold text-sm text-right">{formatCurrency(p.priceFrom)}</td><td className="px-4 py-3 text-center"><StatusBadge status={p.status}/></td><td className="px-4 py-3"><div className="flex justify-center gap-1"><button className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue"><Pencil className="w-4 h-4"/></button><button className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue"><Eye className="w-4 h-4"/></button></div></td></tr>)}</tbody></table></div>
        </div>
      </div>
    </>
  );
}
