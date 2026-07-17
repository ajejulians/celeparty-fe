import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogListItem } from "@/lib/blog-data";
import { formatDate } from "@/lib/utils";

const BLOG_THUMBNAIL_FALLBACKS: Record<string, string> = {
	"tips-memilih-sound-system-event":
		"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=533&fit=crop",
	"tren-dekorasi-event-2026":
		"https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=533&fit=crop",
	"panduan-catering-acara-kantor":
		"https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=533&fit=crop",
	"fotografi-event-yang-instagrammable":
		"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=533&fit=crop",
	"checklist-event-pertama":
		"https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=533&fit=crop",
	"lighting-panggung-pemula":
		"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=533&fit=crop",
};

const DEFAULT_THUMBNAIL =
	"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";

function getBlogThumbnail(blog: BlogListItem): string {
	return (
		blog.thumbnailUrl ||
		BLOG_THUMBNAIL_FALLBACKS[blog.slug] ||
		DEFAULT_THUMBNAIL
	);
}

interface BlogCardProps {
	blog: BlogListItem;
}

export function BlogCard({ blog }: BlogCardProps) {
	return (
		<a
			href={`/blog/${blog.slug}`}
			className="group bg-white rounded-xl shadow-card border border-neutral-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-c-blue-100/30 hover:-translate-y-1 cursor-pointer block"
		>
			<div className="relative aspect-video bg-neutral-100 overflow-hidden">
				<img
					src={getBlogThumbnail(blog)}
					alt={blog.title}
					className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
				/>
				<div className="absolute bottom-3 left-3">
					<Badge className="bg-c-blue/85 text-white hover:bg-c-blue/85 border-white/20 backdrop-blur-sm rounded-full font-semibold text-[11px] px-2.5 py-1">
						{blog.category}
					</Badge>
				</div>
			</div>
			<div className="p-5">
				<div className="flex items-center gap-2 text-xs font-sans text-neutral-500 mb-2">
					<span>{formatDate(blog.date)}</span>
					<span className="text-neutral-300">&middot;</span>
					<span>{blog.author}</span>
				</div>
				<h3 className="font-quick font-semibold text-neutral-900 text-base leading-snug line-clamp-2 group-hover:text-c-blue transition-colors">
					{blog.title}
				</h3>
				<p className="font-sans text-sm text-neutral-500 mt-2 line-clamp-3 leading-relaxed">
					{blog.excerpt}
				</p>
				<div className="mt-4 flex items-center gap-1.5 font-quick font-semibold text-sm text-c-blue group-hover:text-purple-600 transition-colors">
					Baca Selengkapnya
					<ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
				</div>
			</div>
		</a>
	);
}
