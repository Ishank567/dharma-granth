export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 animate-pulse">
      <div className="h-4 w-32 bg-border rounded mb-8" />
      <div className="text-center mb-10">
        <div className="h-8 w-52 bg-border rounded-xl mx-auto mb-4" />
        <div className="h-10 w-full max-w-md bg-border rounded-xl mx-auto" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-20 bg-border rounded-full" />
              <div className="h-4 w-16 bg-border rounded" />
            </div>
            <div className="h-4 w-full bg-border rounded mb-1" />
            <div className="h-4 w-3/4 bg-border rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
