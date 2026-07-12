"use client";

import { useState } from "react";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Chart, AreaChartComponent } from "@/components/ui/chart";
import { Pagination } from "@/components/ui/pagination";
import { getOrdersByVendor, getProductsByVendor } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Star,
  Search,
  Download,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const revenueData = [
  { label: "Jan", revenue: 4500000, profit: 2200000 },
  { label: "Feb", revenue: 5200000, profit: 2800000 },
  { label: "Mar", revenue: 4800000, profit: 2400000 },
  { label: "Apr", revenue: 6100000, profit: 3200000 },
  { label: "Mei", revenue: 5500000, profit: 2900000 },
  { label: "Jun", revenue: 7200000, profit: 3800000 },
  { label: "Jul", revenue: 8500000, profit: 4200000 },
];

export default function VendorDashboardV2Page() {
  const session = useSession();
  const vendorOrders = getOrdersByVendor(session.vendorId);
  const vendorProducts = getProductsByVendor(session.vendorId);
  const recentOrders = vendorOrders.slice(0, 5);
  const [searchQuery, setSearchQuery] = useState("");

  const pendingCount = vendorOrders.filter((o) => o.paymentStatus === "pending").length;
  const totalRevenue = vendorOrders
    .filter((o) => o.paymentStatus === "settlement")
    .reduce((acc, order) => acc + order.total, 0);
  const totalOrders = vendorOrders.length;
  const activeProducts = vendorProducts.filter((p) => p.status === "active").length;

  return (
    <>
      <ErpHeader breadcrumbs={[{ label: "Dashboard" }]} notificationCount={3} />
      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-quick font-bold text-3xl text-neutral-900 tracking-tight">
              Dashboard
            </h1>
            <p className="font-sans text-sm text-neutral-500 mt-1">
              Selamat datang kembali, Jakarta Audio Pro &#x2014; berikut ringkasan bisnis Anda
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Unduh Laporan
            </Button>
            <Button variant="cta" size="sm">
              <Package className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-sans font-medium text-neutral-500">
                Total Pendapatan
              </CardTitle>
              <div className="w-9 h-9 rounded-lg bg-c-blue-50 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-c-blue" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-quick font-bold text-neutral-900">
                {formatCurrency(totalRevenue)}
              </div>
              <p className="text-xs font-sans text-neutral-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-status-success" />
                <span className="text-status-success font-medium">+20.1%</span>
                dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-sans font-medium text-neutral-500">
                Total Pesanan
              </CardTitle>
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-quick font-bold text-neutral-900">
                {totalOrders}
              </div>
              <p className="text-xs font-sans text-neutral-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-status-success" />
                <span className="text-status-success font-medium">+12</span>
                dari minggu lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-sans font-medium text-neutral-500">
                Produk Aktif
              </CardTitle>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Package className="w-4 h-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-quick font-bold text-neutral-900">
                {activeProducts}
              </div>
              <p className="text-xs font-sans text-neutral-500 mt-1">
                dari {vendorProducts.length} total produk
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-sans font-medium text-neutral-500">
                Menunggu Konfirmasi
              </CardTitle>
              <div className="w-9 h-9 rounded-lg bg-c-red-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-c-red" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-quick font-bold text-neutral-900">
                {pendingCount}
              </div>
              <p className="text-xs font-sans text-neutral-500 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-c-red" />
                <span className="text-c-red font-medium">Perlu tindakan</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ikhtisar Pendapatan</CardTitle>
                  <CardDescription>
                    Pendapatan bulanan dari pesanan yang sudah lunas
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AreaChartComponent
                data={revenueData}
                config={{
                  revenue: { label: "Pendapatan", color: "#3E2882" },
                  profit: { label: "Keuntungan", color: "#CBD002" },
                }}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Pesanan Terbaru</CardTitle>
              <CardDescription>
                {totalOrders} pesanan bulan ini.{" "}
                <a href="/user/vendor/orders" className="text-c-blue hover:underline font-medium">
                  Lihat semua
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-c-blue-50 flex items-center justify-center shrink-0">
                      <span className="font-quick font-bold text-xs text-c-blue">
                        {order.customer.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-medium text-sm text-neutral-900 truncate">
                        {order.customer}
                      </p>
                      <p className="font-sans text-xs text-neutral-500 truncate">
                        {order.product}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-quick font-semibold text-sm text-neutral-900">
                        {formatCurrency(order.total)}
                      </p>
                      <StatusBadge status={order.paymentStatus} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Semua Pesanan</CardTitle>
              <CardDescription>
                Kelola pesanan masuk dari customer Anda
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                <Input
                  placeholder="Cari pesanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-c-blue-50 flex items-center justify-center">
                          <span className="font-quick font-bold text-xs text-c-blue">
                            {order.customer.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-sans font-medium text-sm text-neutral-900">
                            {order.customer}
                          </p>
                          <p className="font-mono text-xs text-neutral-500">
                            {order.orderId}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-sans text-sm text-neutral-700 max-w-[200px] truncate">
                        {order.product}
                      </p>
                      <p className="font-sans text-xs text-neutral-500">
                        {order.variant}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.paymentStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="font-quick font-semibold text-sm text-neutral-900">
                        {formatCurrency(order.total)}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              currentPage={1}
              totalPages={Math.ceil(vendorOrders.length / 5) || 1}
              totalItems={vendorOrders.length}
              pageSize={5}
              onPageChange={() => {}}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
