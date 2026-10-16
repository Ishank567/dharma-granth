/**
 * Shown under a verse when no written simple meaning, example, or practice exists.
 * The library translation stays in the reader above. This block does not invent one.
 */
export function VerseReadingGap() {
  return (
    <section id="understand-h" aria-labelledby="layer-gap-title" className="mt-8 rounded-2xl border border-dharma-border bg-dharma-card p-5 sm:p-6">
      <h2 id="layer-gap-title" className="font-serif text-lg font-bold text-dharma-text">
        सरल पढ़ना अभी नहीं लिखा गया
      </h2>
      <p lang="hi" className="mt-2 text-sm leading-relaxed text-dharma-text">
        इस श्लोक के लिए अलग सरल अर्थ, आज की सीधी भाषा, विद्यार्थी या परिवार का उदाहरण, अभ्यास और एक पंक्ति का सार नहीं लिखा गया। ऊपर जो संस्कृत, अनुवाद या व्याख्या है, वही पुस्तकालय में दर्ज पाठ है।
      </p>
      <p className="mt-2 text-sm leading-relaxed text-dharma-text-secondary">
        A plain restatement, a today-example, and a practice for this verse are not written yet.
      </p>
    </section>
  );
}
