import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { events } from "../../../lib/data";
import { formatCurrency, formatDate } from "../../../lib/utils";
import { MapPin, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Event | Celeparty",
  description: "Temukan berbagai event menarik di Celeparty — konser, pameran, konferensi, dan lebih banyak lagi.",
};

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-10 text-center">
        <h1 className="font-quick font-bold text-3xl md:text-4xl text-neutral-900 mb-3">
          Jelajahi Event Terseru
        </h1>
        <p className="font-sans text-neutral-500 max-w-2xl mx-auto">
          Temukan berbagai acara menarik mulai dari konser musik, konferensi, hingga pameran yang dapat Anda ikuti.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((evt) => (
          <Link
            key={evt.slug}
            href={`/events/${evt.slug}`}
            className="group bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block flex flex-col"
          >
            <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
              <Image
                src={evt.imageUrl}
                alt={evt.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                <p className="text-xs font-quick font-bold text-c-blue">{evt.category}</p>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-quick font-bold text-xl text-neutral-900 leading-snug mb-4 group-hover:text-c-blue transition-colors line-clamp-2">
                {evt.title}
              </h3>
              
              <div className="space-y-3 mt-auto mb-6">
                <div className="flex items-center gap-3 text-sm text-neutral-600 font-sans">
                  <Calendar size={18} className="text-c-blue shrink-0" />
                  <span>{formatDate(evt.date)} &middot; {evt.time}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-600 font-sans">
                  <MapPin size={18} className="text-c-blue shrink-0" />
                  <span className="truncate">{evt.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-neutral-100">
                <div>
                  <p className="text-[11px] text-neutral-500 mb-1 uppercase tracking-wider font-semibold">Harga Tiket</p>
                  <p className="font-quick font-bold text-xl text-c-blue">
                    {formatCurrency(evt.priceFrom)}
                  </p>
                </div>
                <span className="font-quick font-semibold text-sm bg-c-blue text-white px-5 py-2.5 rounded-full group-hover:bg-c-green group-hover:text-neutral-900 transition-colors">
                  Detail
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
