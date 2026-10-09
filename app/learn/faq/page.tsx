'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Compass,
  HelpCircle,
  Layers,
  Lightbulb,
  Scale,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';
import { SCRIPTURE_FAQS, type ScriptureFaqItem } from '@/data/scripture-faqs';

type FaqCategory = 'all' | ScriptureFaqItem['category'];

const CATEGORY_TABS: Array<{ id: FaqCategory; label: string; labelHi: string }> = [
  { id: 'all', label: 'All FAQs', labelHi: 'सभी प्रश्न' },
  { id: 'canon', label: 'Scripture & Canon', labelHi: 'श्रुति व स्मृति' },
  { id: 'ethics', label: 'Ethics & Life', labelHi: 'नीति व कर्म' },
  { id: 'philosophy', label: 'Philosophical Schools', labelHi: 'दर्शन परम्परा' },
  { id: 'misconceptions', label: 'Misconceptions', labelHi: 'भ्रम व निवारण' },
];

export default function ScriptureFaqPage() {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'shruti-smriti-diff': true,
  });

  const toggleAccordion = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = useMemo(() => {
    return SCRIPTURE_FAQS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const haystack = `${item.questionEn} ${item.questionHi} ${item.answerEn} ${item.answerHi}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-20">
      {/* Header Banner */}
      <section className="border-b border-dharma-border bg-gradient-to-b from-amber-50/70 via-dharma-card to-dharma-bg dark:from-amber-950/20 py-12 px-5 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/learn"
            className="focus-ring inline-flex items-center gap-1.5 text-xs font-semibold text-dharma-muted hover:text-dharma-text transition mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Learning Hub · अध्ययन केंद्र</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-saffron-500/15 text-saffron-800 dark:text-saffron-300">
              <HelpCircle className="h-4.5 w-4.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 dark:text-saffron-400">
              Inquiry & Clarity · जिज्ञासा एवं समाधान
            </span>
          </div>

          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-dharma-text">
            Scripture & Tradition FAQs
          </h1>
          <p className="mt-1 font-devanagari text-xl text-dharma-muted">
            प्रमाणिक, निष्पक्ष और दार्शनिक जिज्ञासा समाधान
          </p>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-dharma-muted max-w-2xl">
            Thoughtful answers to common questions about scripture authority, ethics, schools of philosophy, and widespread modern misunderstandings.
          </p>

          {/* Search bar */}
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dharma-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full rounded-2xl border border-dharma-border bg-dharma-card pl-10 pr-9 py-2.5 text-xs sm:text-sm text-dharma-text placeholder:text-dharma-muted/70 outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/20 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-dharma-muted hover:text-dharma-text"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div
            role="tablist"
            aria-label="FAQ categories"
            className="mt-6 flex flex-wrap gap-2 pt-2"
          >
            {CATEGORY_TABS.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`focus-ring min-h-[42px] rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    active
                      ? 'bg-saffron-600 text-white shadow-xs'
                      : 'border border-dharma-border bg-dharma-card text-dharma-muted hover:border-saffron-400 hover:text-dharma-text'
                  }`}
                >
                  <span lang="hi" className="font-devanagari mr-1 font-normal">{cat.labelHi}</span>
                  <span>· {cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Accordion Questions List */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-10">
        <p className="text-xs text-dharma-muted mb-4">
          Showing {filteredFaqs.length} questions:
        </p>

        {filteredFaqs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-dharma-border bg-dharma-card p-12 text-center max-w-md mx-auto">
            <p className="text-sm font-semibold text-dharma-text">No questions matching your search</p>
            <p className="mt-1 text-xs text-dharma-muted">Try a different search term or select &lsquo;All FAQs&rsquo;.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = Boolean(expandedIds[faq.id]);
              return (
                <article
                  key={faq.id}
                  className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xs transition hover:border-saffron-400/60 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    className="focus-ring w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 rounded-md bg-saffron-500/10 px-2.5 py-0.5">
                        {faq.category}
                      </span>
                      <h2 className="mt-2 font-serif text-base sm:text-lg font-bold text-dharma-text leading-snug">
                        {faq.questionEn}
                      </h2>
                      <p lang="hi" className="mt-0.5 font-devanagari text-sm text-dharma-muted">
                        {faq.questionHi}
                      </p>
                    </div>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-dharma-bg border border-dharma-border text-dharma-muted transition">
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 border-t border-dharma-border/60 pt-4 text-xs sm:text-sm leading-relaxed space-y-3">
                      <p className="text-dharma-text">
                        {faq.answerEn}
                      </p>
                      <p lang="hi" className="font-devanagari text-dharma-text/90 leading-relaxed border-t border-dharma-border/40 pt-2">
                        {faq.answerHi}
                      </p>

                      <p className="mt-3 text-sm text-dharma-muted">
                        {faq.reviewer && faq.lastReviewed
                          ? `Reviewed by ${faq.reviewer}, last reviewed ${faq.lastReviewed}.`
                          : 'Not yet reviewed by a named reviewer. Treat this as an editorial draft.'}
                      </p>

                      {faq.canonicalReferences && faq.canonicalReferences.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-dharma-border/40">
                          <span className="text-[11px] font-bold text-dharma-muted uppercase tracking-wider">
                            Canonical Sources:
                          </span>
                          {faq.canonicalReferences.map((ref, idx) => (
                            <span
                              key={idx}
                              className="rounded-lg border border-dharma-border bg-dharma-bg px-2 py-0.5 text-xs text-dharma-muted"
                            >
                              {ref}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
