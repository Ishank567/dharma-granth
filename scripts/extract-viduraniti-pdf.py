"""Extract verse-aligned Ganguli translations from the Vidura Niti PDF cache."""
from __future__ import annotations

import json
import re
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent.parent
PDF_PATH = ROOT / "scripts/cache/viduraniti-translation.pdf"
OUT_PATH = ROOT / "scripts/cache/viduraniti-translations.json"

DEVANAGARI_DIGITS = "०१२३४५६७८९"
ADHYAYAS = [36, 37, 38, 39, 40]
MARKER_RE = re.compile(r"॥\s*([०-९\d]+)\s*॥?")

SPLIT_RULES = [
    r"(?=The Sadhyas said,)",
    r"(?=In days of old,)",
    r"(?=The mendicant Rishi answered,)",
    r"(?=Vidura said,)",
    r"(?=Dhritarashtra said,)",
    r"(?=Vaisampayana said,)",
    r"(?=Despatched by)",
    r"(?=Thus addressed,)",
    r"(?=Thereupon)",
    r"(?=He that)",
    r"(?=One should)",
    r"(?=O king,)",
    r"(?=O sire,)",
]


def devanagari_to_int(raw: str | None) -> int:
    if not raw:
        return 0
    out = []
    for ch in raw.strip():
        if ch in DEVANAGARI_DIGITS:
            out.append(str(DEVANAGARI_DIGITS.index(ch)))
        elif ch.isdigit():
            out.append(ch)
    return int("".join(out)) if out else 0


def normalize_text(text: str) -> str:
    text = text.replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def strip_pdf_noise(text: str) -> str:
    lines: list[str] = []
    for line in text.splitlines():
        s = line.strip()
        if not s:
            lines.append("")
            continue
        if re.fullmatch(r"Vidura Niti", s, re.I):
            continue
        if re.fullmatch(r"\d+", s):
            continue
        if s in {"॥", "।"}:
            continue
        if s.startswith("Source of E-texts:"):
            break
        lines.append(s)
    return "\n".join(lines)


def clean_chunk(text: str) -> str:
    text = strip_pdf_noise(text)
    text = re.sub(r"^[।\s]+", "", text)
    text = re.sub(r"[।\s]+$", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def find_adhyaya_starts(text: str) -> dict[int, int]:
    """Locate adhyāya 36–40 by standalone chapter number followed by verse 1."""
    starts: dict[int, int] = {}
    for adhyaya in ADHYAYAS:
        adhyaya_dev = "".join(DEVANAGARI_DIGITS[int(d)] for d in str(adhyaya))
        pattern = (
            rf"(?<![॥]){adhyaya_dev}\s*\n\s*"
            rf"(?:।\s*\n\s*){{0,2}}॥\s*१\s*॥?"
        )
        match = re.search(pattern, text)
        if match:
            starts[adhyaya] = match.start()
    return starts


def split_text_blocks(text: str, count: int) -> list[str]:
    text = clean_chunk(text)
    if count <= 0 or not text:
        return []

    for rule in SPLIT_RULES:
        parts = re.split(rule, text)
        parts = [p.strip() for p in parts if p.strip()]
        if len(parts) >= count:
            return parts[:count]

    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
    if len(sentences) >= count:
        size = max(1, len(sentences) // count)
        grouped: list[str] = []
        idx = 0
        for i in range(count):
            if i == count - 1:
                grouped.append(" ".join(sentences[idx:]))
            else:
                grouped.append(" ".join(sentences[idx : idx + size]))
                idx += size
        return [g for g in grouped if g]

    if count == 1:
        return [text]
    return []


def collect_numbered_markers(text: str, expected_count: int) -> list[tuple[int, int, int]]:
    seen: set[int] = set()
    numbered: list[tuple[int, int, int]] = []
    for match in MARKER_RE.finditer(text):
        num = devanagari_to_int(match.group(1))
        if num <= 0 or num > expected_count or num in seen:
            continue
        seen.add(num)
        numbered.append((num, match.start(), match.end()))
    return numbered


def fill_from_follower(verses: dict[int, str], num: int, expected_count: int) -> None:
    for nxt in range(num + 1, expected_count + 2):
        follower = verses.get(nxt)
        if not follower:
            continue
        sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", follower) if s.strip()]
        if len(sentences) >= 2:
            verses[num] = sentences[0]
            verses[nxt] = " ".join(sentences[1:])
            return


def parse_adhyaya(text: str, expected_count: int) -> dict[int, str]:
    numbered = collect_numbered_markers(text, expected_count)
    verses: dict[int, str] = {}

    for i, (num, _start, end) in enumerate(numbered):
        chunk_end = numbered[i + 1][1] if i + 1 < len(numbered) else len(text)
        chunk = clean_chunk(text[end:chunk_end])
        if chunk:
            verses[num] = chunk

    if numbered:
        first_num = numbered[0][0]
        if first_num > 1:
            preamble = text[: numbered[0][1]]
            for idx, piece in enumerate(split_text_blocks(preamble, first_num - 1), start=1):
                if piece:
                    verses.setdefault(idx, piece)

        for i in range(len(numbered) - 1):
            num, _, end = numbered[i]
            next_num, next_start, _ = numbered[i + 1]
            if next_num <= num + 1:
                continue
            gap_text = text[end:next_start]
            pieces = split_text_blocks(gap_text, next_num - num - 1)
            for offset, piece in enumerate(pieces, start=1):
                target = num + offset
                if piece and target < next_num:
                    verses.setdefault(target, piece)

    missing = sorted(set(range(1, expected_count + 1)) - set(verses))
    for num in missing:
        fill_from_follower(verses, num, expected_count)

    return verses


def main() -> None:
    pub = json.loads(
        (ROOT / "public/data/scriptures-full/viduraniti.json").read_text(encoding="utf-8"),
    )
    chapter_by_adhyaya: dict[int, int] = {}
    for chapter in pub["chapters"]:
        m = re.search(r"अध्यायः\s*([०-९\d]+)", chapter["verses"][0]["sanskrit"])
        if m:
            chapter_by_adhyaya[devanagari_to_int(m.group(1))] = len(chapter["verses"])

    if not PDF_PATH.exists():
        raise SystemExit(f"Missing PDF: {PDF_PATH}")

    doc = fitz.open(PDF_PATH)
    raw = normalize_text("\n".join(doc[i].get_text() for i in range(doc.page_count)))
    starts = find_adhyaya_starts(raw)
    if len(starts) < len(ADHYAYAS):
        raise SystemExit(f"Could only locate {len(starts)} adhyaya starts: {starts}")

    ordered = sorted(starts.items())
    result: dict[str, dict[str, str]] = {}

    for idx, (adhyaya, start) in enumerate(ordered):
        end = ordered[idx + 1][1] if idx + 1 < len(ordered) else len(raw)
        section = raw[start:end]
        expected = chapter_by_adhyaya[adhyaya]
        verses = parse_adhyaya(section, expected)
        result[str(adhyaya)] = {str(k): v for k, v in sorted(verses.items())}
        print(f"adhyaya {adhyaya}: {len(verses)}/{expected} verses")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {OUT_PATH}")


if __name__ == "__main__":
    main()