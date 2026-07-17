"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { events } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

const allCategories = [
	"Semua",
	...Array.from(new Set(events.map((e) => e.category))),
];

export default function EventsPage() {
	const [activeTab, setActiveTab] = useState("Semua");

	const filteredEvents = useMemo(() => {
		if (activeTab === "Semua") return events;
		return events.filter((e) => e.category === activeTab);
	}, [activeTab]);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
			<div className="mb-8 text-center">
				<motion.h1
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="font-quick font-bold text-3xl md:text-4xl text-neutral-900 mb-3"
				>
					Jelajahi Event Terseru
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="font-sans text-neutral-500 max-w-lg mx-auto"
				>
					Temukan berbagai acara menarik mulai dari konser musik, konferensi,
					hingga pameran yang dapat Anda ikuti.
				</motion.p>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.15 }}
				className="flex justify-center mb-10"
			>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="bg-white border border-neutral-200 px-4 py-2 rounded-xl shadow-sm flex-wrap h-auto gap-2">
						{allCategories.map((cat) => (
							<TabsTrigger
								key={cat}
								value={cat}
								className="rounded-lg data-[state=active]:bg-c-blue data-[state=active]:text-white text-neutral-600 px-4 py-2 text-sm font-quick font-semibold transition-all"
							>
								{cat}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</motion.div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{filteredEvents.map((evt, index) => (
					<motion.div
						key={evt.slug}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: index * 0.05 }}
					>
						<Link
							href={`/events/${evt.slug}`}
							className="group bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block h-full"
						>
							<div className="relative aspect-[4/3] overflow-hidden">
								<Image
									src={evt.imageUrl}
									alt={evt.title}
									fill
									className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
								<div className="absolute top-4 left-4">
									<Badge className="bg-white/90 backdrop-blur-md text-c-blue hover:bg-white/90 border-white/20 shadow-sm font-quick font-bold text-xs px-3 py-1.5 rounded-full">
										{evt.category}
									</Badge>
								</div>
								<div className="absolute bottom-4 left-4 right-4">
									<h3 className="font-quick font-bold text-lg text-white leading-snug line-clamp-2 drop-shadow-md">
										{evt.title}
									</h3>
								</div>
							</div>

							<div className="p-5 flex flex-col gap-4">
								<div className="space-y-2.5">
									<div className="flex items-center gap-2.5 text-sm text-neutral-600 font-sans">
										<Calendar size={16} className="text-c-blue shrink-0" />
										<span>{formatDate(evt.date)}</span>
										<span className="text-neutral-300">&middot;</span>
										<Clock size={16} className="text-c-blue shrink-0" />
										<span>{evt.time}</span>
									</div>
									<div className="flex items-center gap-2.5 text-sm text-neutral-600 font-sans">
										<MapPin size={16} className="text-c-blue shrink-0" />
										<span className="truncate">{evt.location}</span>
									</div>
								</div>

								<div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
									<div>
										<p className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold mb-0.5">
											Mulai dari
										</p>
										<p className="font-quick font-bold text-lg text-c-blue">
											{formatCurrency(evt.priceFrom)}
										</p>
									</div>
									<Button
										variant="default"
										size="sm"
										className="bg-purple-600 hover:bg-purple-700 group-hover:bg-c-green group-hover:text-neutral-900 transition-colors"
									>
										Detail <ArrowRight className="w-3.5 h-3.5 ml-1" />
									</Button>
								</div>
							</div>
						</Link>
					</motion.div>
				))}
			</div>
		</div>
	);
}
