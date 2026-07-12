"use client";

import { useState } from "react";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Chart, AreaChartComponent } from "@/components/ui/chart";
import { Pagination } from "@/components/ui/pagination";
import { orders, products } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import {
  DollarSign,
  ShoppingCart,
  Store,
  Users,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

const platformRevenue = [
  { label: "Jan", revenue: 12500000, commission: 1250000 },
  { label: "Feb", revenue: 14800000, commission: 1480000 },
  { label: "Mar", revenue: 13200000, commission: 1320000 },
  { label: "Apr", revenue: 18900000, commission: 1890000 },
  { label: "Mei", revenue: 17500000, commission: 1750000 },
  { label: "Jun", revenue: 22100000, commission: 2210000 },
  { label: "Jul", revenue: 25600000, commission: 2560000 },
];

const vendors = [
  { id: "v-001", name: "Jakarta Audio Pro", productCount: 3, totalRevenue: 22500000, status: "approved" as const },
  { id: "v-002", name: "Bandung Visual Story", productCount: 2, totalRevenue: 9500000, status: "approved" as const },
  { id: "v-003", name: "Surabaya Decor House", productCount: 1, totalRevenue: 14000000, status: "pending" as const },
  { id: "v-004", name: "Jogja Talent House", productCount: 1, totalRevenue: 0, status: "approved" as const },
];

const pendingVendors = vendors.filter((v) => v.status === "pending").length;
const totalPlatformRevenue = orders
  .filter((o) => o.paymentStatus === "settlement")
  .reduce((s, o) => s + o.total, 0);
const totalOrders = orders.length;
const totalVendors = vendors.length;
const totalUsers = 12;

export default function AdminDashboardV2Page() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <ErpHeader breadcrumbs={[{ label: "Dashboard" }]} notificationCount={5} />
      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-quick font-bold text-3xl text-neutral-900 tracking-tight">
              Dashboard Admin
            </h1>
            <p className="font-sans text-sm text-neutral-500 mt-1">
              Selamat datang, Admin &#x2014; berikut ikhtisar platform Celeparty
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Unduh Laporan
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-sans font-medium text-neutral-500">
                Total Revenue
              </CardTitle>
              <div className="w-9 h-9 rounded-lg bg-c-blue-50 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-c-blue" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-quick font-bold text-neutral-900">
                {formatCurrency(totalPlatformRevenue)}
              </div>
              <p className="text-xs font-sans text-neutral-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-status-success" />
                <span className="text-status-success font-medium">+15.8%</span>
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
                <span className="text-status-success font-medium">+7</span>
                bulan ini
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-sans font-medium text-neutral-500">
                Vendor Aktif
              </CardTitle>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Store className="w-4 h-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-quick font-bold text-neutral-900">
                {totalVendors}
              </div>
              <p className="text-xs font-sans text-neutral-500 mt-1">
                {pendingVendors} menunggu verifikasi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-sans font-medium text-neutral-500">
                Pengguna
              </CardTitle>
              <div className="w-9 h-9 rounded-lg bg-c-blue-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-c-blue" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-quick font-bold text-neutral-900">
                {totalUsers}
              </div>
              <p className="text-xs font-sans text-neutral-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-status-success" />
                <span className="text-status-success font-medium">+5</span>
                minggu ini
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue Platform</CardTitle>
                  <CardDescription>
                    Total transaksi dan komisi platform per bulan
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AreaChartComponent
                data={platformRevenue}
                config={{
                  revenue: { label: "Revenue", color: "#3E2882" },
                  commission: { label: "Komisi", color: "#CBD002" },
                }}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Vendor Teratas</CardTitle>
              <CardDescription>
                Berdasarkan total pendapatan bulan ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-c-blue-50 flex items-center justify-center shrink-0">
                      <span className="font-quick font-bold text-xs text-c-blue">
                        {vendor.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-sans font-medium text-sm text-neutral-900 truncate">
                          {vendor.name}
                        </p>
                        {vendor.status === "pending" && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-amber-50 text-amber-700">
                            Menunggu
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-neutral-500">
                        {vendor.productCount} produk
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-quick font-semibold text-sm text-neutral-900">
                        {formatCurrency(vendor.totalRevenue)}
                      </p>
                      <p className="font-sans text-xs text-neutral-500">
                        total
                      </p>
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
                Seluruh pesanan di platform Celeparty
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
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
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
                      <p className="font-sans text-sm text-neutral-700">
                        {order.vendorName ?? "—"}
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
              totalPages={1}
              totalItems={orders.length}
              pageSize={10}
              onPageChange={() => {}}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
