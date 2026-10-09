import { NextResponse } from 'next/server';
import { buildVerseIndex } from '@/lib/verse-search-data';

// Emitted as a static file by `output: 'export'`; the search dialog fetches it
// the first time search is opened (like /chapter-index.json).
export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(buildVerseIndex());
}
