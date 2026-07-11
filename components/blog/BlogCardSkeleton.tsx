export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-neutral-100 overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-neutral-200" />
      <div className="p-4 space-y-2">
        <div className="flex gap-2">
          <div className="h-3 bg-neutral-200 rounded w-20" />
          <div className="h-3 bg-neutral-200 rounded w-16" />
        </div>
        <div className="h-4 bg-neutral-200 rounded w-full" />
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-200 rounded w-full" />
        <div className="h-3 bg-neutral-200 rounded w-2/3" />
        <div className="h-4 bg-neutral-200 rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}
