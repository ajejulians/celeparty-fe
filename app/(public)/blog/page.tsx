"use client";

import { useState, useMemo, useEffect } from "react";
import { blogList, BlogListItem } from "@/lib/blog-data";
import { formatDate } from "@/lib/utils";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCardSkeleton } from "@/components/blog/BlogCardSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const BLOG_THUMBNAIL_FALLBACKS: Record<string, string> = {
  "tips-memilih-sound-system-event": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=533&fit=crop",
  "tren-dekorasi-event-2026": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=533&fit=crop",
  "panduan-catering-acara-kantor": "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=533&fit=crop",
  "fotografi-event-yang-instagrammable": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=533&fit=crop",
  "checklist-event-pertama": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=533&fit=crop",
  "lighting-panggung-pemula": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=533&fit=crop",
};

const DEFAULT_THUMBNAIL = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";

function getBlogThumbnail(blog: BlogListItem): string {
  return blog.thumbnailUrl || BLOG_THUMBNAIL_FALLBACKS[blog.slug] || DEFAULT_THUMBNAIL;
}

function estimateReadTime(text: string): string {
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

type FetchState = "loading" | "loaded" | "error";

export default function BlogListPage() {
  const [state, setState] = useState<FetchState>("loaded");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Blog | Celeparty";
  }, []);

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

  const featuredPost = blogList[0];
  const recentBlogs = blogList.slice(0, 7);

  if (state === "loading") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-72 mb-8" />
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
          onRetry={() => setState("loaded")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-quick font-bold text-3xl text-neutral-900">
          Blog Celeparty
        </h1>
        <p className="font-sans text-sm text-neutral-500 mt-1">
          Tips, tren, dan panduan seputar event untuk perayaan Anda
        </p>
      </motion.div>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative mb-8"
          >
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 py-2.5 rounded-xl border-neutral-200 focus-visible:ring-2 focus-visible:ring-c-blue/20 focus-visible:border-c-blue transition-all"
            />
          </motion.div>

          {!searchQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-10"
            >
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-[55%_45%]">
                  <div className="aspect-video md:aspect-auto relative overflow-hidden bg-neutral-100">
                    <img
                      src={getBlogThumbnail(featuredPost)}
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200 rounded-full font-semibold text-xs">
                        {featuredPost.category}
                      </Badge>
                    </div>
                    <h2 className="font-quick font-bold text-xl md:text-2xl text-neutral-900 leading-snug mb-3 group-hover:text-c-blue transition-colors line-clamp-2">
                      {featuredPost.title}
                    </h2>
                    <p className="font-sans text-sm text-neutral-500 leading-relaxed line-clamp-4 mb-4">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs font-sans text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-c-blue text-white text-[10px] font-semibold">
                            {featuredPost.author.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-neutral-600 font-medium">{featuredPost.author}</span>
                      </div>
                      <span className="text-neutral-300">&middot;</span>
                      <span>{formatDate(featuredPost.date)}</span>
                      <span className="text-neutral-300">&middot;</span>
                      <span>{estimateReadTime(featuredPost.excerpt)}</span>
                    </div>
                    <div className="mt-5 flex items-center gap-1.5 font-quick font-semibold text-sm text-c-blue group-hover:text-purple-600 transition-colors">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBlogs
                .filter((b) => !searchQuery.trim() && b.slug === featuredPost.slug ? false : true)
                .map((blog, index) => (
                  <motion.div
                    key={blog.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                  >
                    <BlogCard blog={blog} />
                  </motion.div>
                ))}
            </div>
          )}
        </div>

        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24">
            <div className="bg-white rounded-xl border border-neutral-100 p-5">
              <h3 className="font-quick font-bold text-base text-neutral-900 mb-4">
                Artikel Terbaru
              </h3>
              <div className="space-y-3">
                {recentBlogs.map((blog) => (
                  <a
                    key={blog.slug}
                    href={`/blog/${blog.slug}`}
                    className="flex gap-3 group p-2 -mx-2 rounded-lg hover:bg-neutral-50 transition-all duration-200"
                  >
                    <div className="w-16 h-16 rounded-lg bg-neutral-100 shrink-0 overflow-hidden">
                      <img
                        src={getBlogThumbnail(blog)}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-sans text-neutral-400 mb-0.5">
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
          </div>
        </aside>
      </div>
    </div>
  );
}
