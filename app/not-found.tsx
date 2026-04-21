import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-6xl mb-6">🙏</p>
      <h1 className="font-serif-deva text-3xl font-bold text-foreground mb-4">
        यह पृष्ठ उपलब्ध नहीं है
      </h1>
      <p className="text-muted mb-8 leading-relaxed">
        हो सकता है यह पता बदल गया हो या यह सामग्री अभी तैयार न हुई हो।
        कृपया मुख्य पृष्ठ से आरम्भ करें या ग्रंथों में खोजें।
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
        >
          मुख्य पृष्ठ पर जाएँ
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-card-hover transition-colors"
        >
          🔍 ग्रंथों में खोजें
        </Link>
      </div>
    </div>
  );
}
