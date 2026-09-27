/** Reader-facing translation defects that field-completeness checks miss. */
export function translationQualityIssue(
  text: unknown,
  sanskrit: unknown = "",
): string | undefined {
  if (text == null || String(text).trim().length < 4) return "missing translation";

  const value = String(text).trim();
  if (/^translation\s*(not available|pending|coming soon|todo|tbd)/i.test(value)) {
    return "translation placeholder";
  }
  if (/^go directly to\b/i.test(value)) return "source navigation text";
  if (/^(?:previous|next)(?: page)?:/i.test(value)) return "source navigation text";
  if (/^footnotes?(?: and references?)?[.:]?$/i.test(value)) return "footnote heading";
  if (/^the (?:bombay|calcutta) edition\b/i.test(value)) return "editorial footnote";
  if (/^for .{1,100} read .{1,100}\.?$/i.test(value)) return "editorial footnote";
  if (/^see [A-Z][^.!?]{0,100}[.!]?$/i.test(value)) return "cross-reference footnote";
  if (/^https?:\/\//i.test(value)) return "source URL";
  if (/^(?:canto|chapter|book|part)\s+[ivxlcdm\d]+\.?$/i.test(value)) {
    return "section heading";
  }
  if (
    /^(?:(?:p|pp|v|vs|mt|vol|volume|note|fn)\.?\s*)?\d+(?:[.\s:,-]+\d+){1,6}\.?$/i.test(value)
  ) {
    return "editorial citation";
  }
  if (/^[A-Z]{2,}(?:\s+[A-Z]{2,}){0,3}[.!]?$/.test(value)) {
    return "OCR gibberish";
  }
  if (/[£¤]/.test(value)) return "OCR gibberish";
  if (/<\/?[a-z][^>]*>/i.test(value)) return "HTML markup";
  if (/\uFFFD|\?{3,}/.test(value)) return "encoding corruption";

  const sourceLength = String(sanskrit ?? "").replace(/\s+/g, "").length;
  const wordCount = value.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
  if (sourceLength > 40 && value.length < 30 && wordCount <= 3) {
    return "implausibly short for one verse";
  }
  if (value.length > 800 && sourceLength > 0 && value.length > sourceLength * 15) {
    return "implausibly long for one verse";
  }
  return undefined;
}

