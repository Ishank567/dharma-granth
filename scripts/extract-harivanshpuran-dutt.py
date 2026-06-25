"""Extract Harivamsha Purana English translations from M.N. Dutt (1897).

Source: M.N. Dutt translation (public domain, Project Gutenberg).
Output: scripts/cache/harivanshpuran-translations.json

Run: python scripts/extract-harivanshpuran-dutt.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEXT_PATH = ROOT / "scripts/cache/harivamsa-dutt.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/harivanshpuran.json"
OUT_PATH = ROOT / "scripts/cache/harivanshpuran-translations.json"
FIRST_CHAPTER = 4

CHAPTER_RE = re.compile(r"^CHAPTER\.?\s+([IVXLC]+)\b", re.I)
PAGE_RE = re.compile(r"^\d{1,3}$")
TOC_DOTS_RE = re.compile(r"\.{5,}")
SKIP_PREFIXES = (
    "HARIVAMSHA",
    "HARIVAMSA",
    "CONTENTS",
    "PREFACE",
    "Digitized",
    "Project Gutenberg",
    "END OF",
)


def load_body_lines() -> list[str]:
    if not TEXT_PATH.exists():
        raise FileNotFoundError(f"Missing {TEXT_PATH}")

    text = TEXT_PATH.read_text(encoding="utf-8", errors="ignore")
    body_start = text.find(
        "CHAPTER I. AN ACCOUNT OF THE PRIMEVAL CREATION\n\n\nHaving saluted Hari"
    )
    if body_start < 0:
        raise ValueError("Could not locate Harivamsha translation body")

    chapter_iv = (
        "CHAPTER IV. A QUERY REGARDING THE ORIGIN OF THE ARTICLES OF FOOD.\n\n\n"
        "Janamejaya said"
    )
    start = text.find(chapter_iv, body_start)
    if start < 0:
        start = text.find(
            "CHAPTER IV. A QUERY REGARDING THE ORIGIN OF THE ARTICLES OF FOOD",
            body_start,
        )
    if start < 0:
        raise ValueError("Could not locate Harivamsha chapter IV anchor")
    return text[start:].splitlines()


def parse_roman(raw: str) -> int | None:
    token = raw.upper().strip()
    token = re.sub(r"[^IVXLC]", "", token)
    if not token:
        return None

    values = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100}
    total = 0
    prev = 0
    for ch in reversed(token):
        val = values.get(ch, 0)
        if val < prev:
            total -= val
        else:
            total += val
        prev = val
    return total if total > 0 else None


def is_skip_line(line: str) -> bool:
    stripped = line.strip()
    if not stripped:
        return True
    if PAGE_RE.fullmatch(stripped):
        return True
    if stripped.startswith(SKIP_PREFIXES):
        return True
    if CHAPTER_RE.match(stripped):
        return True
    if TOC_DOTS_RE.search(stripped):
        return True
    if re.fullmatch(r"[A-Z0-9\s\.\,\;\:\-\(\)]+", stripped) and len(stripped) < 120:
        return True
    if re.match(r"^\d+\.\s+[A-Za-z^]+\s*[—\-]", stripped):
        return True
    return False


def is_english_line(line: str) -> bool:
    stripped = line.strip()
    if is_skip_line(stripped):
        return False
    if len(stripped) < 12:
        return False
    letters = sum(ch.isalpha() and ord(ch) < 128 for ch in stripped)
    if letters / max(len(stripped), 1) < 0.5:
        return False
    if re.search(r"[॥।\^%]{2,}", stripped):
        return False
    return bool(re.search(r"[A-Za-z]{3,}", stripped))


def normalize_paragraph(text: str) -> str:
    text = text.replace("\u2019", "'").replace("\u2018", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\s+(\d{1,3})\s*$", "", text)
    text = re.sub(r"\^\d*", "", text)
    return text


def parse_paragraphs(lines: list[str]) -> list[str]:
    paragraphs: list[str] = []
    buffer: list[str] = []

    def flush() -> None:
        if not buffer:
            return
        merged = normalize_paragraph(" ".join(buffer))
        if len(merged) >= 20 and is_english_line(merged):
            paragraphs.append(merged)
        buffer.clear()

    for raw in lines:
        line = raw.strip()
        if not line:
            flush()
            continue
        if CHAPTER_RE.match(line) or line.startswith("BHAVISHYA PARVA"):
            flush()
            continue
        if is_english_line(line):
            buffer.append(line)
        else:
            flush()
    flush()
    return paragraphs


def global_paragraph_slices(
    chapters: list[dict],
    paragraphs: list[str],
) -> dict[int, list[str]]:
    eligible = [chapter for chapter in chapters if chapter["number"] >= FIRST_CHAPTER]
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
    lines = load_body_lines()
    paragraphs = parse_paragraphs(lines)
    chapter_slices = global_paragraph_slices(scripture["chapters"], paragraphs)

    cache: dict[str, dict[str, str]] = {}
    stats: list[str] = []

    for chapter in scripture["chapters"]:
        number = chapter["number"]
        if number < FIRST_CHAPTER:
            continue

        verse_keys = [str(verse["number"]) for verse in chapter["verses"]]
        slice_paragraphs = chapter_slices.get(number, [])
        translations = map_sequential(slice_paragraphs, len(verse_keys))

        chapter_cache: dict[str, str] = {}
        for key, text in zip(verse_keys, translations, strict=True):
            cleaned = text.strip()
            if cleaned:
                chapter_cache[key] = cleaned
        cache[str(number)] = chapter_cache
        stats.append(
            f"chapter {number}: {len(chapter_cache)}/{len(verse_keys)} "
            f"(paragraphs {len(slice_paragraphs)})"
        )

    OUT_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(f"Source paragraphs: {len(paragraphs)}")
    empty = [int(k) for k, v in cache.items() if not v]
    if empty:
        print(f"Empty chapters: {empty}")
    for line in stats[:8]:
        print(f"  {line}")
    if len(stats) > 8:
        print(f"  ... {len(stats) - 8} more chapters")


if __name__ == "__main__":
    main()