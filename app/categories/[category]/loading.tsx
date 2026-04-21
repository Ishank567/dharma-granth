export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-pulse">
      <div className="h-4 w-40 bg-border rounded mb-8" />
      <div className="h-8 w-56 bg-border rounded-xl mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="h-5 w-40 bg-border rounded mb-3" />
            <div className="h-4 w-full bg-border rounded mb-1" />
            <div className="h-4 w-3/4 bg-border rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
