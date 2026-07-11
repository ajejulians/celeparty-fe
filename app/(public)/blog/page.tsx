"use client";

import { useState, useMemo } from "react";
import { blogList, BlogListItem } from "../../../lib/blog-data";
import { BlogCard } from "../../../components/blog/BlogCard";
import { BlogCardSkeleton } from "../../../components/blog/BlogCardSkeleton";
import { ErrorState } from "../../../components/feedback/ErrorState";
import { EmptyState } from "../../../components/feedback/EmptyState";
import { Search, FileText } from "lucide-react";

type FetchState = "loading" | "loaded" | "error";

export default function BlogListPage() {
  const [state, setState] = useState<FetchState>("loading");
  const [searchQuery, setSearchQuery] = useState("");

  useState(() => {
    const timer = setTimeout(() => setState("loaded"), 1200);
    return () => clearTimeout(timer);
  });

  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return blogList;
    const q = searchQuery.toLowerCase();
    return blogList.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const recentBlogs = blogList.slice(0, 4);

  if (state === "loading") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-9 bg-neutral-200 rounded w-48 animate-pulse mb-2" />
          <div className="h-5 bg-neutral-200 rounded w-72 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState
          title="Gagal memuat artikel"
          message="Terjadi kesalahan saat memuat daftar blog. Silakan coba lagi."
          onRetry={() => {
            setState("loading");
            setTimeout(() => setState("loaded"), 800);
          }}
        />
      </div>
    );
  }

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-quick font-bold text-3xl text-neutral-900">
            Blog Celeparty
          </h1>
          <p className="font-sans text-sm text-neutral-500 mt-1">
            Tips, tren, dan panduan seputar event untuk perayaan Anda
          </p>
        </div>

        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm font-sans rounded-lg border border-neutral-200 focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 transition-all"
              />
              <span className="absolute left-3 top-2.5 text-neutral-400 text-sm">
                &#x1F50D;
              </span>
            </div>

            {filteredBlogs.length === 0 ? (
              <EmptyState
                icon={<FileText className="w-8 h-8 text-neutral-400" />}
                title="Artikel tidak ditemukan"
                description={`Tidak ada artikel yang cocok dengan kata kunci "${searchQuery}". Coba ubah kata kunci pencarian.`}
                action={{
                  label: "Hapus Pencarian",
                  onClick: () => setSearchQuery(""),
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                  <BlogCard key={blog.slug} blog={blog} />
                ))}
              </div>
            )}
          </div>

          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20">
              <h3 className="font-quick font-bold text-lg text-neutral-900 mb-4">
                Artikel Terbaru
              </h3>
              <div className="space-y-3">
                {recentBlogs.map((blog) => (
                  <a
                    key={blog.slug}
                    href={`/blog/${blog.slug}`}
                    className="flex gap-3 group p-2 rounded-lg hover:bg-white hover:shadow-card transition-all duration-200"
                  >
                    <div className="w-16 h-16 rounded-md bg-neutral-100 shrink-0 overflow-hidden">
                      <div className="w-full h-full bg-neutral-200" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-sans text-neutral-500 mb-0.5">
                        {blog.category}
                      </p>
                      <h4 className="font-quick font-semibold text-xs text-neutral-900 leading-snug line-clamp-2 group-hover:text-c-blue transition-colors">
                        {blog.title}
                      </h4>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
}
