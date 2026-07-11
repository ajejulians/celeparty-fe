import { ErpHeader } from "@/components/layout/ErpHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart3, DollarSign, ClipboardList, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminReportsPage() {
  return (
    <>
      <ErpHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/user/admin/dashboard" },
          { label: "Laporan" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-quick font-bold text-2xl text-neutral-900">Laporan</h1>
          <p className="font-sans text-sm text-neutral-500 mt-1">Analisis dan laporan platform</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Revenue Bulan Ini" value={formatCurrency(45000000)} icon={<DollarSign className="w-5 h-5" />} variant="green" trend={{ direction: "up", value: "18%" }} />
          <StatCard label="Pesanan Bulan Ini" value="12" icon={<ClipboardList className="w-5 h-5" />} variant="blue" trend={{ direction: "up", value: "5" }} />
          <StatCard label="Vendor Baru" value="2" icon={<Users className="w-5 h-5" />} variant="amber" />
          <StatCard label="Rata-rata Order" value={formatCurrency(3750000)} icon={<BarChart3 className="w-5 h-5" />} variant="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="font-quick font-bold text-lg text-neutral-900 mb-4">Revenue Bulanan</h2>
            <div className="h-48 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm font-sans text-neutral-400">Grafik revenue akan ditampilkan di sini</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="font-quick font-bold text-lg text-neutral-900 mb-4">Pesanan per Kategori</h2>
            <div className="h-48 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm font-sans text-neutral-400">Grafik kategori akan ditampilkan di sini</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
