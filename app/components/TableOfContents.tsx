'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ChapterEntry {
  id: number;
  chapter_number: number;
  title: string;
  title_hindi: string;
  verse_count: number;
  verse_offset: number;
}

interface Props {
  chapters: ChapterEntry[];
  bookTitle: string;
  bookSlug: string;
  categorySlug: string;
  currentPage: number;
  perPage: number;
  totalVerses: number;
}

function getChapterPage(verseOffset: number, perPage: number): number {
  return Math.floor(verseOffset / perPage) + 1;
}

export default function TableOfContents({
  chapters,
  bookTitle,
  bookSlug,
  categorySlug,
  currentPage,
  perPage,
  totalVerses,
}: Props) {
  const [open, setOpen] = useState(false);

  if (chapters.length === 0) return null;

  const tocItems = chapters.map((ch) => ({
    ...ch,
    page: getChapterPage(ch.verse_offset, perPage),
  }));

  // Find the active chapter: the last chapter whose page <= currentPage
  const activeChapterId = tocItems.reduce<number | null>((acc, ch) => {
    if (ch.page <= currentPage) return ch.id;
    return acc;
  }, null);

  const List = (
    <ol className="space-y-0.5">
      {tocItems.map((ch) => {
        const isActive = ch.id === activeChapterId;
        return (
          <li key={ch.id}>
            <Link
              href={`/categories/${categorySlug}/${bookSlug}?page=${ch.page}#chapter-${ch.id}`}
              className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent/10 ${
                isActive
                  ? 'bg-accent/15 text-accent font-semibold'
                  : 'text-foreground/75 hover:text-foreground'
              }`}
            >
              <span className={`mt-0.5 shrink-0 text-xs font-mono w-5 text-right ${isActive ? 'text-accent' : 'text-muted'}`}>
                {ch.chapter_number}
              </span>
              <span className="font-serif-deva leading-snug">
                {ch.title_hindi || ch.title}
                {ch.verse_count > 0 && (
                  <span className="ml-1.5 text-xs text-muted font-normal font-sans">
                    ({ch.verse_count})
                  </span>
                )}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-4 max-h-[calc(100vh-7rem)] overflow-y-auto">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif-deva text-sm font-bold text-foreground flex items-center gap-1.5">
              <span className="text-accent">📋</span> विषय-सूची
            </h2>
            <span className="text-xs text-muted">{chapters.length} अध्याय</span>
          </div>
          <div className="mb-3 h-px bg-border" />
          {List}
          <div className="mt-3 h-px bg-border" />
          <p className="mt-2 text-xs text-muted text-center">{totalVerses} श्लोक</p>
        </div>
      </aside>

      {/* Mobile collapsible drawer */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-card-hover transition-colors"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2">
            <span className="text-accent">📋</span>
            <span className="font-serif-deva">विषय-सूची</span>
            <span className="text-xs text-muted font-normal">({chapters.length} अध्याय)</span>
          </span>
          <span className={`text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {open && (
          <div className="mt-1 rounded-xl border border-border bg-card p-3">
            {List}
          </div>
        )}
      </div>
    </>
  );
}
