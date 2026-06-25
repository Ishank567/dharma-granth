"""Extract English translations from Geeta Press Narasimha Purana OCR text.

Source: archive.org OCR (narasimha-purana-english_djvu.txt)
Output: scripts/cache/narasimhapuran-translations.json

Run: python scripts/extract-narasimhapuran-english.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEXT_PATH = ROOT / "scripts/cache/narasimha-english-plain.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/narasimhapuran.json"
OUT_PATH = ROOT / "scripts/cache/narasimhapuran-translations.json"
FIRST_CHAPTER = 5

CHAPTER_RE = re.compile(r"^CH(?:A|EI)?APTER\s+(\d+)\b", re.I | re.M)
PAGE_RE = re.compile(r"^\d{1,3}$")
SKIP_PREFIXES = (
    "NARASIMHA PURANAM",
    "SANSKRIT TEXT",
    "INTRODUCTION",
    "CONTENTS",
    "om namo",
)


def load_body() -> str:
    if not TEXT_PATH.exists():
        raise FileNotFoundError(f"Missing {TEXT_PATH}")
    text = TEXT_PATH.read_text(encoding="utf-8", errors="ignore")
    marker = "om namo bhagavte"
    start = text.lower().find(marker)
    if start < 0:
        start = text.find("CHAPTER 1")
    return text[start:]


def is_english_line(line: str) -> bool:
    stripped = line.strip()
    if len(stripped) < 12:
        return False
    if PAGE_RE.fullmatch(stripped):
        return False
    if stripped.startswith(SKIP_PREFIXES):
        return False
    if re.match(r"^\d+\.\s", stripped):
        return False
    letters = sum(ch.isalpha() and ord(ch) < 128 for ch in stripped)
    if letters / max(len(stripped), 1) < 0.55:
        return False
    if re.search(r"[॥।\^%]{2,}", stripped):
        return False
    return bool(re.search(r"[A-Za-z]{3,}", stripped))


def normalize_paragraph(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\s+(\d{1,3})\s*$", "", text)
    return text


def parse_chapter_paragraphs(body: str) -> list[str]:
    paragraphs: list[str] = []
    buffer: list[str] = []

    def flush() -> None:
        if not buffer:
            return
        merged = normalize_paragraph(" ".join(buffer))
        if len(merged) >= 20 and is_english_line(merged):
            paragraphs.append(merged)
        buffer.clear()

    for raw in body.splitlines():
        line = raw.strip()
        if not line:
            flush()
            continue
        if CHAPTER_RE.match(line):
            flush()
            continue
        if is_english_line(line):
            buffer.append(line)
        else:
            flush()
    flush()
    return paragraphs


def split_chapters(text: str) -> dict[int, str]:
    chapters: dict[int, str] = {}
    markers: list[tuple[int, int, int]] = []

    for match in CHAPTER_RE.finditer(text):
        markers.append((match.start(), match.end(), int(match.group(1))))

    for index, (_start, end, chapter_num) in enumerate(markers):
        next_start = markers[index + 1][0] if index + 1 < len(markers) else len(text)
        body = text[end:next_start]
        chapters[chapter_num] = chapters.get(chapter_num, "") + body

    # Geeta Press OCR skips the CHAPTER 17 header in the body; recover the gap.
    if 17 not in chapters or not parse_chapter_paragraphs(chapters.get(17, "")):
        sixteen = [item for item in markers if item[2] == 16]
        eighteen = [item for item in markers if item[2] == 18]
        if sixteen and eighteen:
            gap_start = sixteen[-1][1]
            gap_end = eighteen[0][0]
            if gap_end > gap_start:
                chapters[17] = text[gap_start:gap_end]

    return chapters


def map_sequential(paragraphs: list[str], verse_count: int) -> list[str]:
    if verse_count <= 0:
        return []
    if not paragraphs:
        return [""] * verse_count
    if len(paragraphs) == verse_count:
        return paragraphs

    mapped: list[str] = []
    cursor = 0
    for index in range(verse_count):
        remaining = verse_count - index
        left = len(paragraphs) - cursor
        if left <= 0:
            mapped.append(mapped[-1] if mapped else "")
            continue
        if remaining == 1:
            mapped.append(" ".join(paragraphs[cursor:]))
            break
        take = max(1, round(left / remaining))
        chunk = paragraphs[cursor : cursor + take]
        cursor += take
        mapped.append(" ".join(chunk))
    while len(mapped) < verse_count:
        mapped.append(mapped[-1] if mapped else "")
    return mapped[:verse_count]


def main() -> None:
    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    raw_chapters = split_chapters(load_body())
    cache: dict[str, dict[str, str]] = {}
    stats: list[str] = []

    for chapter in scripture["chapters"]:
        number = chapter["number"]
        if number < FIRST_CHAPTER:
            continue
        body = raw_chapters.get(number, "")
        paragraphs = parse_chapter_paragraphs(body)
        verse_keys = [str(verse["number"]) for verse in chapter["verses"]]
        translations = map_sequential(paragraphs, len(verse_keys))

        chapter_cache: dict[str, str] = {}
        for key, text in zip(verse_keys, translations, strict=True):
            cleaned = text.strip()
            if cleaned:
                chapter_cache[key] = cleaned
        cache[str(number)] = chapter_cache
        stats.append(
            f"chapter {number}: {len(chapter_cache)}/{len(verse_keys)} "
            f"(paragraphs {len(paragraphs)})",
        )

    OUT_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    for line in stats[:10]:
        print(f"  {line}")
    if len(stats) > 10:
        print(f"  ... {len(stats) - 10} more chapters")


if __name__ == "__main__":
    main()