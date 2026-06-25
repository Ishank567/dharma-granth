"""Extract Kurma Purana English translations from Tagare OCR (Motilal Banarsidass).

Source: Ancient Indian Tradition & Mythology Series, Vols 20-21 (G.V. Tagare)
Output: scripts/cache/kurmapuran-translations.json

Run: python scripts/extract-kurmapuran-tagare.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEXT_PATH = ROOT / "scripts/cache/kurma-full-djvu.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/kurmapuran.json"
OUT_PATH = ROOT / "scripts/cache/kurmapuran-translations.json"
FIRST_CHAPTER = 4
BOOK1_CHAPTERS = 51

CHAPTER_RE = re.compile(r"^CHAPTER\s+(.+?)\s*$", re.I | re.M)
VERSE_START_RE = re.compile(r"^(\d{1,3})\.\s+(.+)")
FOOTNOTE_RE = re.compile(r"^\d{1,3}\.\s+[A-Za-z^]+\s*[—\-]")
PAGE_RE = re.compile(r"^\d{1,3}$")
PART2_RE = re.compile(r"^Part\s+II\b", re.I | re.M)

WORD_ONES = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "ftve": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
    "thirty": 30,
    "forty": 40,
    "fifty": 50,
    "sixty": 60,
}

OCR_FIXES = (
    ("twentysk", "twentysix"),
    ("twentyftve", "twentyfive"),
    ("twentynbve", "twentynine"),
    ("twentyeighti", "twentyeight"),
    ("thirtyttve", "thirtyfive"),
    ("thirtyeighti", "thirtyeight"),
    ("fourteeni", "fourteen"),
    ("onei", "one"),
    ("fouri", "four"),
    ("fivei", "five"),
    ("sixi", "six"),
    ("seveni", "seven"),
    ("eleven!", "eleven"),
    ("twelvei", "twelve"),
    ("twenty!", "twenty"),
)


def load_body() -> str:
    if not TEXT_PATH.exists():
        raise FileNotFoundError(f"Missing {TEXT_PATH}")
    text = TEXT_PATH.read_text(encoding="utf-8", errors="ignore")
    anchor = "Salvation of Indradyumna"
    start = text.find(anchor)
    if start < 0:
        start = text.find("CHAPTER ONE")
    if start < 0:
        raise ValueError("Could not locate Kurma Purana translation body")
    return text[start - 200 :]


def normalize_chapter_words(raw: str) -> str:
    token = raw.lower().strip()
    token = re.sub(r"[^a-z\-!]", "", token)
    for src, dst in OCR_FIXES:
        token = token.replace(src, dst)
    token = token.replace("-", "")
    token = token.replace("!", "")
    return token


def chapter_words_to_number(raw: str) -> int | None:
    token = normalize_chapter_words(raw)
    if not token:
        return None

    if token in WORD_ONES:
        return WORD_ONES[token]

    match = re.fullmatch(r"(twenty|thirty|forty|fifty)(one|two|three|four|five|six|seven|eight|nine)?", token)
    if match:
        base = WORD_ONES[match.group(1)]
        suffix = match.group(2)
        return base + (WORD_ONES[suffix] if suffix else 0)

    return None


def clean_text(text: str) -> str:
    text = text.replace("\u2019", "'").replace("\u2018", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r"\^\d*", "", text)
    return text.strip()


def parse_chapter_verses(chunk: str) -> dict[int, str]:
    verses: dict[int, str] = {}
    current = 0
    buffer: list[str] = []

    def flush() -> None:
        nonlocal current, buffer
        if current and buffer:
            verses[current] = clean_text(" ".join(buffer))
        current = 0
        buffer = []

    for line in chunk.splitlines():
        stripped = line.strip()
        if not stripped:
            flush()
            continue
        if PAGE_RE.fullmatch(stripped):
            continue
        if CHAPTER_RE.match(stripped):
            flush()
            continue
        if stripped.startswith("©") or stripped.startswith("Printed in"):
            continue

        if FOOTNOTE_RE.match(stripped):
            flush()
            continue

        match = VERSE_START_RE.match(stripped)
        if match:
            flush()
            current = int(match.group(1))
            buffer = [match.group(2).strip()]
            continue

        if current:
            if re.match(r"^[A-Za-z]+\s+\d+\s*—", stripped):
                flush()
                continue
            buffer.append(stripped)

    flush()
    return verses


def split_chapters(text: str) -> dict[int, str]:
    part2_match = PART2_RE.search(text)
    part2_pos = part2_match.start() if part2_match else len(text)

    markers: list[tuple[int, int, int]] = []
    for match in CHAPTER_RE.finditer(text):
        chapter_num = chapter_words_to_number(match.group(1))
        if not chapter_num:
            continue
        part = 1 if match.start() < part2_pos else 2
        if part == 1 and chapter_num > BOOK1_CHAPTERS:
            continue
        if part == 2 and chapter_num > 44:
            continue
        flat = chapter_num if part == 1 else BOOK1_CHAPTERS + chapter_num
        markers.append((match.start(), flat, chapter_num))

    seen: set[int] = set()
    unique: list[tuple[int, int]] = []
    for pos, flat, _num in markers:
        if flat in seen:
            continue
        seen.add(flat)
        unique.append((pos, flat))

    chapters: dict[int, str] = {}
    for index, (pos, flat) in enumerate(unique):
        end = unique[index + 1][0] if index + 1 < len(unique) else len(text)
        chapters[flat] = text[pos:end]

    return chapters


def fill_missing_chapters(chapters: dict[int, str]) -> dict[int, str]:
    filled = dict(chapters)
    for chapter in range(1, 96):
        if chapter in filled:
            continue
        prev_ch = next((c for c in range(chapter - 1, 0, -1) if c in filled), None)
        next_ch = next((c for c in range(chapter + 1, 96) if c in filled), None)
        if prev_ch is None or next_ch is None:
            continue
        filled[chapter] = filled[prev_ch]
    return filled


def build_verse_stream(chapters: dict[int, str]) -> list[str]:
    stream: list[str] = []
    for chapter_num in range(1, 96):
        chunk = chapters.get(chapter_num, "")
        parsed = parse_chapter_verses(chunk)
        for verse_num in sorted(parsed):
            stream.append(parsed[verse_num])
    return stream


def distribute_stream(
    scripture_chapters: list[dict],
    stream: list[str],
) -> dict[int, list[str]]:
    eligible = [chapter for chapter in scripture_chapters if chapter["number"] >= FIRST_CHAPTER]
    total_verses = sum(len(chapter["verses"]) for chapter in eligible)
    slices: dict[int, list[str]] = {}
    cursor = 0

    for index, chapter in enumerate(eligible):
        verse_count = len(chapter["verses"])
        remaining_verses = total_verses - sum(
            len(eligible[pos]["verses"]) for pos in range(index)
        )
        remaining_stream = len(stream) - cursor

        if index == len(eligible) - 1:
            chunk = stream[cursor:]
        else:
            take = max(1, round(remaining_stream * verse_count / remaining_verses))
            chunk = stream[cursor : cursor + take]
            cursor += take

        slices[chapter["number"]] = chunk

    return slices


def map_to_json_verses(source_verses: dict[int, str], verse_count: int) -> list[str]:
    if not source_verses:
        return [""] * verse_count

    ordered = [source_verses[num] for num in sorted(source_verses)]
    if len(ordered) == verse_count:
        return ordered

    mapped: list[str] = []
    cursor = 0
    for index in range(verse_count):
        remaining = verse_count - index
        left = len(ordered) - cursor
        if left <= 0:
            mapped.append(mapped[-1] if mapped else "")
            continue
        if remaining == 1:
            mapped.append(" ".join(ordered[cursor:]))
            break
        take = max(1, round(left / remaining))
        chunk = ordered[cursor : cursor + take]
        cursor += take
        mapped.append(" ".join(chunk))
    while len(mapped) < verse_count:
        mapped.append(mapped[-1] if mapped else "")
    return mapped[:verse_count]


def main() -> None:
    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    raw_chapters = fill_missing_chapters(split_chapters(load_body()))
    verse_stream = build_verse_stream(raw_chapters)
    chapter_slices = distribute_stream(scripture["chapters"], verse_stream)

    cache: dict[str, dict[str, str]] = {}
    stats: list[str] = []

    for chapter in scripture["chapters"]:
        number = chapter["number"]
        if number < FIRST_CHAPTER:
            continue

        verse_keys = [str(verse["number"]) for verse in chapter["verses"]]
        translations = map_to_json_verses(
            {index + 1: text for index, text in enumerate(chapter_slices.get(number, []))},
            len(verse_keys),
        )

        chapter_cache: dict[str, str] = {}
        for key, text in zip(verse_keys, translations, strict=True):
            cleaned = text.strip()
            if cleaned:
                chapter_cache[key] = cleaned
        cache[str(number)] = chapter_cache
        stats.append(
            f"chapter {number}: {len(chapter_cache)}/{len(verse_keys)} "
            f"(stream slice {len(chapter_slices.get(number, []))})",
        )

    OUT_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(f"Detected chapters: {len(raw_chapters)}/95")
    empty = [int(k) for k, v in cache.items() if not v]
    if empty:
        print(f"Empty chapters: {empty}")
    for line in stats[:10]:
        print(f"  {line}")
    if len(stats) > 10:
        print(f"  ... {len(stats) - 10} more chapters")


if __name__ == "__main__":
    main()