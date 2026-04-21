export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 animate-pulse">
      <div className="h-4 w-56 bg-border rounded mb-8" />
      <div className="h-8 w-48 bg-border rounded-xl mb-2" />
      <div className="h-4 w-72 bg-border rounded mb-8" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-border rounded-full shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-border rounded mb-2" />
              <div className="h-3 w-full bg-border rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
