"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { RelatedProductCard } from "../../../../components/blog/RelatedProductCard";
import { ErrorState } from "../../../../components/feedback/ErrorState";
import { type BlogDetail, blogDetails } from "../../../../lib/blog-data";
import { type Product, products } from "../../../../lib/data";
import { formatDate } from "../../../../lib/utils";

const blogDetail = blogDetails as Record<string, BlogDetail>;

type FetchState = "loading" | "loaded" | "error";

export default function BlogDetailPage() {
	const params = useParams();
	const slug = params.slug as string;

	const [state, setState] = useState<FetchState>("loading");
	const [blog, setBlog] = useState<BlogDetail | null>(null);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

	const fetchBlog = useCallback(() => {
		setState("loading");
		const found = blogDetail[slug];
		if (!found) {
			setState("error");
			return;
		}
		setBlog(found);
		const related = found.relatedProductSlugs
			.map((s) => products.find((p) => p.slug === s))
			.filter(Boolean) as Product[];
		setRelatedProducts(related);
		setState("loaded");
	}, [slug]);

	useEffect(() => {
		fetchBlog();
		if (blog) {
			document.title = `${blog.title} | Celeparty`;
		}
	}, [fetchBlog, blog]);

	if (state === "loading") {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-3xl mx-auto">
					<div className="h-6 bg-neutral-200 rounded w-20 animate-pulse mb-4" />
					<div className="h-9 bg-neutral-200 rounded w-full animate-pulse mb-3" />
					<div className="h-5 bg-neutral-200 rounded w-48 animate-pulse mb-6" />
					<div className="aspect-[16/9] bg-neutral-200 rounded-lg mb-8 animate-pulse" />
					<div className="space-y-3">
						<div className="h-4 bg-neutral-200 rounded w-full animate-pulse" />
						<div className="h-4 bg-neutral-200 rounded w-full animate-pulse" />
						<div className="h-4 bg-neutral-200 rounded w-4/5 animate-pulse" />
					</div>
				</div>
			</div>
		);
	}

	if (state === "error" || !blog) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<ErrorState
					title="Artikel tidak ditemukan"
					message="Artikel yang Anda cari tidak tersedia atau telah dihapus."
					onRetry={fetchBlog}
				/>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex gap-8">
				<article className="flex-1 min-w-0 max-w-3xl mx-auto lg:mx-0">
					<Link
						href="/blog"
						className="inline-flex items-center gap-1 text-sm font-sans text-neutral-500 hover:text-c-blue transition-colors mb-6"
					>
						&larr; Kembali ke Blog
					</Link>

					<div className="mb-2">
						<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-sans bg-c-blue-50 text-c-blue">
							{blog.category}
						</span>
					</div>

					<h1 className="font-quick font-bold text-3xl text-neutral-900 leading-tight mb-3">
						{blog.title}
					</h1>

					<div className="flex flex-wrap items-center gap-2 text-sm font-sans text-neutral-500 mb-6">
						<span>{formatDate(blog.date)}</span>
						<span className="text-neutral-300">&middot;</span>
						<span>{blog.author}</span>
					</div>

					<div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-neutral-100 mb-8">
						<div className="absolute inset-0 bg-neutral-200" />
					</div>

					<div className="prose-custom space-y-6">
						{blog.content.map((block, i) => {
							if (block.type === "heading") {
								return (
									<h2
										key={i}
										className="font-quick font-bold text-xl text-neutral-900 mt-8 mb-3"
									>
										{block.value}
									</h2>
								);
							}

							if (block.type === "paragraph") {
								return (
									<p
										key={i}
										className="font-sans text-base text-neutral-700 leading-relaxed"
									>
										{block.value}
									</p>
								);
							}

							if (block.type === "list") {
								return (
									<div
										key={i}
										className="bg-neutral-50 rounded-lg p-4 border border-neutral-100"
									>
										<p className="font-sans text-sm font-medium text-neutral-900 mb-2">
											{block.value}
										</p>
										<ul className="space-y-2">
											{block.items?.map((item, j) => (
												<li
													key={j}
													className="flex gap-2 text-sm font-sans text-neutral-600"
												>
													<span className="text-c-blue mt-0.5 shrink-0">
														&bull;
													</span>
													<span>{item}</span>
												</li>
											))}
										</ul>
									</div>
								);
							}

							return null;
						})}
					</div>
				</article>

				<aside className="hidden lg:block w-72 shrink-0">
					<div className="sticky top-20">
						<h3 className="font-quick font-bold text-lg text-neutral-900 mb-4">
							Artikel Terbaru
						</h3>
						<div className="space-y-3">
							{Object.values(blogDetail)
								.filter((b) => b.slug !== slug)
								.slice(0, 4)
								.map((b) => (
									<Link
										key={b.slug}
										href={`/blog/${b.slug}`}
										className="flex gap-3 group p-2 rounded-lg hover:bg-white hover:shadow-card transition-all duration-200"
									>
										<div className="w-16 h-16 rounded-md bg-neutral-100 shrink-0 overflow-hidden">
											<div className="w-full h-full bg-neutral-200" />
										</div>
										<div className="min-w-0">
											<p className="text-xs font-sans text-neutral-500 mb-0.5">
												{b.category}
											</p>
											<h4 className="font-quick font-semibold text-xs text-neutral-900 leading-snug line-clamp-2 group-hover:text-c-blue transition-colors">
												{b.title}
											</h4>
										</div>
									</Link>
								))}
						</div>
					</div>
				</aside>
			</div>

			{relatedProducts.length > 0 && (
				<section className="mt-16 pt-8 border-t border-neutral-100">
					<h2 className="font-quick font-bold text-2xl text-neutral-900 mb-6">
						Produk Terkait untuk Artikel Ini
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{relatedProducts.map((product) => (
							<RelatedProductCard key={product.slug} product={product} />
						))}
					</div>
				</section>
			)}
		</div>
	);
}
