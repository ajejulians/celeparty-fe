import { ErpHeader } from "@/components/layout/ErpHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatCurrency } from "@/lib/utils";
import { Wallet, ArrowUpRight, ArrowDownLeft, Download } from "lucide-react";

const transactions = [
  { id: "trx-001", type: "credit", description: "Pembayaran INV-20260812-001", amount: 2500000, date: "2026-07-10" },
  { id: "trx-002", type: "debit", description: "Penarikan ke Bank BCA", amount: 1000000, date: "2026-07-08" },
  { id: "trx-003", type: "credit", description: "Pembayaran INV-20260905-002", amount: 6000000, date: "2026-07-05" },
];

export default function VendorWalletPage() {
  const balance = 21500000;
  return (
    <>
      <ErpHeader breadcrumbs={[{ label: "Dashboard", href: "/user/vendor/dashboard" }, { label: "Wallet & Saldo" }]} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8"><h1 className="font-quick font-bold text-2xl text-neutral-900">Wallet & Saldo</h1><p className="font-sans text-sm text-neutral-500 mt-1">Kelola saldo dan riwayat transaksi Anda</p></div>
        <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6"><div className="w-14 h-14 bg-c-blue-50 rounded-xl flex items-center justify-center"><Wallet className="w-7 h-7 text-c-blue"/></div><div><p className="font-sans text-sm text-neutral-500">Saldo Tersedia</p><p className="font-quick font-bold text-3xl text-neutral-900">{formatCurrency(balance)}</p></div></div>
          <button className="inline-flex items-center gap-2 bg-c-green text-neutral-900 font-quick font-semibold text-sm px-6 py-3 rounded-lg min-h-[44px] hover:brightness-95 active:scale-[0.98] transition-all"><ArrowUpRight className="w-4 h-4"/>Tarik Saldo</button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard label="Total Masuk" value={formatCurrency(transactions.filter(t=>t.type==="credit").reduce((s,t)=>s+t.amount,0))} icon={<ArrowDownLeft className="w-5 h-5"/>} variant="green"/>
          <StatCard label="Total Keluar" value={formatCurrency(transactions.filter(t=>t.type==="debit").reduce((s,t)=>s+t.amount,0))} icon={<ArrowUpRight className="w-5 h-5"/>} variant="red"/>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between"><h2 className="font-quick font-bold text-lg text-neutral-900">Riwayat Transaksi</h2><button className="flex items-center gap-1.5 text-xs font-sans font-medium text-neutral-600 hover:text-neutral-900 border rounded-lg px-3 py-1.5"><Download className="w-3.5 h-3.5"/>Export</button></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[600px]"><thead><tr className="bg-neutral-50 border-b border-neutral-200"><th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Deskripsi</th><th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Tanggal</th><th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Tipe</th><th className="text-right text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Jumlah</th></tr></thead><tbody>{transactions.map((t,i)=><tr key={t.id} className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 ${i%2===0?"bg-white":"bg-neutral-50/50"}`}><td className="px-4 py-3 font-sans text-sm text-neutral-900">{t.description}</td><td className="px-4 py-3 font-sans text-xs text-neutral-500">{new Date(t.date).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</td><td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-sans font-semibold ${t.type==="credit"?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700"}`}>{t.type==="credit"?<ArrowDownLeft className="w-3 h-3"/>:<ArrowUpRight className="w-3 h-3"/>}{t.type==="credit"?"Masuk":"Keluar"}</span></td><td className={`px-4 py-3 font-quick font-semibold text-sm text-right ${t.type==="credit"?"text-status-success":"text-c-red"}`}>{t.type==="credit"?"+":"-"}{formatCurrency(t.amount)}</td></tr>)}</tbody></table></div>
        </div>
      </div>
    </>
  );
}
