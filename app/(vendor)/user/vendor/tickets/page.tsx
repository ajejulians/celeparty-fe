import { ErpHeader } from "@/components/layout/ErpHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { orders } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { Ticket, Scan, Search, QrCode, CheckCircle, Circle } from "lucide-react";

export default function VendorTicketsPage() {
  const ticketOrders = orders.filter((o) => o.barcode);
  return (
    <>
      <ErpHeader breadcrumbs={[{ label: "Dashboard", href: "/user/vendor/dashboard" }, { label: "Tiket Event" }]} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="font-quick font-bold text-2xl text-neutral-900">Tiket Event</h1><p className="font-sans text-sm text-neutral-500 mt-1">Kelola dan scan tiket event Anda</p></div>
          <button className="inline-flex items-center gap-2 bg-c-green text-neutral-900 font-quick font-semibold text-sm px-4 py-2.5 rounded-lg min-h-[44px] hover:brightness-95 active:scale-[0.98] transition-all"><Scan className="w-4 h-4" />Scan Barcode</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Tiket" value={String(ticketOrders.length)} icon={<Ticket className="w-5 h-5"/>} variant="blue"/>
          <StatCard label="Tiket Aktif" value={String(ticketOrders.filter(o=>o.paymentStatus==="settlement").length)} icon={<CheckCircle className="w-5 h-5"/>} variant="green"/>
          <StatCard label="Sudah Digunakan" value="0" icon={<Circle className="w-5 h-5"/>} variant="amber"/>
          <StatCard label="Scan Hari Ini" value="0" icon={<Scan className="w-5 h-5"/>} variant="blue"/>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="p-4 border-b border-neutral-100 flex items-center gap-3">
            <div className="relative flex-1 max-w-xs"><Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400"/><input placeholder="Cari barcode..." className="pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg w-full font-sans focus:outline-none focus:border-c-blue"/></div>
            <select className="text-sm border border-neutral-200 rounded-lg px-3 py-2 font-sans focus:outline-none focus:border-c-blue"><option>Semua Tiket</option></select>
          </div>
          <div className="overflow-x-auto"><table className="w-full min-w-[700px]"><thead><tr className="bg-neutral-50 border-b border-neutral-200"><th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Barcode</th><th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Penerima</th><th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Event</th><th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Tgl Event</th><th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Status</th><th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Scan</th></tr></thead><tbody>{ticketOrders.map((o,i)=><tr key={o.id} className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 ${i%2===0?"bg-white":"bg-neutral-50/50"}`}><td className="px-4 py-3 font-mono text-xs text-neutral-600">{o.barcode}</td><td className="px-4 py-3 font-sans text-sm text-neutral-900">{o.customer}</td><td className="px-4 py-3 font-sans text-sm text-neutral-700 max-w-[200px] truncate">{o.product}</td><td className="px-4 py-3 font-sans text-xs text-neutral-500">{formatDate(o.eventDate)}</td><td className="px-4 py-3 text-center"><StatusBadge status="active"/></td><td className="px-4 py-3 text-center"><button className="inline-flex items-center gap-1 bg-c-blue text-white font-quick font-semibold text-xs px-3 py-1.5 rounded-md hover:bg-c-blue/90"><QrCode className="w-3.5 h-3.5"/>Scan</button></td></tr>)}</tbody></table></div>
        </div>
      </div>
    </>
  );
}
