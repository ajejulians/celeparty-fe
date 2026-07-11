import { ErpHeader } from "@/components/layout/ErpHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Store, Search, Eye, CheckCircle, XCircle } from "lucide-react";

const vendors = [
  { id: "v-001", name: "Jakarta Audio Pro", email: "vendor@celeparty.com", city: "Jakarta", status: "approved", products: 3, joinDate: "2026-06-15" },
  { id: "v-002", name: "Bandung Visual Story", email: "bandung@celeparty.com", city: "Bandung", status: "approved", products: 2, joinDate: "2026-06-20" },
  { id: "v-003", name: "Surabaya Decor House", email: "surabaya@celeparty.com", city: "Surabaya", status: "pending", products: 1, joinDate: "2026-07-01" },
];

export default function AdminVendorsPage() {
  return (
    <>
      <ErpHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/user/admin/dashboard" },
          { label: "Vendor" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-quick font-bold text-2xl text-neutral-900">Vendor</h1>
          <p className="font-sans text-sm text-neutral-500 mt-1">Kelola semua vendor di platform</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Vendor" value={String(vendors.length)} icon={<Store className="w-5 h-5" />} variant="blue" />
          <StatCard label="Aktif" value={String(vendors.filter(v => v.status === "approved").length)} icon={<CheckCircle className="w-5 h-5" />} variant="green" />
          <StatCard label="Menunggu" value={String(vendors.filter(v => v.status === "pending").length)} icon={<Store className="w-5 h-5" />} variant="amber" />
        </div>

        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="p-4 border-b border-neutral-100">
            <div className="relative max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input placeholder="Cari vendor..." className="pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg w-full font-sans focus:outline-none focus:border-c-blue" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Vendor</th>
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Email</th>
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Kota</th>
                  <th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Produk</th>
                  <th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor, i) => (
                  <tr key={vendor.id} className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-c-blue flex items-center justify-center">
                          <span className="font-quick font-bold text-white text-xs">{vendor.name.charAt(0)}{vendor.name.split(" ")[1]?.charAt(0) || ""}</span>
                        </div>
                        <span className="font-sans font-medium text-sm text-neutral-900">{vendor.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-neutral-600">{vendor.email}</td>
                    <td className="px-4 py-3 font-sans text-xs text-neutral-600">{vendor.city}</td>
                    <td className="px-4 py-3 font-quick font-semibold text-sm text-neutral-900 text-center">{vendor.products}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-sans font-semibold border ${vendor.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                        {vendor.status === "approved" ? "Dikonfirmasi" : "Menunggu"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue transition-colors" aria-label="Lihat">
                          <Eye className="w-4 h-4" />
                        </button>
                        {vendor.status === "pending" && (
                          <>
                            <button className="p-1.5 rounded-md text-neutral-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors" aria-label="Terima">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-md text-neutral-500 hover:bg-red-50 hover:text-c-red transition-colors" aria-label="Tolak">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
