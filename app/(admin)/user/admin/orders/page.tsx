import { ErpHeader } from "@/components/layout/ErpHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { orders } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { ClipboardList, Search, FileSpreadsheet, Download, Eye } from "lucide-react";

export default function AdminOrdersPage() {
  const totalRevenue = orders.filter((o) => o.paymentStatus === "settlement").reduce((s, o) => s + o.total, 0);
  return (
    <>
      <ErpHeader breadcrumbs={[{ label: "Dashboard", href: "/user/admin/dashboard" }, { label: "Semua Pesanan" }]} notificationCount={5} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8"><h1 className="font-quick font-bold text-2xl text-neutral-900">Semua Pesanan</h1><p className="font-sans text-sm text-neutral-500 mt-1">Kelola seluruh pesanan di platform</p></div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Pesanan" value={String(orders.length)} icon={<ClipboardList className="w-5 h-5"/>} variant="blue"/>
          <StatCard label="Pesanan Lunas" value={String(orders.filter(o=>o.paymentStatus==="settlement").length)} icon={<ClipboardList className="w-5 h-5"/>} variant="green"/>
          <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon={<ClipboardList className="w-5 h-5"/>} variant="blue"/>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="flex flex-col sm:flex-row gap-3 p-4 items-start sm:items-center justify-between border-b border-neutral-100">
            <div className="flex gap-2"><div className="relative"><Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400"/><input placeholder="Cari pesanan..." className="pl-9 pr-3 py-2 text-sm border rounded-lg w-56 font-sans focus:outline-none focus:border-c-blue"/></div><select className="text-sm border rounded-lg px-3 py-2 font-sans"><option>Semua Status</option></select></div>
            <div className="flex gap-2"><button className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 border rounded-lg px-3 py-2"><Download className="w-4 h-4"/>CSV</button><button className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 border rounded-lg px-3 py-2"><FileSpreadsheet className="w-4 h-4"/>XLSX</button></div>
          </div>
          <div className="overflow-x-auto"><table className="w-full min-w-[900px]"><thead><tr className="bg-neutral-50 border-b border-neutral-200"><th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">No. Order</th><th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Customer</th><th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Produk</th><th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Vendor</th><th className="text-right text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Total</th><th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Status</th><th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Tgl Event</th><th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Aksi</th></tr></thead><tbody>{orders.map((o,i)=><tr key={o.id} className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 ${i%2===0?"bg-white":"bg-neutral-50/50"}`}><td className="px-4 py-3 font-mono text-xs text-neutral-600">{o.orderId}</td><td className="px-4 py-3 font-sans text-sm text-neutral-900">{o.customer}</td><td className="px-4 py-3 font-sans text-sm text-neutral-700 max-w-[180px] truncate">{o.product}</td><td className="px-4 py-3 font-sans text-xs text-neutral-500">Jakarta Audio Pro</td><td className="px-4 py-3 font-quick font-semibold text-sm text-right">{formatCurrency(o.total)}</td><td className="px-4 py-3 text-center"><StatusBadge status={o.paymentStatus}/></td><td className="px-4 py-3 font-sans text-xs text-neutral-500">{formatDate(o.eventDate)}</td><td className="px-4 py-3 text-center"><button className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue"><Eye className="w-4 h-4"/></button></td></tr>)}</tbody></table></div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100"><p className="text-sm font-sans text-neutral-500">Menampilkan {orders.length} pesanan</p><div className="flex gap-2"><button className="w-9 h-9 rounded-lg border text-sm text-neutral-500" disabled>&laquo;</button><button className="w-9 h-9 rounded-lg bg-c-blue text-white text-sm font-semibold">1</button><button className="w-9 h-9 rounded-lg border text-sm text-neutral-500" disabled>&raquo;</button></div></div>
        </div>
      </div>
    </>
  );
}
