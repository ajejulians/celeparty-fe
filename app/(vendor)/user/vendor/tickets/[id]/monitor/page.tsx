"use client";

import Link from "next/link";
import { use } from "react";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { getEventById } from "@/lib/ticket-data";
import { MonitorDashboard } from "../../_components/MonitorDashboard";
import { MonitorGate } from "../../_components/MonitorGate";

export default function MonitorEventPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const event = getEventById(id);

	if (!event) {
		return (
			<>
				<ErpHeader
					breadcrumbs={[
						{ label: "Dashboard", href: "/user/vendor/dashboard" },
						{ label: "Tiket Event", href: "/user/vendor/tickets" },
						{ label: "Event Tidak Ditemukan" },
					]}
				/>
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
					<p className="font-sans text-neutral-500">Event tidak ditemukan.</p>
					<Link
						href="/user/vendor/tickets"
						className="text-c-blue font-sans text-sm underline mt-2 inline-block"
					>
						Kembali ke daftar event
					</Link>
				</div>
			</>
		);
	}

	return (
		<MonitorGate
			event={event}
			backHref="/user/vendor/tickets"
			backLabel="Kembali ke Daftar Event"
		>
			{(e) => <MonitorDashboard event={e} />}
		</MonitorGate>
	);
}
