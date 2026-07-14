"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/session";
import { getEventsByVendor, getGlobalStats, EVENT_STATUS_MAP, type VendorEvent } from "@/lib/ticket-data";
import { formatCurrency } from "@/lib/utils";
import {
  Ticket, TrendingUp, Wallet, Search, Plus,
  Calendar, MapPin, Pencil, Monitor, Image,
} from "lucide-react";

function EventRow({ event, onMonitor }: { event: VendorEvent; onMonitor: () => void }) {
  const totalQuota = event.categories.reduce((s, c) => s + c.quota, 0);
  const totalSold = event.categories.reduce((s, c) => s + c.sold, 0);
  const pct = totalQuota > 0 ? Math.round((totalSold / totalQuota) * 100) : 0;
  const revenue = event.categories.reduce((s, c) => s + c.price * c.sold, 0);
  const st = EVENT_STATUS_MAP[event.status];

  return (
    <tr className="border-b border-neutral-100 hover:bg-neutral-50/70 transition-colors group">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
            {event.banner ? (
              <img src={event.banner} alt="" className="w-full h-full object-cover" />
            ) : (
              <Image className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-quick font-semibold text-sm text-neutral-900 truncate">{event.name}</p>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-500 font-sans">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>{new Date(event.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
              <MapPin className="w-3 h-3 shrink-0 ml-1" />
              <span className="truncate max-w-[130px]">{event.venue}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${st.className}`}>
          {st.label}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col gap-1 min-w-[140px]">
          <div className="flex justify-between font-sans text-xs text-neutral-600">
            <span className="font-semibold">{totalSold.toLocaleString("id-ID")}</span>
            <span>/ {totalQuota.toLocaleString("id-ID")}</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${pct >= 100 ? "bg-c-red" : pct >= 80 ? "bg-c-orange" : "bg-c-blue"}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <p className="font-sans text-[10px] text-neutral-400 text-right">{pct}% Terjual</p>
        </div>
      </td>
      <td className="px-4 py-4 font-quick font-semibold text-sm text-neutral-900 whitespace-nowrap">{formatCurrency(revenue)}</td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Link href={`/user/vendor/tickets/create`}>
            <Button variant="ghost" size="sm" className="font-sans text-xs gap-1 h-8 px-2.5 text-neutral-500 hover:text-c-blue">
              <Pencil className="w-3 h-3" /> Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={onMonitor} className="font-sans text-xs gap-1 h-8 px-2.5 border-c-blue-100 text-c-blue hover:bg-c-blue-50">
            <Monitor className="w-3 h-3" /> Gate
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function TicketsDashboardPage() {
  const session = useSession();
  const router = useRouter();
  const events = getEventsByVendor(session.vendorId);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "ongoing" | "upcoming" | "finished" | "draft">("all");

  const stats = useMemo(() => getGlobalStats(events), [events]);
  const activeEvents = events.filter((e) => e.status === "ongoing").length;

  const filtered = useMemo(() => {
    let list = events;
    if (statusFilter !== "all") list = list.filter((e) => e.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
    }
    return list;
  }, [events, statusFilter, search]);

  const statusCounts = useMemo(() => {
    const all = events.length;
    const ongoing = events.filter((e) => e.status === "ongoing").length;
    const upcoming = events.filter((e) => e.status === "upcoming").length;
    const finished = events.filter((e) => e.status === "finished").length;
    const draft = events.filter((e) => e.status === "draft").length;
    return { all, ongoing, upcoming, finished, draft };
  }, [events]);

  const statusLabels: Record<string, string> = {
    all: "Semua",
    ongoing: "Aktif",
    upcoming: "Akan Datang",
    draft: "Draft",
    finished: "Selesai",
  };

  return (
    <>
      <ErpHeader breadcrumbs={[{ label: "Dashboard", href: "/user/vendor/dashboard" }, { label: "Tiket Event" }]} />
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-quick font-bold text-2xl text-neutral-900">Tiket Event</h1>
            <p className="font-sans text-sm text-neutral-500 mt-1">Kelola event dan pantau penjualan tiket Anda</p>
          </div>
          <Link href="/user/vendor/tickets/create">
            <Button className="font-quick font-semibold gap-2">
              <Plus className="w-4 h-4" /> Buat Event Baru
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">Event Aktif</p>
                  <p className="font-quick font-bold text-2xl text-neutral-900">{activeEvents}</p>
                  <p className="font-sans text-xs text-neutral-400">dari {events.length} total event</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-c-blue-50 flex items-center justify-center shrink-0">
                  <Ticket className="w-5 h-5 text-c-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">Tiket Terjual</p>
                  <p className="font-quick font-bold text-2xl text-neutral-900">{stats.totalSold.toLocaleString("id-ID")}</p>
                  <p className="font-sans text-xs text-neutral-400">all time</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">Pendapatan Tiket</p>
                  <p className="font-quick font-bold text-2xl text-neutral-900">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="font-sans text-xs text-neutral-400">bruto all time</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <TabsList className="bg-white border border-neutral-200 p-1 h-auto">
              {(["all", "ongoing", "upcoming", "draft", "finished"] as const).map((k) => (
                <TabsTrigger key={k} value={k} className="font-quick text-xs py-2 data-[state=active]:bg-c-blue data-[state=active]:text-white">
                  {statusLabels[k]}
                  <span className="ml-1.5 bg-neutral-200 rounded-full px-1.5 text-[10px] text-neutral-600 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                    {statusCounts[k]}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <Input placeholder="Cari nama event..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 w-52 sm:w-64" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Info Event</th>
                <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Progres Penjualan</th>
                <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Pendapatan</th>
                <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => (
                <EventRow key={event.id} event={event} onMonitor={() => router.push(`/user/vendor/tickets/${event.id}/monitor`)} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center font-sans text-sm text-neutral-400">
                    {events.length === 0 ? "Belum ada event. Klik tombol Buat Event Baru untuk memulai." : "Event tidak ditemukan."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}