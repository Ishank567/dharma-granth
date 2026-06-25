"""Extract Matsya Purana English from Tagare/DLI OCR (Motilal Banarsidass).

Sources:
  - Part I: in.ernet.dli.2015.45856
  - Part II: in.ernet.dli.2015.45858

Roman-numeral chapter headers; verse numbers often appear as em-dash suffixes.
JSON chapters 7-176 map 1:1 where source exists; global-stream fallback otherwise.
Chapters 1-6 keep curated highlights.

Output: scripts/cache/matsyapuran-translations.json

Run: python scripts/extract-matsyapuran-tagare.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PART1_PATH = ROOT / "scripts/cache/matsya-part1-djvu.txt"
PART2_PATH = ROOT / "scripts/cache/matsya-part2-djvu.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/matsyapuran.json"
OUT_PATH = ROOT / "scripts/cache/matsyapuran-translations.json"
FIRST_CHAPTER = 7
LAST_SOURCE_CHAPTER = 176

CHAPTER_RE = re.compile(
    r'^[\s"\u201c]*CHAPTER\.?\s+([A-Z0-9][A-Z0-9\s,\'\*:f]*)\.?\s*$',
    re.I | re.M,
)
VERSE_END_RE = re.compile(r"—\s*(\d{1,3})(?:-(\d{1,3}))?\.\s*$")
VERSE_START_RE = re.compile(r"^(\d{1,3})(?:-(\d{1,3}))?\.\s+(.+)")
PAGE_RE = re.compile(r"^\d{1,3}$")
FOOTNOTE_RE = re.compile(r"^\d{1,3}\.\s+[A-Za-z^]+\s*[—\-]")

ROMAN_VALUES = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}

OCR_ROMAN_FIXES = (
    ("YI", "VI"),
    ("YII", "VII"),
    ("YIL", "VII"),
    ("IL", "II"),
    ("HI", "III"),
    ("1H", "III"),
    ("1L", "II"),
    ("XVJI", "XVII"),
    ("XVfll", "XVIII"),
    ("XXfll", "XXIII"),
    ("XXIIl", "XXIII"),
    ("XXVir", "XXVII"),
    ("XXKiX", "XXIX"),
    ("evil", "CVII"),
    ("XGV", "XCV"),
    ("XaiX", "XCIX"),
    ("XX 11", "XXII"),
)


def preprocess_text(text: str) -> str:
    text = text.replace("\r\n", "\n")
    text = re.sub(r'^[\s"]*CHAPTER\s+YI\.', "CHAPTER VI.", text, flags=re.I | re.M)
    text = re.sub(r'^[\s"]*CHAPTER\s+IL\.', "CHAPTER II.", text, flags=re.I | re.M)
    text = re.sub(r'^[\s"]*CHAPTER\s+HI\.', "CHAPTER III.", text, flags=re.I | re.M)
    return text


def load_part(path: Path, anchor: str) -> str:
    if not path.exists():
        raise FileNotFoundError(f"Missing {path}")
    text = path.read_text(encoding="utf-8", errors="ignore")
    start = text.find(anchor)
    if start < 0:
        raise ValueError(f"Could not locate Matsya body anchor {anchor!r} in {path.name}")
    return preprocess_text(text[start:])


def normalize_roman(raw: str) -> str:
    token = raw.upper().strip()
    token = re.sub(r"[^A-Z0-9]", "", token)
    for src, dst in OCR_ROMAN_FIXES:
        token = token.replace(src.upper(), dst.upper())
    token = re.sub(r"^O(?=X)", "C", token)
    token = re.sub(r"^G(?=X)", "C", token)
    token = re.sub(r"^O(?=L)", "C", token)
    token = re.sub(r"^G(?=L)", "C", token)
    return token


def roman_to_int(token: str) -> int | None:
    if not token:
        return None
    total = 0
    prev = 0
    for ch in reversed(token):
        val = ROMAN_VALUES.get(ch, 0)
        if val == 0:
            return None
        total += val if val >= prev else -val
        prev = val
    return total if total > 0 else None


def chapter_header_to_number(raw: str) -> int | None:
    num = roman_to_int(normalize_roman(raw))
    if not num or num > LAST_SOURCE_CHAPTER:
        return None
    return num


def clean_text(text: str) -> str:
    text = text.replace("\u2019", "'").replace("\u2018", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r"\^\d*", "", text)
    return text.strip()


def parse_chapter_blocks(chunk: str) -> list[str]:
    blocks: list[str] = []
    current: list[str] = []

    def flush() -> None:
        if not current:
            return
        merged = clean_text(" ".join(current))
        if len(merged) >= 8:
            blocks.append(merged)
        current.clear()

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
        if stripped.upper().startswith("NOTE"):
            flush()
            continue
        if FOOTNOTE_RE.match(stripped):
            flush()
            continue
        if re.match(r"^THE\s+MATSYA\s+PU", stripped, re.I):
            flush()
            continue

        start_match = VERSE_START_RE.match(stripped)
        if start_match:
            flush()
            current = [start_match.group(3).strip()]
            if VERSE_END_RE.search(stripped):
                flush()
            continue

        if current:
            current.append(stripped)
        else:
            current = [stripped]

        if VERSE_END_RE.search(stripped):
            flush()

    flush()
    return blocks


def split_chapters(text: str) -> dict[int, str]:
    markers: list[tuple[int, int, int]] = []
    for match in CHAPTER_RE.finditer(text):
        raw = match.group(1)
        if raw.upper().startswith("CHAPTERS"):
            continue
        chapter_num = chapter_header_to_number(raw)
        if not chapter_num:
            continue
        markers.append((match.start(), match.end(), chapter_num))

    seen: set[int] = set()
    unique: list[tuple[int, int, int]] = []
    for item in markers:
        if item[2] in seen:
            continue
        seen.add(item[2])
        unique.append(item)

    chapters: dict[int, str] = {}
    for index, (_start, end, chapter_num) in enumerate(unique):
        next_start = unique[index + 1][0] if index + 1 < len(unique) else len(text)
        chapters[chapter_num] = text[end:next_start]
    return chapters


def merge_chapter_sources(*sources: dict[int, str]) -> dict[int, str]:
    merged: dict[int, str] = {}
    for source in sources:
        for chapter_num, body in source.items():
            if chapter_num < 1 or chapter_num > LAST_SOURCE_CHAPTER:
                continue
            existing = merged.get(chapter_num, "")
            if len(body) > len(existing):
                merged[chapter_num] = body
    return merged


def map_sequential(blocks: list[str], verse_count: int) -> list[str]:
    if verse_count <= 0:
        return []
    if not blocks:
        return [""] * verse_count
    if len(blocks) == verse_count:
        return blocks

    mapped: list[str] = []
    cursor = 0
    for index in range(verse_count):
        remaining = verse_count - index
        left = len(blocks) - cursor
        if left <= 0:
            mapped.append(mapped[-1] if mapped else "")
            continue
        if remaining == 1:
            mapped.append(" ".join(blocks[cursor:]))
            break
        take = max(1, round(left / remaining))
        chunk = blocks[cursor : cursor + take]
        cursor += take
        mapped.append(" ".join(chunk))
    while len(mapped) < verse_count:
        mapped.append(mapped[-1] if mapped else "")
    return mapped[:verse_count]


def build_global_blocks(chapters: dict[int, str], start: int, end: int) -> list[str]:
    stream: list[str] = []
    for chapter_num in range(start, end + 1):
        stream.extend(parse_chapter_blocks(chapters.get(chapter_num, "")))
    return stream


def global_block_slices(
    scripture_chapters: list[dict],
    stream: list[str],
) -> dict[int, list[str]]:
    eligible = [chapter for chapter in scripture_chapters if chapter["number"] >= FIRST_CHAPTER]
    total_verses = sum(len(chapter["verses"]) for chapter in eligible)
    slices: dict[int, list[str]] = {}
    cursor = 0
    verses_done = 0

    for index, chapter in enumerate(eligible):
        verse_count = len(chapter["verses"])
        verses_done += verse_count
        remaining_verses = total_verses - verses_done + verse_count
        remaining_blocks = len(stream) - cursor

        if index == len(eligible) - 1:
            chunk = stream[cursor:]
        else:
            take = max(1, round(remaining_blocks * verse_count / remaining_verses))
            chunk = stream[cursor : cursor + take]
            cursor += take

        slices[chapter["number"]] = chunk

    return slices


def main() -> None:
    part1 = split_chapters(load_part(PART1_PATH, "CHAPTER  I"))
    part2 = split_chapters(load_part(PART2_PATH, "CHAPTER CXXIX"))
    raw_chapters = merge_chapter_sources(part1, part2)

    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    global_stream = build_global_blocks(raw_chapters, FIRST_CHAPTER, LAST_SOURCE_CHAPTER)
    global_slices = global_block_slices(scripture["chapters"], global_stream)

    cache: dict[str, dict[str, str]] = {}
    stats: list[str] = []

    for chapter in scripture["chapters"]:
        number = chapter["number"]
        if number < FIRST_CHAPTER:
            continue

        body = raw_chapters.get(number, "")
        blocks = parse_chapter_blocks(body)
        source = "chapter"

        if not blocks:
            blocks = global_slices.get(number, [])
            source = "global"

        verse_keys = [str(verse["number"]) for verse in chapter["verses"]]
        translations = map_sequential(blocks, len(verse_keys))

        chapter_cache: dict[str, str] = {}
        for key, text in zip(verse_keys, translations, strict=True):
            cleaned = text.strip()
            if cleaned:
                chapter_cache[key] = cleaned
        cache[str(number)] = chapter_cache
        stats.append(
            f"chapter {number}: {len(chapter_cache)}/{len(verse_keys)} "
            f"(blocks {len(blocks)}, {source})",
        )

    OUT_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(f"Detected source chapters: {len(raw_chapters)} (max {max(raw_chapters, default=0)})")
    print(f"Global stream blocks: {len(global_stream)}")
    missing_nums = [
        n for n in range(FIRST_CHAPTER, LAST_SOURCE_CHAPTER + 1) if n not in raw_chapters
    ]
    if missing_nums:
        print(f"Missing source chapters: {len(missing_nums)}")
    empty = [int(k) for k, v in cache.items() if not v]
    if empty:
        print(f"Empty chapters: {empty[:20]}{'...' if len(empty) > 20 else ''}")
    for line in stats[:10]:
        print(f"  {line}")
    if len(stats) > 10:
        print(f"  ... {len(stats) - 10} more chapters")


if __name__ == "__main__":
    main()