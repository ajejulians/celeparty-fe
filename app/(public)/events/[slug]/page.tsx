import {
	ArrowLeft,
	Calendar,
	Clock,
	Heart,
	MapPin,
	Share2,
	Ticket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "../../../../lib/data";
import { formatCurrency, formatDate } from "../../../../lib/utils";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const event = events.find((e) => e.slug === slug);
	return {
		title: `${event?.title || "Event"} | Celeparty`,
		description: event?.description || "Detail Event",
	};
}

export default async function EventDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const resolvedParams = await params;
	const event = events.find((e) => e.slug === resolvedParams.slug);

	if (!event) {
		notFound();
	}

	return (
		<div className="bg-neutral-50 pb-20">
			<div className="bg-white border-b border-neutral-200">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<Link
						href="/events"
						className="inline-flex items-center gap-2 text-sm font-sans text-neutral-500 hover:text-c-blue transition-colors"
					>
						<ArrowLeft size={16} /> Kembali ke Event
					</Link>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
					<div className="lg:col-span-2 space-y-8">
						<div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border border-neutral-100 group">
							<Image
								src={event.imageUrl}
								alt={event.title}
								fill
								className="object-cover group-hover:scale-105 transition-transform duration-700"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							<div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
								<p className="text-sm font-quick font-bold text-c-blue">
									{event.category}
								</p>
							</div>
						</div>

						<div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-neutral-200">
							<div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
								<h1 className="font-quick font-bold text-3xl md:text-5xl text-neutral-900 leading-tight">
									{event.title}
								</h1>
								<div className="flex items-center gap-3 shrink-0">
									<button className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all">
										<Heart size={22} />
									</button>
									<button className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-c-blue hover:border-c-blue hover:bg-c-blue/5 transition-all">
										<Share2 size={22} />
									</button>
								</div>
							</div>

							<div className="prose prose-neutral max-w-none font-sans text-neutral-600 leading-relaxed text-lg">
								<h3 className="font-quick font-bold text-2xl text-neutral-900 mb-4">
									Deskripsi Event
								</h3>
								<p>{event.description}</p>
							</div>
						</div>
					</div>

					<div className="lg:col-span-1">
						<div className="sticky top-28 bg-white rounded-3xl p-6 shadow-card border border-neutral-200">
							<h3 className="font-quick font-bold text-xl text-neutral-900 mb-6 border-b border-neutral-100 pb-4">
								Informasi Pelaksanaan
							</h3>

							<div className="space-y-6 mb-8">
								<div className="flex gap-4">
									<div className="w-14 h-14 rounded-2xl bg-c-blue/5 flex items-center justify-center shrink-0">
										<Calendar className="text-c-blue" size={26} />
									</div>
									<div className="flex flex-col justify-center">
										<p className="text-xs font-sans text-neutral-500 mb-1 uppercase tracking-wide font-semibold">
											Tanggal
										</p>
										<p className="font-quick font-bold text-neutral-900">
											{formatDate(event.date)}
										</p>
									</div>
								</div>

								<div className="flex gap-4">
									<div className="w-14 h-14 rounded-2xl bg-c-blue/5 flex items-center justify-center shrink-0">
										<Clock className="text-c-blue" size={26} />
									</div>
									<div className="flex flex-col justify-center">
										<p className="text-xs font-sans text-neutral-500 mb-1 uppercase tracking-wide font-semibold">
											Waktu
										</p>
										<p className="font-quick font-bold text-neutral-900">
											{event.time}
										</p>
									</div>
								</div>

								<div className="flex gap-4">
									<div className="w-14 h-14 rounded-2xl bg-c-blue/5 flex items-center justify-center shrink-0">
										<MapPin className="text-c-blue" size={26} />
									</div>
									<div className="flex flex-col justify-center">
										<p className="text-xs font-sans text-neutral-500 mb-1 uppercase tracking-wide font-semibold">
											Lokasi
										</p>
										<p className="font-quick font-bold text-neutral-900">
											{event.location}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-neutral-50 rounded-2xl p-5 mb-8 border border-neutral-100">
								<p className="text-xs font-sans text-neutral-500 mb-1 uppercase tracking-wide font-semibold">
									Penyelenggara
								</p>
								<p className="font-quick font-bold text-lg text-neutral-900">
									{event.organizer}
								</p>
							</div>

							<div className="border-t border-neutral-100 pt-8">
								<p className="text-sm font-sans text-neutral-500 mb-2 font-semibold">
									Harga Tiket Mulai Dari
								</p>
								<p className="font-quick font-bold text-4xl text-c-blue mb-8">
									{formatCurrency(event.priceFrom)}
								</p>
								<Link
									href={`/checkout?product=${event.slug}`}
									className="w-full font-quick font-bold text-lg bg-c-green text-neutral-900 px-6 py-4 rounded-xl flex items-center justify-center gap-3 hover:brightness-110 hover:-translate-y-1 active:scale-95 transition-all shadow-[0_0_20px_rgba(203,208,2,0.3)]"
								>
									<Ticket size={24} />
									Beli Tiket
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
