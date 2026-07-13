"use client";

import { useState } from "react";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { getOrdersByVendor } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { EscrowBreakdown } from "@/components/payment/EscrowBreakdown";
import { TicketScan } from "@/components/ticket/TicketScan";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Search,
  Download,
  FileSpreadsheet,
  Check,
  X,
  Package,
  Ticket,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function VendorOrdersPage() {
  const session = useSession();
  const vendorOrders = getOrdersByVendor(session.vendorId);
  const pendingCount = vendorOrders.filter((o) => o.paymentStatus === "pending").length;
  const lunasCount = vendorOrders.filter((o) => o.paymentStatus === "settlement").length;

  const equipmentOrders = vendorOrders.filter((o) => o.total > 1000000); // Mock separation
  const ticketOrders = vendorOrders.filter((o) => o.total <= 1000000);

  return (
    <>
      <ErpHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/user/vendor/dashboard" },
          { label: "Pesanan Masuk" },
        ]}
        notificationCount={3}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-quick font-bold text-2xl text-neutral-900">Pesanan Masuk</h1>
          <p className="font-sans text-sm text-neutral-500 mt-1">
            Kelola semua pesanan dari customer Anda
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Pesanan"
            value={String(vendorOrders.length)}
            icon={<ClipboardList className="w-5 h-5" />}
            variant="blue"
          />
          <StatCard
            label="Pending"
            value={String(pendingCount)}
            icon={<Clock className="w-5 h-5" />}
            variant="amber"
          />
          <StatCard
            label="Lunas"
            value={String(lunasCount)}
            icon={<CheckCircle className="w-5 h-5" />}
            variant="green"
          />
        </div>

        <Tabs defaultValue="equipment" className="w-full">
          <TabsList className="mb-6 bg-white border border-neutral-200">
            <TabsTrigger value="equipment" className="font-quick flex items-center gap-2">
              <Package className="w-4 h-4" /> Sewa Alat / Jasa
            </TabsTrigger>
            <TabsTrigger value="tickets" className="font-quick flex items-center gap-2">
              <Ticket className="w-4 h-4" /> Penjualan Tiket
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipment">
            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="flex flex-col sm:flex-row gap-3 p-4 items-start sm:items-center justify-between border-b border-neutral-100">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      placeholder="Cari nama / no. order..."
                      className="pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg w-56 font-sans focus:outline-none focus:border-c-blue"
                    />
                  </div>
                  <select className="text-sm border border-neutral-200 rounded-lg px-3 py-2 font-sans focus:outline-none focus:border-c-blue text-base min-w-[120px]">
                    <option>Semua Status</option>
                    <option>Lunas</option>
                    <option>Pending</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 text-sm font-sans font-medium text-neutral-600 hover:text-neutral-900 border rounded-lg px-3 py-2 hover:brightness-95 active:scale-[0.98] transition-all">
                    <FileSpreadsheet className="w-4 h-4" /> Export XLSX
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto min-w-[640px]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      {[
                        "No. Order",
                        "Customer",
                        "Produk",
                        "Jadwal Loading",
                        "Total & DP",
                        "Status",
                        "Aksi",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3 text-left"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentOrders.map((o, i) => (
                      <tr
                        key={o.id}
                        className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors ${
                          i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"
                        }`}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-neutral-600">
                          {o.orderId}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-c-blue-50 flex items-center justify-center shrink-0">
                              <span className="font-quick font-bold text-xs text-c-blue">
                                {o.customer.charAt(0)}
                              </span>
                            </div>
                            <span className="font-sans text-sm text-neutral-900">
                              {o.customer}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-sans text-sm text-neutral-700 max-w-[180px] truncate">
                          {o.product}
                        </td>
                        <td className="px-4 py-3 font-sans text-xs text-neutral-500">
                          <p className="font-semibold text-neutral-700">Tgl: {formatDate(o.eventDate)}</p>
                          <p>Lokasi: Jakarta Selatan</p>
                        </td>
                        <td className="px-4 py-3 font-quick font-semibold text-sm">
                          {formatCurrency(o.total)}
                          <div className="text-[10px] font-sans text-neutral-500 mt-1 font-normal">
                            DP 30%: {formatCurrency(o.total * 0.3)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={o.paymentStatus} />
                        </td>
                        <td className="px-4 py-3">
                          {o.vendorStatus === "pending" ? (
                            <div className="flex gap-2">
                              <button
                                className="bg-c-green text-neutral-900 px-3 py-1.5 rounded-md font-quick font-semibold text-xs hover:brightness-95 flex items-center gap-1"
                                onClick={() => alert("Pesanan disetujui")}
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                className="bg-c-red text-white px-3 py-1.5 rounded-md font-quick font-semibold text-xs hover:brightness-95 flex items-center gap-1"
                                onClick={() => alert("Pesanan ditolak")}
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-sans text-neutral-500">Diproses</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Example Escrow Breakdown Integration */}
            <div className="mt-8">
              <h2 className="font-quick font-bold text-lg text-neutral-900 mb-4">
                Simulasi Sistem Escrow
              </h2>
              <div className="max-w-sm">
                <EscrowBreakdown totalPrice={5000000} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tickets">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg border border-neutral-200">
                  <div className="flex flex-col sm:flex-row gap-3 p-4 items-start sm:items-center justify-between border-b border-neutral-100">
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                        <input
                          placeholder="Cari barcode / pembeli..."
                          className="pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg w-56 font-sans focus:outline-none focus:border-c-blue"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 text-sm font-sans font-medium text-neutral-600 hover:text-neutral-900 border rounded-lg px-3 py-2 hover:brightness-95 active:scale-[0.98] transition-all">
                        <Download className="w-4 h-4" /> Export CSV (BOM)
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto min-w-[640px]">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200">
                          {["Barcode", "Penerima", "Event", "Tgl Event", "Aksi"].map((h) => (
                            <th
                              key={h}
                              className="text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3 text-left"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ticketOrders.map((o, i) => (
                          <tr
                            key={o.id}
                            className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors ${
                              i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"
                            }`}
                          >
                            <td className="px-4 py-3 font-mono text-xs text-neutral-600">
                              {o.barcode}
                            </td>
                            <td className="px-4 py-3 font-sans text-sm text-neutral-900">
                              {o.customer}
                            </td>
                            <td className="px-4 py-3 font-sans text-sm text-neutral-700 max-w-[150px] truncate">
                              {o.product}
                            </td>
                            <td className="px-4 py-3 font-sans text-xs text-neutral-500">
                              {formatDate(o.eventDate)}
                            </td>
                            <td className="px-4 py-3">
                              <Button variant="outline" size="sm" className="font-quick text-xs h-8">Detail</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <TicketScan />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
