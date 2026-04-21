export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 animate-pulse">
      <div className="h-4 w-32 bg-border rounded mb-8" />
      <div className="h-8 w-48 bg-border rounded-xl mb-4" />
      <div className="h-4 w-80 bg-border rounded mb-8" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-border rounded-full" />
              <div className="h-5 w-40 bg-border rounded" />
            </div>
            <div className="h-4 w-full bg-border rounded mb-1" />
            <div className="h-4 w-2/3 bg-border rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
