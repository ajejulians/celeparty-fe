export default function AdminLoading() {
	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
			<div className="h-8 bg-neutral-200 rounded w-48 mb-2" />
			<div className="h-4 bg-neutral-200 rounded w-64 mb-8" />
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="bg-white rounded-xl border border-neutral-200 p-4"
					>
						<div className="h-4 bg-neutral-200 rounded w-1/2 mb-3" />
						<div className="h-8 bg-neutral-200 rounded w-3/4" />
					</div>
				))}
			</div>
			<div className="bg-white rounded-xl border border-neutral-200 p-6">
				<div className="h-6 bg-neutral-200 rounded w-40 mb-4" />
				<div className="space-y-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="h-12 bg-neutral-100 rounded" />
					))}
				</div>
			</div>
		</div>
	);
}
