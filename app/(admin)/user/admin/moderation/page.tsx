"use client";

import { useState } from "react";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Search, CheckCircle, XCircle, Package, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { Label } from "@/components/ui/label";

const mockPendingItems = [
  { id: "prd-001", type: "product", name: "Sewa Videotron 3x4m Indoor", vendor: "Visual Pro JKT", submitDate: "2026-07-11", status: "pending" },
  { id: "tkt-001", type: "ticket", name: "Konser Musik Indie Fest", vendor: "Eventku Nusantara", submitDate: "2026-07-12", status: "pending" },
];

export default function ModerationPage() {
  const [items, setItems] = useState(mockPendingItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredItems = items.filter(
    (item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menyetujui item ini?")) {
      setItems((prev) => prev.map((item) => item.id === id ? { ...item, status: "approved" } : item));
    }
  };

  const handleRejectClick = (id: string) => {
    setSelectedId(id);
    setIsRejectOpen(true);
  };

  const submitReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectReason.trim().length < 10) {
      alert("Alasan penolakan minimal 10 karakter");
      return;
    }
    setItems((prev) => prev.map((item) => item.id === selectedId ? { ...item, status: "rejected" } : item));
    setIsRejectOpen(false);
    setRejectReason("");
    setSelectedId(null);
  };

  return (
    <>
      <ErpHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/user/admin/dashboard" },
          { label: "Moderasi Konten" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-quick font-bold text-2xl text-neutral-900">Moderasi Konten</h1>
          <p className="font-sans text-sm text-neutral-500 mt-1">Review produk dan tiket baru yang didaftarkan oleh vendor</p>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                placeholder="Cari item atau vendor..."
                className="pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg w-full font-sans focus:outline-none focus:border-c-blue h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto min-w-[700px]">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Tipe</th>
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Nama Item</th>
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Vendor</th>
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Tanggal Submit</th>
                  <th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold font-quick border ${
                        item.type === "product" ? "bg-blue-50 text-c-blue border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"
                      }`}>
                        {item.type === "product" ? "Produk / Jasa" : "Tiket Event"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-neutral-900 font-medium">{item.name}</td>
                    <td className="px-4 py-3 font-sans text-sm text-neutral-600">{item.vendor}</td>
                    <td className="px-4 py-3 font-sans text-xs text-neutral-500">{item.submitDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-sans border ${
                        item.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        item.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        "bg-red-50 text-c-red border-red-200"
                      }`}>
                        {item.status === "pending" ? "Menunggu" : item.status === "approved" ? "Disetujui" : "Ditolak"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.status === "pending" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue" title="Lihat Detail">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleApprove(item.id)} className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50" title="Setujui">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleRejectClick(item.id)} className="p-1.5 rounded-md text-c-red hover:bg-red-50" title="Tolak">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-xs font-sans text-neutral-400">Selesai</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog.Root open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl z-50 p-6 animate-slide-up focus:outline-none">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="font-quick font-bold text-xl text-neutral-900">Tolak Konten</Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            
            <form onSubmit={submitReject} className="space-y-6">
              <div className="space-y-2">
                <Label className="font-sans text-neutral-700">Alasan Penolakan (Wajib)</Label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-red resize-none"
                  rows={4}
                  placeholder="Jelaskan alasan mengapa konten ini ditolak (min. 10 karakter)..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <Dialog.Close asChild>
                  <Button type="button" variant="outline" className="font-quick font-semibold h-11">Batal</Button>
                </Dialog.Close>
                <Button type="submit" className="h-11 font-quick font-semibold bg-c-red text-white hover:brightness-95">Konfirmasi Penolakan</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
