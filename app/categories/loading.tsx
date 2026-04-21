export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 animate-pulse">
      <div className="text-center mb-12">
        <div className="h-8 w-48 bg-border rounded-xl mx-auto mb-4" />
        <div className="h-4 w-72 bg-border rounded mx-auto" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6">
            <div className="h-10 w-10 bg-border rounded-full mb-4" />
            <div className="h-5 w-32 bg-border rounded mb-2" />
            <div className="h-4 w-full bg-border rounded mb-1" />
            <div className="h-4 w-2/3 bg-border rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
