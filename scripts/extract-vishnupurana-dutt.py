"""Extract Vishnu Purana English translations from M.N. Dutt OCR text.

Source: M.N. Dutt (1896), based on H.H. Wilson's translation (public domain).
Output: scripts/cache/vishnupurana-translations.json

Run: python scripts/extract-vishnupurana-dutt.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEXT_PATH = ROOT / "scripts/cache/vishnu-dutt.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/vishnupurana.json"
OUT_PATH = ROOT / "scripts/cache/vishnupurana-translations.json"
FIRST_CHAPTER = 4

ROMAN: dict[str, int] = {
    "I": 1,
    "II": 2,
    "III": 3,
    "IV": 4,
    "V": 5,
    "VI": 6,
    "VII": 7,
    "VIII": 8,
    "IX": 9,
    "X": 10,
    "XI": 11,
    "XII": 12,
    "XIII": 13,
    "XIV": 14,
    "XV": 15,
    "XVI": 16,
    "XVII": 17,
    "XVIII": 18,
    "XIX": 19,
    "XX": 20,
    "XXI": 21,
    "XXII": 22,
    "XXIII": 23,
    "XXIV": 24,
    "XXV": 25,
    "XXVI": 26,
    "XXVII": 27,
    "XXVIII": 28,
    "XXIX": 29,
    "XXX": 30,
    "XXXI": 31,
    "XXXII": 32,
    "XXXIII": 33,
    "XXXIV": 34,
    "XXXV": 35,
    "XXXVI": 36,
    "XXXVII": 37,
    "XXXVIII": 38,
}

BOOK_OFFSETS = {1: 0, 2: 22, 3: 38, 4: 56, 5: 80, 6: 118}

PART_RE = re.compile(r"^(?:PA?RT|PAET)\s+([IVXLC]+)", re.I)
END_PART_RE = re.compile(r"END.*PART\s+([IVXLCJ]+)", re.I)
SEC_RE = re.compile(r"^(?:SECTION|SECTIOK|SECTTON|SECTIONL)\s*([IVXLC]+)", re.I)
PAGE_RE = re.compile(r"^\d{1,3}$")
SKIP_PREFIXES = (
    "VISHNUPURANAM",
    "VISHNU PURANA",
    "CONTENTS",
    "PREFACE",
    "P R E F",
    "Digitized",
)

OCR_ROMAN_FIXES = (
    ("ZXVIIL", "XXVIII"),
    ("XXIIÍ", "XXIII"),
    ("XXIIÍ", "XXIII"),
    ("VIIL", "VIII"),
    ("VIir", "VII"),
    ("xm", "XIII"),
    ("xni", "XIII"),
    ("ir", "II"),
    ("nr", "III"),
    ("U", "II"),
    ("J", "I"),
)


def load_body_lines() -> list[str]:
    if not TEXT_PATH.exists():
        raise FileNotFoundError(f"Missing {TEXT_PATH}")
    text = TEXT_PATH.read_text(encoding="utf-8", errors="ignore")
    start = text.find("PAET I.")
    if start < 0:
        start = text.find("PART I.")
    if start < 0:
        raise ValueError("Could not locate Vishnu Purana translation body")
    return text[start:].splitlines()


def parse_roman(raw: str) -> int | None:
    token = raw.upper().strip()
    for src, dst in OCR_ROMAN_FIXES:
        token = token.replace(src.upper(), dst)
    token = re.sub(r"[^IVXLC]", "", token)
    if not token:
        return None
    return ROMAN.get(token)


def is_english_line(line: str) -> bool:
    stripped = line.strip()
    if len(stripped) < 12:
        return False
    if PAGE_RE.fullmatch(stripped):
        return False
    if stripped.startswith(SKIP_PREFIXES):
        return False
    if PART_RE.match(stripped) or SEC_RE.match(stripped) or END_PART_RE.search(stripped):
        return False
    if re.match(r"^\d+\.\s", stripped):
        return False
    letters = sum(ch.isalpha() and ord(ch) < 128 for ch in stripped)
    if letters / max(len(stripped), 1) < 0.5:
        return False
    if re.search(r"[॥।\^%]{2,}", stripped):
        return False
    return bool(re.search(r"[A-Za-z]{3,}", stripped))


def normalize_paragraph(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\s+(\d{1,3})\s*$", "", text)
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
        if PART_RE.match(line) or SEC_RE.match(line) or END_PART_RE.search(line):
            flush()
            continue
        if is_english_line(line):
            buffer.append(line)
        else:
            flush()
    flush()
    return paragraphs


def detect_chapter_starts(lines: list[str]) -> dict[int, int]:
    """Return flat chapter number -> first line index."""
    starts: dict[int, int] = {}
    current_part = 1
    last_section = 0

    for index, raw in enumerate(lines):
        line = raw.strip()
        if not line:
            continue

        part_match = PART_RE.match(line)
        if part_match:
            part = parse_roman(part_match.group(1))
            if part:
                current_part = part
                last_section = 0
            continue

        end_match = END_PART_RE.search(line)
        if end_match:
            ended = parse_roman(end_match.group(1))
            if ended:
                current_part = min(ended + 1, 6)
                last_section = 0
            continue

        sec_match = SEC_RE.match(line)
        if not sec_match:
            continue

        section = parse_roman(sec_match.group(1))
        if not section:
            continue

        if section < last_section and section <= 4:
            current_part = min(current_part + 1, 6)

        flat = BOOK_OFFSETS[current_part] + section
        if 1 <= flat <= 126 and flat not in starts:
            starts[flat] = index
        last_section = section

    return starts


def fill_missing_boundaries(
    starts: dict[int, int],
    verse_counts: dict[int, int],
    total_lines: int,
) -> dict[int, tuple[int, int]]:
    """Assign line ranges to all chapters, splitting gaps by verse weight."""
    if not starts:
        return {}

    ranges: dict[int, tuple[int, int]] = {}
    anchors = sorted(starts.items())
    anchor_chapters = [chapter for chapter, _ in anchors]
    anchor_lines = [line for _, line in anchors]

    for idx, (chapter, start_line) in enumerate(anchors):
        end_line = anchor_lines[idx + 1] if idx + 1 < len(anchor_lines) else total_lines
        group = list(range(chapter, anchor_chapters[idx + 1] if idx + 1 < len(anchors) else 127))
        span = max(end_line - start_line, len(group))
        weights = [max(verse_counts.get(num, 1), 1) for num in group]
        total_weight = sum(weights)
        cursor = start_line

        for pos, group_ch in enumerate(group):
            if pos == len(group) - 1:
                boundary = end_line
            else:
                share = max(1, round(span * weights[pos] / total_weight))
                remaining = len(group) - pos - 1
                boundary = min(cursor + share, end_line - remaining)
            ranges[group_ch] = (cursor, max(boundary, cursor + 1))
            cursor = ranges[group_ch][1]

    return ranges


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


def global_paragraph_slices(
    chapters: list[dict],
    paragraphs: list[str],
) -> dict[int, list[str]]:
    """Fallback: distribute all paragraphs across chapters by verse weight."""
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


def main() -> None:
    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    lines = load_body_lines()
    starts = detect_chapter_starts(lines)

    verse_counts = {
        chapter["number"]: len(chapter["verses"]) for chapter in scripture["chapters"]
    }
    ranges = fill_missing_boundaries(starts, verse_counts, len(lines))
    global_paragraphs = parse_paragraphs(lines)
    global_slices = global_paragraph_slices(scripture["chapters"], global_paragraphs)

    cache: dict[str, dict[str, str]] = {}
    stats: list[str] = []

    for chapter in scripture["chapters"]:
        number = chapter["number"]
        if number < FIRST_CHAPTER:
            continue

        bounds = ranges.get(number)
        paragraphs: list[str] = []
        source = "bounds"

        if bounds:
            start_line, end_line = bounds
            paragraphs = parse_paragraphs(lines[start_line:end_line])

        if not paragraphs:
            paragraphs = global_slices.get(number, [])
            source = "global"

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
            f"(paragraphs {len(paragraphs)}, {source})"
        )

    OUT_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(f"Detected chapter headers: {len(starts)}/126")
    missing = [n for n in range(FIRST_CHAPTER, 127) if not cache.get(str(n))]
    if missing:
        print(f"Chapters without cache: {missing}")
    for line in stats[:8]:
        print(f"  {line}")
    if len(stats) > 8:
        print(f"  ... {len(stats) - 8} more chapters")


if __name__ == "__main__":
    main()