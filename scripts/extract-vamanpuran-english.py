"""Extract English translations from Gita Press Vamana Purana OCR text.

Source: archive.org (vamanapuranavaishnavaupapuranasanskritenglishocr)
Output: scripts/cache/vamanpuran-translations.json

Run: python scripts/extract-vamanpuran-english.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEXT_PATH = ROOT / "scripts/cache/vamana-english-djvu.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/vamanpuran.json"
OUT_PATH = ROOT / "scripts/cache/vamanpuran-translations.json"
FIRST_CHAPTER = 4
MAIN_CHAPTER_END = 69
SARO_CHAPTER_START = 70
SARO_SOURCE_START = 22

CHAPTER_RE = re.compile(r"^Chapter\s+(\d+)\s*$", re.I | re.M)
PAGE_RE = re.compile(r"^\d{1,3}$")
SKIP_PREFIXES = (
    "VAMANA PURANA",
    "VAMANA PURAlNr",
    "SANSKRIT TEXT",
    "INTRODUCTION",
    "CONTENTS",
    "Jaya (Purana etc.)",
)


def load_body() -> str:
    if not TEXT_PATH.exists():
        raise FileNotFoundError(f"Missing {TEXT_PATH}")
    text = TEXT_PATH.read_text(encoding="utf-8", errors="ignore")
    marker = "Jaya (Purana etc.)"
    start = text.find(marker)
    if start < 0:
        start = text.find("Lord Visnu, the husband")
    if start < 0:
        raise ValueError("Could not locate Vamana Purana translation body")
    return text[start:]


def is_english_line(line: str) -> bool:
    stripped = line.strip()
    if len(stripped) < 12:
        return False
    if PAGE_RE.fullmatch(stripped):
        return False
    if stripped.startswith(SKIP_PREFIXES):
        return False
    if CHAPTER_RE.match(stripped):
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

    seen: set[int] = set()
    unique_markers: list[tuple[int, int, int]] = []
    for item in markers:
        chapter_num = item[2]
        if chapter_num in seen:
            continue
        seen.add(chapter_num)
        unique_markers.append(item)

    for index, (_start, end, chapter_num) in enumerate(unique_markers):
        next_start = (
            unique_markers[index + 1][0] if index + 1 < len(unique_markers) else len(text)
        )
        body = text[end:next_start]
        chapters[chapter_num] = body

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


def distribute_paragraphs(
    chapters: list[dict],
    paragraphs: list[str],
) -> dict[int, list[str]]:
    eligible = [chapter for chapter in chapters if chapter["number"] >= SARO_CHAPTER_START]
    total_verses = sum(len(chapter["verses"]) for chapter in eligible)
    slices: dict[int, list[str]] = {}
    cursor = 0
    verses_done = 0

    for index, chapter in enumerate(eligible):
        verse_count = len(chapter["verses"])
        verses_done += verse_count
        remaining_verses = total_verses - verses_done + verse_count
        remaining_paragraphs = len(paragraphs) - cursor

        if index == len(eligible) - 1:
            chunk = paragraphs[cursor:]
        else:
            take = max(1, round(remaining_paragraphs * verse_count / remaining_verses))
            chunk = paragraphs[cursor : cursor + take]
            cursor += take

        slices[chapter["number"]] = chunk

    return slices


def main() -> None:
    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    raw_chapters = split_chapters(load_body())

    saro_parts: list[str] = []
    for source_num in range(SARO_SOURCE_START, 97):
        saro_parts.append(raw_chapters.get(source_num, ""))
    saro_paragraphs = parse_chapter_paragraphs("".join(saro_parts))
    saro_slices = distribute_paragraphs(scripture["chapters"], saro_paragraphs)

    cache: dict[str, dict[str, str]] = {}
    stats: list[str] = []

    for chapter in scripture["chapters"]:
        number = chapter["number"]
        if number < FIRST_CHAPTER:
            continue

        if number <= MAIN_CHAPTER_END:
            body = raw_chapters.get(number, "")
            paragraphs = parse_chapter_paragraphs(body)
        else:
            paragraphs = saro_slices.get(number, [])

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
    empty = [int(k) for k, v in cache.items() if not v]
    if empty:
        print(f"Empty chapters: {empty}")
    for line in stats[:10]:
        print(f"  {line}")
    if len(stats) > 10:
        print(f"  ... {len(stats) - 10} more chapters")


if __name__ == "__main__":
    main()