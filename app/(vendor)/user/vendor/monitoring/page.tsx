"use client";

import { useMemo } from "react";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders, type Order } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { format, differenceInDays, isAfter } from "date-fns";
import { id } from "date-fns/locale";
import { Package, Users, AlertTriangle, Clock } from "lucide-react";

type RentalItem = Order & {
  startDate: string;
  endDate: string;
  borrowerName: string;
};

const mockRentals: RentalItem[] = [
  ...orders.map((o) => ({
    ...o,
    startDate: o.orderDate,
    endDate: o.eventDate,
    borrowerName: o.customer,
  })),
];

export default function MonitoringPage() {
  const session = useSession();
  const vendorOrders = mockRentals.filter((o) => o.vendorId === session.vendorId);

  const stats = useMemo(() => {
    const active = vendorOrders.filter(
      (o) => o.paymentStatus === "settlement" || o.paymentStatus === "pending"
    );
    const overdue = vendorOrders.filter((o) => {
      const end = new Date(o.endDate);
      return isAfter(new Date(), end) && o.paymentStatus !== "cancelled" && o.paymentStatus !== "failed";
    });

    return {
      totalActive: vendorOrders.filter((o) => o.paymentStatus !== "cancelled" && o.paymentStatus !== "failed").length,
      totalAmount: active.reduce((s, o) => s + o.total, 0),
      activeItems: active.length,
      overdueCount: overdue.length,
    };
  }, [vendorOrders]);

  return (
    <>
      <ErpHeader breadcrumbs={[{ label: "Dashboard", href: "/user/vendor/dashboard" }, { label: "Monitoring" }]} />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-quick font-bold text-2xl text-neutral-900">Monitoring</h1>
          <p className="font-sans text-sm text-neutral-500 mt-1">Pantau barang yang sedang disewa</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">Transaksi Aktif</CardTitle>
              <Users className="w-5 h-5 text-c-blue" />
            </CardHeader>
            <CardContent>
              <p className="font-quick font-bold text-2xl text-neutral-900">{stats.totalActive}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">Total Nilai Sewa</CardTitle>
              <Package className="w-5 h-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <p className="font-quick font-bold text-2xl text-neutral-900">{formatCurrency(stats.totalAmount)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">Barang Aktif Disewa</CardTitle>
              <Package className="w-5 h-5 text-c-blue" />
            </CardHeader>
            <CardContent>
              <p className="font-quick font-bold text-2xl text-neutral-900">{stats.activeItems}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">Terlambat</CardTitle>
              <AlertTriangle className="w-5 h-5 text-c-red" />
            </CardHeader>
            <CardContent>
              <p className={`font-quick font-bold text-2xl ${stats.overdueCount > 0 ? "text-c-red" : "text-neutral-900"}`}>{stats.overdueCount}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Barang</TableHead>
                  <TableHead>Penyewa</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Tanggal Mulai</TableHead>
                  <TableHead>Tanggal Selesai</TableHead>
                  <TableHead className="text-center">Sisa Hari</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorOrders.map((item) => {
                  const endDate = new Date(item.endDate);
                  const daysLeft = differenceInDays(endDate, new Date());
                  const isOverdue = daysLeft < 0;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <span className="font-quick font-semibold text-sm text-neutral-900">{item.product}</span>
                        <p className="text-xs text-neutral-400 font-sans">{item.variant}</p>
                      </TableCell>
                      <TableCell>
                        <span className="font-sans text-sm text-neutral-700">{item.borrowerName}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {isOverdue ? (
                          <Badge variant="destructive">Terlambat</Badge>
                        ) : daysLeft === 0 ? (
                          <Badge variant="pending">Hari Ini</Badge>
                        ) : (
                          <StatusBadge status={item.paymentStatus === "settlement" ? "active" : "pending"} />
                        )}
                      </TableCell>
                      <TableCell className="font-sans text-sm text-neutral-600">
                        {format(new Date(item.startDate), "dd MMM yyyy", { locale: id })}
                      </TableCell>
                      <TableCell className="font-sans text-sm text-neutral-600">
                        {format(endDate, "dd MMM yyyy", { locale: id })}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center gap-1 font-quick font-semibold text-sm ${
                            isOverdue ? "text-c-red" : daysLeft <= 3 ? "text-amber-600" : "text-emerald-600"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {isOverdue ? `${Math.abs(daysLeft)} hari` : `${daysLeft} hari`}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {vendorOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center font-sans text-sm text-neutral-400 py-12">
                      Tidak ada data monitoring.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
