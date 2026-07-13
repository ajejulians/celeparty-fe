"use client";

import { useState } from "react";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import { blogList } from "@/lib/blog-data";
import { formatDate } from "@/lib/utils";

export default function AdminBlogPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = blogList.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <ErpHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/user/admin/dashboard" },
          { label: "Blog" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-quick font-bold text-2xl text-neutral-900">Kelola Blog</h1>
            <p className="font-sans text-sm text-neutral-500 mt-1">Buat dan kelola artikel untuk platform</p>
          </div>
          <Link href="/user/admin/blog/create">
            <Button className="bg-c-blue text-white font-quick font-semibold h-11 px-6 hover:brightness-95">
              <Plus className="w-4 h-4 mr-2" /> Tulis Artikel
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                placeholder="Cari artikel..."
                className="pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg w-full font-sans focus:outline-none focus:border-c-blue h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Judul</th>
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Kategori</th>
                  <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Tanggal</th>
                  <th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.length > 0 ? (
                  filteredBlogs.map((b, i) => (
                    <tr
                      key={b.slug}
                      className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors ${
                        i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-sans font-medium text-sm text-neutral-900 max-w-md truncate">
                          {b.title}
                        </p>
                        <p className="font-sans text-xs text-neutral-500 max-w-md truncate">
                          {b.excerpt}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-sans bg-c-blue/10 text-c-blue">
                          {b.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-sans text-sm text-neutral-500">
                        {formatDate(b.date)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-c-blue transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-md text-neutral-500 hover:bg-red-50 hover:text-c-red transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-neutral-500">
                        <FileText className="w-12 h-12 mb-3 text-neutral-300" />
                        <p className="font-sans text-base">Belum ada artikel ditemukan</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
