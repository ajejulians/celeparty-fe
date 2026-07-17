export function ProductCardSkeleton() {
	return (
		<div className="bg-white rounded-lg border border-neutral-100 overflow-hidden animate-pulse">
			<div className="aspect-[4/3] bg-neutral-200" />
			<div className="p-4 space-y-2">
				<div className="h-3 bg-neutral-200 rounded w-1/3" />
				<div className="h-4 bg-neutral-200 rounded w-4/5" />
				<div className="h-4 bg-neutral-200 rounded w-3/5" />
				<div className="flex justify-between items-center mt-3">
					<div className="h-6 bg-neutral-200 rounded w-1/3" />
					<div className="h-9 bg-neutral-200 rounded w-1/4" />
				</div>
			</div>
		</div>
	);
}
