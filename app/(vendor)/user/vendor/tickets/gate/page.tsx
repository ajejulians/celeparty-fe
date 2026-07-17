"use client";

import {
	Calendar,
	Image,
	MapPin,
	Monitor,
	Search,
	ShieldAlert,
	Ticket,
	UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/session";
import {
	EVENT_STATUS_MAP,
	getEventStats,
	getEventsByVendor,
	getTicketsByEvent,
	type VendorEvent,
} from "@/lib/ticket-data";
import { MonitorDashboard } from "../_components/MonitorDashboard";
import { MonitorGate } from "../_components/MonitorGate";

export default function GateAccessPage() {
	const session = useSession();
	const events = getEventsByVendor(session.vendorId);
	const [search, setSearch] = useState("");
	const [selectedEvent, setSelectedEvent] = useState<VendorEvent | null>(null);

	const activeEvents = useMemo(
		() =>
			events.filter(
				(e) =>
					e.status === "ongoing" ||
					e.status === "upcoming" ||
					e.status === "finished",
			),
		[events],
	);

	const filtered = useMemo(() => {
		if (!search) return activeEvents;
		const q = search.toLowerCase();
		return activeEvents.filter(
			(e) =>
				e.name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q),
		);
	}, [activeEvents, search]);

	if (selectedEvent) {
		return (
			<MonitorGate
				event={selectedEvent}
				onBack={() => setSelectedEvent(null)}
				backLabel="Pilih Event Lain"
			>
				{(e) => (
					<MonitorDashboard
						event={e}
						onBack={() => setSelectedEvent(null)}
						backLabel="Pilih Event Lain"
					/>
				)}
			</MonitorGate>
		);
	}

	return (
		<>
			<ErpHeader
				breadcrumbs={[
					{ label: "Dashboard", href: "/user/vendor/dashboard" },
					{ label: "Tiket Event", href: "/user/vendor/tickets" },
					{ label: "Akses Masuk" },
				]}
			/>
			<div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
				<div>
					<h1 className="font-quick font-bold text-2xl text-neutral-900">
						Akses Masuk Gate
					</h1>
					<p className="font-sans text-sm text-neutral-500 mt-1">
						Panel monitoring untuk crew/staff lapangan — scan & validasi tiket
						di gate
					</p>
				</div>

				<div className="flex items-center gap-3 bg-c-blue-50/40 border border-c-blue-100 rounded-xl p-4">
					<div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div className="flex items-center gap-2 text-xs font-sans text-neutral-700">
							<span className="w-6 h-6 rounded-full bg-c-blue text-white font-bold flex items-center justify-center text-[10px] shrink-0">
								1
							</span>
							<span>Pilih event</span>
						</div>
						<div className="flex items-center gap-2 text-xs font-sans text-neutral-700">
							<span className="w-6 h-6 rounded-full bg-c-blue text-white font-bold flex items-center justify-center text-[10px] shrink-0">
								2
							</span>
							<span>Masukkan PIN</span>
						</div>
						<div className="flex items-center gap-2 text-xs font-sans text-neutral-700">
							<span className="w-6 h-6 rounded-full bg-c-blue text-white font-bold flex items-center justify-center text-[10px] shrink-0">
								3
							</span>
							<span>Scan tiket</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<div className="relative flex-1 max-w-sm">
						<Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
						<Input
							placeholder="Cari event aktif..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-9 h-10"
						/>
					</div>
					<Link href="/user/vendor/tickets">
						<Button
							variant="outline"
							size="sm"
							className="font-sans text-xs h-10"
						>
							Lihat Semua Event
						</Button>
					</Link>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filtered.map((event) => {
						const stats = getEventStats(event);
						const tickets = getTicketsByEvent(event.id);
						const checkedIn = tickets.filter(
							(t) => t.status === "checked_in",
						).length;
						const st = EVENT_STATUS_MAP[event.status];
						return (
							<div
								key={event.id}
								role="button"
								tabIndex={0}
								onClick={() => setSelectedEvent(event)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ")
										setSelectedEvent(event);
								}}
								className="bg-white p-5 rounded-xl border border-neutral-200 text-left hover:border-c-blue hover:shadow-card-hover transition-all duration-200 active:scale-[0.98] group cursor-pointer"
							>
								<div className="flex items-start justify-between mb-3">
									<div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
										{event.banner ? (
											<img
												src={event.banner}
												alt=""
												className="w-full h-full object-cover rounded-lg"
											/>
										) : (
											<Image className="w-5 h-5 text-slate-400" />
										)}
									</div>
									<span
										className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${st.className}`}
									>
										{st.label}
									</span>
								</div>
								<h3 className="font-quick font-bold text-neutral-900 text-sm leading-snug mb-2 group-hover:text-c-blue transition-colors">
									{event.name}
								</h3>
								<div className="space-y-1.5 mb-3">
									<p className="flex items-center gap-1.5 font-sans text-xs text-neutral-500">
										<Calendar className="w-3 h-3 shrink-0" />
										{new Date(event.date).toLocaleDateString("id-ID", {
											day: "numeric",
											month: "short",
											year: "numeric",
										})}{" "}
										&middot; {event.time}
									</p>
									<p className="flex items-center gap-1.5 font-sans text-xs text-neutral-500">
										<MapPin className="w-3 h-3 shrink-0" />
										<span className="truncate">{event.venue}</span>
									</p>
								</div>
								<div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-[11px] font-sans text-neutral-500">
									<span className="flex items-center gap-1">
										<Ticket className="w-3 h-3" />
										{stats.totalSold.toLocaleString("id-ID")} Tiket
									</span>
									<span className="flex items-center gap-1">
										<UserCheck className="w-3 h-3" />
										{checkedIn} / {stats.totalSold}
									</span>
								</div>
								<Button
									variant="outline"
									className="w-full mt-3 font-quick font-semibold text-xs gap-2 border-c-blue-100 text-c-blue hover:bg-c-blue-50"
									size="sm"
								>
									<Monitor className="w-3.5 h-3.5" /> Buka Panel Gate
								</Button>
							</div>
						);
					})}
					{filtered.length === 0 && (
						<div className="col-span-full flex flex-col items-center py-16 text-center">
							<ShieldAlert className="w-12 h-12 text-neutral-300 mb-3" />
							<p className="font-sans text-neutral-500">
								Tidak ada event aktif yang tersedia.
							</p>
							<Link
								href="/user/vendor/tickets/create"
								className="text-c-blue font-sans text-sm underline mt-2"
							>
								Buat event baru
							</Link>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
