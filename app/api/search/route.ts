import { NextRequest, NextResponse } from 'next/server';
import { searchVerses, searchVersesCount } from '@/app/lib/db';

const RESULTS_PER_PAGE = 20;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  const pageStr = request.nextUrl.searchParams.get('page');
  const category = request.nextUrl.searchParams.get('category') || undefined;
  const page = Math.max(1, parseInt(pageStr || '1', 10) || 1);

  if (!q || !q.trim()) {
    return NextResponse.json({ error: 'खोज शब्द आवश्यक है' }, { status: 400 });
  }

  if (q.length > 500) {
    return NextResponse.json({ error: 'खोज शब्द बहुत लंबा है' }, { status: 400 });
  }

  try {
    const trimmed = q.trim();
    const total = searchVersesCount(trimmed, category);
    const results = searchVerses(trimmed, RESULTS_PER_PAGE, (page - 1) * RESULTS_PER_PAGE, category);
    const totalPages = Math.ceil(total / RESULTS_PER_PAGE);

    return NextResponse.json({
      results,
      query: trimmed,
      page,
      totalPages,
      total,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'खोज में त्रुटि हुई', results: [], total: 0, page: 1, totalPages: 0 },
      { status: 500 }
    );
  }
}
