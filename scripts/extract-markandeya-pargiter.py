"""Extract Pargiter Markandeya Purana translations from archive.org OCR.

Source: F. Eden Pargiter (1904), Asiatic Society of Bengal
Output: scripts/cache/markandeypuran-translations.json

Run: python scripts/extract-markandeya-pargiter.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEXT_PATH = ROOT / "scripts/cache/markandeya-pargiter.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/markandeypuran.json"
OUT_PATH = ROOT / "scripts/cache/markandeypuran-translations.json"
FIRST_CHAPTER = 4

ROMAN: dict[str, int] = {
    "I": 1,
    "T": 1,
    "r": 1,
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
    "XXXIX": 39,
    "XL": 40,
    "XLI": 41,
    "XLII": 42,
    "XLIII": 43,
    "XLIV": 44,
    "XLV": 45,
    "XLVI": 46,
    "XLVII": 47,
    "XLVIII": 48,
    "XLIX": 49,
    "L": 50,
    "LI": 51,
    "LII": 52,
    "LIII": 53,
    "LIV": 54,
    "LV": 55,
    "LVI": 56,
    "LVII": 57,
    "LVIII": 58,
    "LIX": 59,
    "LX": 60,
    "LXI": 61,
    "LXII": 62,
    "LXIII": 63,
    "LXIV": 64,
    "LXV": 65,
    "LXVI": 66,
    "LXVII": 67,
    "LXVIII": 68,
    "LXIX": 69,
    "LXX": 70,
    "LXXI": 71,
    "LXXII": 72,
    "LXXIII": 73,
    "LXXIV": 74,
    "LXXV": 75,
    "LXXVI": 76,
    "LXXVII": 77,
    "LXXVIII": 78,
    "LXXIX": 79,
    "LXXX": 80,
    "LXXXI": 81,
    "LXXXII": 82,
    "LXXXIII": 83,
    "LXXXIV": 84,
    "LXXXV": 85,
    "LXXXVI": 86,
    "LXXXVII": 87,
    "LXXXVIII": 88,
    "LXXXIX": 89,
    "XC": 90,
}

CANTO_RE = re.compile(r"\nCANTO\s+([IVXLC]+|T|r)\.?\s*\n", re.I)
VERSE_START_RE = re.compile(r"^\s*(\d{1,3})\s+(.+)")
SKIP_LINE_RE = re.compile(
    r"^(THE |Markandeya spoke|Jaimini spoke|Or |\*|Canto|Page|\^)",
    re.I,
)


def roman(raw: str) -> int:
    return ROMAN.get(raw.strip().upper().replace(".", ""), 0)


def load_body() -> str:
    if not TEXT_PATH.exists():
        raise FileNotFoundError(f"Missing {TEXT_PATH}")
    text = TEXT_PATH.read_text(encoding="utf-8", errors="ignore")
    anchor = "1 The illustrious Jaimini"
    start = text.find(anchor)
    if start < 0:
        raise RuntimeError("Could not locate Canto I translation in Pargiter text")
    start = text.rfind("\nCANTO", 0, start)
    return text[start:]


def clean_text(text: str) -> str:
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    return text.strip()


def parse_canto(chunk: str) -> dict[int, str]:
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
        if re.fullmatch(r"\d{1,3}", stripped):
            continue
        if SKIP_LINE_RE.match(stripped):
            continue

        match = VERSE_START_RE.match(line)
        if match:
            flush()
            current = int(match.group(1))
            buffer = [match.group(2).strip()]
            continue

        if current:
            buffer.append(stripped)

    flush()
    return verses


def split_cantos(text: str) -> dict[int, str]:
    markers = [(match.start(), match.group(1)) for match in CANTO_RE.finditer(text)]

    # Keep canto sections that actually open with verse 1 (skip page-header repeats).
    significant: list[tuple[int, str]] = []
    for index, (pos, _label) in enumerate(markers):
        end = markers[index + 1][0] if index + 1 < len(markers) else len(text)
        chunk = text[pos:end]
        if 1 in parse_canto(chunk):
            significant.append((pos, chunk))

    # Map the first 90 significant cantos sequentially to adhyāyas 1–90.
    merged: dict[int, str] = {}
    for chapter_num, (_pos, chunk) in enumerate(significant[:90], start=1):
        merged[chapter_num] = chunk
    return merged


def map_sequential(paragraphs: list[str], count: int) -> list[str]:
    if count <= 0:
        return []
    if not paragraphs:
        return [""] * count
    if len(paragraphs) == count:
        return paragraphs
    mapped: list[str] = []
    cursor = 0
    for index in range(count):
        remaining = count - index
        left = len(paragraphs) - cursor
        if left <= 0:
            mapped.append(mapped[-1] if mapped else "")
            continue
        if remaining == 1:
            mapped.append(" ".join(paragraphs[cursor:]))
            break
        take = max(1, round(left / remaining))
        mapped.append(" ".join(paragraphs[cursor : cursor + take]))
        cursor += take
    while len(mapped) < count:
        mapped.append(mapped[-1] if mapped else "")
    return mapped[:count]


def main() -> None:
    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    cantos = split_cantos(load_body())
    cache: dict[str, dict[str, str]] = {}
    stats: list[str] = []

    for chapter in scripture["chapters"]:
        number = chapter["number"]
        if number < FIRST_CHAPTER:
            continue
        body = cantos.get(number, "")
        parsed = parse_canto(body)
        verse_keys = [str(verse["number"]) for verse in chapter["verses"]]

        chapter_cache: dict[str, str] = {}
        missing_keys: list[str] = []
        for verse in chapter["verses"]:
            key = str(verse["number"])
            text = parsed.get(int(key)) if str(key).isdigit() else None
            if text:
                chapter_cache[key] = text
            else:
                missing_keys.append(key)

        if missing_keys and parsed:
            ordered_nums = sorted(parsed)
            fallback = [parsed[n] for n in ordered_nums]
            fallback_map = map_sequential(fallback, len(verse_keys))
            for key, text in zip(verse_keys, fallback_map, strict=True):
                if key not in chapter_cache and text.strip():
                    chapter_cache[key] = text.strip()

        cache[str(number)] = chapter_cache
        stats.append(
            f"chapter {number}: {len(chapter_cache)}/{len(verse_keys)} "
            f"(parsed {len(parsed)})",
        )

    OUT_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    for line in stats[:12]:
        print(f"  {line}")
    if len(stats) > 12:
        print(f"  ... {len(stats) - 12} more chapters")


if __name__ == "__main__":
    main()