"use client";

import { useState } from "react";
import { orders } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Clock, Ticket } from "lucide-react";

export default function BookingsPage() {
  const [filter, setFilter] = useState("Semua");
  const filters = ["Semua", "Menunggu Pembayaran", "Dibayar", "Selesai"];

  // Mocking the user's orders, in a real app this would be filtered by user ID
  const userOrders = orders.filter(o => o.customer === "Budi Santoso"); // using Budi Santoso as mock logged in user

  const filteredOrders = userOrders.filter(order => {
    if (filter === "Semua") return true;
    if (filter === "Menunggu Pembayaran") return order.paymentStatus === "pending";
    if (filter === "Dibayar") return order.paymentStatus === "settlement" && order.vendorStatus === "pending";
    if (filter === "Selesai") return order.paymentStatus === "settlement" && order.vendorStatus === "approved";
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <h1 className="font-quick font-bold text-3xl text-neutral-900 mb-6">Booking Saya</h1>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-sans font-medium transition-all ${
              filter === f
                ? "bg-c-blue text-white shadow-md"
                : "bg-white text-neutral-600 border border-neutral-200 hover:border-c-blue hover:text-c-blue"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
            <Ticket className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-sans">Tidak ada transaksi ditemukan.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-card-hover transition-all">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-sans text-neutral-500 font-medium bg-neutral-100 px-2.5 py-1 rounded-full">
                    {order.orderId}
                  </span>
                  <span className="text-xs font-sans text-neutral-500">
                    {new Date(order.orderDate).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <h3 className="font-quick font-bold text-lg text-neutral-900 mb-1">{order.product}</h3>
                <p className="font-sans text-sm text-neutral-500 mb-2">Variant: {order.variant} • Qty: {order.qty}</p>
                <div className="flex items-center gap-2">
                  {order.paymentStatus === "pending" ? (
                    <span className="flex items-center gap-1.5 text-xs font-sans text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" /> Menunggu Pembayaran
                    </span>
                  ) : order.paymentStatus === "settlement" && order.vendorStatus === "pending" ? (
                    <span className="flex items-center gap-1.5 text-xs font-sans text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dibayar
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-sans text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-neutral-100">
                <p className="text-sm font-sans text-neutral-500 mb-1">Total Belanja</p>
                <p className="font-quick font-bold text-xl text-c-blue">{formatCurrency(order.total)}</p>
                {order.paymentStatus === "pending" && (
                  <button className="mt-3 w-full md:w-auto px-6 py-2 bg-c-green text-neutral-900 font-quick font-semibold text-sm rounded-lg hover:brightness-95 transition-all">
                    Bayar Sekarang
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
