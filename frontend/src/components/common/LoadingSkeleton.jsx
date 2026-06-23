export function ArtworkCardSkeleton() {
  return (
    <div className="skeleton rounded-[4px]" style={{ aspectRatio: '3/4' }} />
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="card-surface p-0 overflow-hidden">
      <div className="skeleton h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="skeleton rounded-[4px]" style={{ aspectRatio: '4/5' }} />
        <div className="space-y-4 pt-8">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-10 w-3/4 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
        </div>
      </div>
    </div>
  );
}
