'use client';

import { useState, FormEvent } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} role="search" aria-label="ग्रंथ खोजें" className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="खोज शब्द"
          placeholder="ग्रंथों में खोजें... (जैसे: धर्म, कर्म, योग, आत्मा)"
          className="w-full rounded-2xl border border-border bg-search-bg py-4 pl-12 pr-24 text-foreground placeholder:text-muted-light focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
        />
        <button
          type="submit"
          aria-label="खोजें"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
        >
          खोजें
        </button>
      </div>
    </form>
  );
}
