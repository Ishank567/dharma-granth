import { NextResponse } from 'next/server';
import { buildChapterIndex } from '@/lib/chapter-index';

// Emitted as a static file by `output: 'export'`; the search modal fetches
// it lazily the first time search is opened.
export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(buildChapterIndex());
}
