import { formatDate } from "../../lib/utils";
import { BlogListItem } from "../../lib/blog-data";

interface BlogCardProps {
  blog: BlogListItem;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <a
      href={`/blog/${blog.slug}`}
      className="group bg-white rounded-lg shadow-card border border-neutral-100 overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer block"
    >
      <div className="relative aspect-[16/9] bg-neutral-100 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-200" />
        <div className="absolute bottom-2 left-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-sans bg-c-blue/80 text-white">
            {blog.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs font-sans text-neutral-500 mb-2">
          <span>{formatDate(blog.date)}</span>
          <span className="text-neutral-300">&middot;</span>
          <span>{blog.author}</span>
        </div>
        <h3 className="font-quick font-semibold text-neutral-900 text-base leading-snug line-clamp-2 group-hover:text-c-blue transition-colors">
          {blog.title}
        </h3>
        <p className="font-sans text-xs text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
          {blog.excerpt}
        </p>
        <div className="mt-3">
          <span className="font-quick font-semibold text-xs text-c-blue group-hover:underline">
            Baca Selengkapnya &rarr;
          </span>
        </div>
      </div>
    </a>
  );
}
