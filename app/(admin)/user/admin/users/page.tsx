import { ErpHeader } from "@/components/layout/ErpHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, Search, Eye, Shield, User } from "lucide-react";

const users = [
  { id: "u-001", name: "Budi Santoso", email: "customer@celeparty.com", role: "customer", phone: "081234567890", joinDate: "2026-06-10" },
  { id: "u-002", name: "Siti Nurhaliza", email: "siti@celeparty.com", role: "customer", phone: "081298765432", joinDate: "2026-06-15" },
  { id: "u-003", name: "Ahmad Fauzi", email: "ahmad@celeparty.com", role: "customer", phone: "081355566677", joinDate: "2026-07-01" },
];

export default function AdminUsersPage() {
  return (
    <>
      <ErpHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/user/admin/dashboard" },
          { label: "Pengguna" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-quick font-bold text-2xl text-neutral-900">Pengguna</h1>
          <p className="font-sans text-sm text-neutral-500 mt-1">Kelola semua pengguna platform</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Pengguna" value={String(users.length + 3)} icon={<Users className="w-5 h-5" />} variant="blue" />
          <StatCard label="Customer" value={String(users.length)} icon={<User className="w-5 h-5" />} variant="green" />
          <StatCard label="Admin" value="1" icon={<Shield className="w-5 h-5" />} variant="amber" />
        </div>

        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="p-4 border-b border-neutral-100">
            <div className="relative max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input placeholder="Cari pengguna..." className="pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg w-full font-sans focus:outline-none focus:border-c-blue" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Nama</th>
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Email</th>
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">No. HP</th>
                  <th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Role</th>
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Tgl Daftar</th>
                  <th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user.id} className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-c-blue-100 flex items-center justify-center">
                          <span className="font-quick font-bold text-c-blue text-xs">{user.name.charAt(0)}</span>
                        </div>
                        <span className="font-sans font-medium text-sm text-neutral-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-neutral-600">{user.email}</td>
                    <td className="px-4 py-3 font-sans text-xs text-neutral-600">{user.phone}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-sans font-semibold bg-c-blue-50 text-c-blue border border-c-blue-100">
                        Customer
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-neutral-500">{new Date(user.joinDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue transition-colors" aria-label="Lihat">
                        <Eye className="w-4 h-4" />
                      </button>
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
