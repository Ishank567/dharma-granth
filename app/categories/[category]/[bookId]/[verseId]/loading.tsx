export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 animate-pulse">
      <div className="h-4 w-64 bg-border rounded mb-8" />
      <div className="rounded-2xl border border-border bg-card p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 w-32 bg-border rounded mb-2" />
            <div className="h-4 w-24 bg-border rounded" />
          </div>
          <div className="h-9 w-9 bg-border rounded-full" />
        </div>
        <div className="space-y-3 mb-6">
          <div className="h-5 w-full bg-border rounded" />
          <div className="h-5 w-full bg-border rounded" />
          <div className="h-5 w-3/4 bg-border rounded" />
        </div>
        <div className="border-t border-border pt-4">
          <div className="h-4 w-20 bg-border rounded mb-2" />
          <div className="h-4 w-full bg-border rounded" />
          <div className="h-4 w-2/3 bg-border rounded mt-1" />
        </div>
      </div>
      <div className="h-6 w-44 bg-border rounded mb-4" />
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-3">
          <div className="h-4 w-full bg-border rounded" />
          <div className="h-4 w-full bg-border rounded" />
          <div className="h-4 w-5/6 bg-border rounded" />
        </div>
      </div>
    </div>
  );
}
