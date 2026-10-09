import type { Metadata } from 'next';
import Link from 'next/link';
import { buildWordIndex } from '@/lib/ashtavakra-words';
import { verseHref } from '@/lib/ashtavakra';

export const metadata: Metadata = {
  title: 'शब्द-अन्वेषण: अष्टावक्र गीता के प्रमुख शब्दार्थ',
  description: 'अष्टावक्र गीता के प्रकाशित और सत्यापित श्लोकों के प्रमुख शब्दार्थ — पद-समूह वैसे जैसे प्रत्येक श्लोक में दिए गए हैं, संबंधित श्लोकों के साथ।',
  alternates: { canonical: '/ashtavakra/words/' },
};

/**
 * Word explorer: every glossed pada from every published, verified verse,
 * grouped by initial letter. Plain server-rendered HTML; no client script.
 */
export default function WordsPage() {
  const index = buildWordIndex();

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <nav aria-label="ब्रेडक्रम्ब" className="ash-meta">
        <Link href="/ashtavakra/" className="ash-link underline">अष्टावक्र गीता</Link> / <span>शब्द-अन्वेषण</span>
      </nav>
      <h1 lang="hi" className="mt-4 font-bold" style={{ fontSize: 'clamp(1.6rem, 1.2rem + 1.5vw, 2.2rem)', lineHeight: 1.4 }}>
        शब्द-अन्वेषण
      </h1>
      <p lang="hi" className="ash-hindi mt-2">
        प्रकाशित और सत्यापित श्लोकों ({index.verseCount}) के प्रमुख शब्दार्थ — कुल {index.wordCount} पद-समूह।
        {' '}जिन {index.flaggedExcluded} श्लोकों पर “समीक्षा आवश्यक” का चिह्न है, उनके शब्द यहाँ शामिल नहीं हैं।
      </p>
      <p lang="hi" className="ash-meta mt-2">
        ये शब्दार्थ वही संपादकीय पदार्थ हैं जो प्रत्येक श्लोक के “पदच्छेद और प्रमुख शब्दार्थ” भाग में दिए गए हैं;
        पद-समूह उसी रूप में रखे गए हैं जैसे छपे हैं, और यह शब्दकोश या पाणिनीय व्युत्पत्ति का दावा नहीं करता।
      </p>

      <nav aria-label="पहला अक्षर" className="mt-6 flex flex-wrap gap-2">
        {index.groups.map((g) => (
          <a
            key={g.letter}
            href={`#letter-${encodeURIComponent(g.letter)}`}
            lang="sa"
            className="ash-btn"
            aria-label={`अक्षर ${g.letter} — ${g.words.length} पद`}
          >
            {g.letter} <span className="ash-meta">({g.words.length})</span>
          </a>
        ))}
      </nav>

      <div className="mt-8 grid gap-8">
        {index.groups.map((g) => (
          <section key={g.letter} aria-labelledby={`letter-${g.letter}`} className="scroll-mt-6">
            <h2 id={`letter-${g.letter}`} lang="sa" className="font-bold" style={{ fontSize: '1.4rem' }}>
              {g.letter}
            </h2>
            <dl className="mt-3 grid gap-3">
              {g.words.map((w) => (
                <div key={w.word} className="ash-card">
                  <dt lang="sa" className="font-bold">{w.word}</dt>
                  <dd className="mt-1">
                    <ul className="grid gap-2">
                      {w.glosses.map((gl) => (
                        <li key={gl.hindi} lang="hi">
                          <span>{gl.hindi}</span>{' '}
                          <span className="ash-meta">
                            ({gl.refs.map((r, i) => (
                              <span key={r}>
                                {i > 0 && ', '}
                                <Link href={verseHref(r)} className="ash-link underline">श्लोक {r}</Link>
                              </span>
                            ))})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <p className="ash-meta mt-10">
        नया प्रकरण प्रकाशित होते ही यह सूची स्वयं बढ़ जाती है; कोई अलग से संपादित शब्दकोश नहीं रखा गया है।
      </p>
    </main>
  );
}
