"use client";

import { ErpHeader } from "@/components/layout/ErpHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { getOrdersByVendor } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { ClipboardList, Clock, CheckCircle, Search, Download, FileSpreadsheet, Check, X } from "lucide-react";

export default function VendorOrdersPage() {
  const session = useSession();
  const vendorOrders = getOrdersByVendor(session.vendorId);
  const pendingCount = vendorOrders.filter((o) => o.paymentStatus === "pending").length;
  const lunasCount = vendorOrders.filter((o) => o.paymentStatus === "settlement").length;

  return (
    <>
      <ErpHeader breadcrumbs={[{ label: "Dashboard", href: "/user/vendor/dashboard" }, { label: "Pesanan Masuk" }]} notificationCount={3} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-quick font-bold text-2xl text-neutral-900">Pesanan Masuk</h1>
          <p className="font-sans text-sm text-neutral-500 mt-1">Kelola semua pesanan dari customer Anda</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Pesanan" value={String(vendorOrders.length)} icon={<ClipboardList className="w-5 h-5" />} variant="blue" />
          <StatCard label="Pending" value={String(pendingCount)} icon={<Clock className="w-5 h-5" />} variant="amber" />
          <StatCard label="Lunas" value={String(lunasCount)} icon={<CheckCircle className="w-5 h-5" />} variant="green" />
        </div>

        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="flex flex-col sm:flex-row gap-3 p-4 items-start sm:items-center justify-between border-b border-neutral-100">
            <div className="flex gap-2">
              <div className="relative"><Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" /><input placeholder="Cari nama / no. order..." className="pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg w-56 font-sans focus:outline-none focus:border-c-blue" /></div>
              <select className="text-sm border border-neutral-200 rounded-lg px-3 py-2 font-sans focus:outline-none focus:border-c-blue"><option>Semua Status</option><option>Lunas</option><option>Pending</option></select>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 text-sm font-sans font-medium text-neutral-600 hover:text-neutral-900 border rounded-lg px-3 py-2 hover:brightness-95 active:scale-[0.98] transition-all"><Download className="w-4 h-4" />Export CSV</button>
              <button className="flex items-center gap-1.5 text-sm font-sans font-medium text-neutral-600 hover:text-neutral-900 border rounded-lg px-3 py-2 hover:brightness-95 active:scale-[0.98] transition-all"><FileSpreadsheet className="w-4 h-4" />Export XLSX</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead><tr className="bg-neutral-50 border-b border-neutral-200">{["No. Order","Customer","Produk","Qty","Total","Status Bayar","Aksi"].map(h=><th key={h} className="text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3 text-left">{h}</th>)}</tr></thead>
              <tbody>
                {vendorOrders.map((o, i) => (
                  <tr key={o.id} className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}`}>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-600">{o.orderId}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-c-blue-50 flex items-center justify-center shrink-0">
                        <span className="font-quick font-bold text-xs text-c-blue">
                          {o.customer.charAt(0)}
                        </span>
                      </div>
                      <span className="font-sans text-sm text-neutral-900">{o.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-neutral-700 max-w-[200px] truncate">{o.product}</td>
                  <td className="px-4 py-3 text-sm text-center">{o.qty}</td>
                  <td className="px-4 py-3 font-quick font-semibold text-sm text-right">{formatCurrency(o.total)}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={o.paymentStatus} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1.5">
                      {o.vendorStatus==="pending"&&<><button className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-quick font-semibold text-xs px-3 py-1.5 rounded-md hover:brightness-95 active:scale-[0.98] transition-all"><Check className="w-3.5 h-3.5"/>Terima</button><button className="flex items-center gap-1 border border-c-red text-c-red bg-white hover:bg-c-red-50 font-quick font-semibold text-xs px-3 py-1.5 rounded-md hover:brightness-95 active:scale-[0.98] transition-all"><X className="w-3.5 h-3.5"/>Tolak</button></>}
                      {o.vendorStatus==="approved"&&<StatusBadge status="approved"/>}
                      {o.vendorStatus==="rejected"&&<StatusBadge status="rejected"/>}
                    </div>
                  </td>
                </tr>))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100"><p className="text-sm font-sans text-neutral-500">Menampilkan {vendorOrders.length} pesanan</p><div className="flex gap-2"><button className="w-9 h-9 rounded-lg border text-sm text-neutral-500" disabled>&laquo;</button><button className="w-9 h-9 rounded-lg bg-c-blue text-white text-sm font-semibold">1</button><button className="w-9 h-9 rounded-lg border text-sm text-neutral-500" disabled>&raquo;</button></div></div>
        </div>
      </div>
    </>
  );
}
