"""Extract Griffith Atharva Veda translations from the Global Grey PDF cache.

Maps each DharmicData mantra (sukta.mantra) to grouped Griffith stanzas
within the matching hymn. Output: scripts/cache/atharvaveda-translations.json

Prerequisite: scripts/cache/atharvaveda-griffith.pdf
  (https://www.globalgreyebooks.com/ebooks/ralph-t-h-griffith_hymns-of-the-atharva-veda.pdf)

Run: python scripts/extract-atharvaveda-griffith.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent.parent
PDF_PATH = ROOT / "scripts/cache/atharvaveda-griffith.pdf"
JSON_PATH = ROOT / "public/data/scriptures-full/atharvaveda.json"
OUT_PATH = ROOT / "scripts/cache/atharvaveda-translations.json"
FIRST_KANDA = 4

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
    "XCI": 91,
    "XCII": 92,
    "XCIII": 93,
    "XCIV": 94,
    "XCV": 95,
    "XCVI": 96,
    "XCVII": 97,
    "XCVIII": 98,
    "XCIX": 99,
    "C": 100,
    "CI": 101,
    "CII": 102,
    "CIII": 103,
    "CIV": 104,
    "CV": 105,
    "CVI": 106,
    "CVII": 107,
    "CVIII": 108,
    "CIX": 109,
    "CX": 110,
    "CXI": 111,
    "CXII": 112,
    "CXIII": 113,
    "CXIV": 114,
    "CXV": 115,
    "CXVI": 116,
    "CXVII": 117,
    "CXVIII": 118,
    "CXIX": 119,
    "CXX": 120,
    "CXXI": 121,
    "CXXII": 122,
    "CXXIII": 123,
    "CXXIV": 124,
    "CXXV": 125,
    "CXXVI": 126,
    "CXXVII": 127,
    "CXXVIII": 128,
    "CXXIX": 129,
    "CXXX": 130,
    "CXXXI": 131,
    "CXXXII": 132,
    "CXXXIII": 133,
    "CXXXIV": 134,
    "CXXXV": 135,
    "CXXXVI": 136,
    "CXXXVII": 137,
    "CXXXVIII": 138,
    "CXXXIX": 139,
    "CXL": 140,
    "CXLI": 141,
    "CXLII": 142,
    "CXLIII": 143,
    "CXLIV": 144,
    "CXLV": 145,
    "CXLVI": 146,
    "CXLVII": 147,
    "CXLVIII": 148,
    "CXLIX": 149,
    "CL": 150,
}

TITLE_PREFIXES = {
    "To the waters, for the prosperity of cattle",
    "To the waters, for strength and power",
    "To the waters, for health and wealth",
}


def roman(raw: str) -> int:
    return ROMAN.get(raw.strip().upper(), 0)


def load_pdf_text() -> str:
    if not PDF_PATH.exists():
        raise FileNotFoundError(
            f"Missing {PDF_PATH}. Download Griffith AV PDF from Global Grey first.",
        )
    text = ""
    with fitz.open(PDF_PATH) as doc:
        for page in doc:
            text += page.get_text() + "\n"
    start = re.search(r"Book I\s*\n\s*HYMN I\s*\n", text)
    if not start:
        raise RuntimeError("Could not locate Book I / HYMN I in Griffith PDF")
    return text[start.start() :]


def split_books(text: str) -> dict[int, str]:
    markers = [
        (match.start(), roman(match.group(1)))
        for match in re.finditer(r"(?:^|\n)Book ([IVXLC]+)\s*\n", text)
    ]
    books: dict[int, str] = {}
    for index, (pos, book_num) in enumerate(markers):
        end = markers[index + 1][0] if index + 1 < len(markers) else len(text)
        books[book_num] = text[pos:end]
    return books


def parse_hymn_stanzas(body: str) -> list[str]:
    lines: list[str] = []
    for line in body.split("\n"):
        stripped = line.strip()
        if not stripped:
            continue
        if re.fullmatch(r"Book [IVXLC]+", stripped):
            break
        if stripped.startswith("HYMN "):
            continue
        lines.append(stripped)

    while lines and (
        lines[0] in TITLE_PREFIXES
        or re.match(r"^[A-Z][^.]{0,100}\.$", lines[0])
        or re.match(r"^\d+$", lines[0])
    ):
        lines.pop(0)

    stanzas: list[str] = []
    buffer = ""
    for line in lines:
        if line.endswith("-"):
            buffer += line[:-1]
            continue
        chunk = f"{buffer} {line}".strip() if buffer else line
        buffer = ""
        if chunk and not chunk.startswith("It appears that hymns"):
            stanzas.append(re.sub(r"\s+", " ", chunk))
    if buffer:
        stanzas.append(re.sub(r"\s+", " ", buffer))
    return stanzas


def extract_hymns(book_text: str) -> list[list[str]]:
    content = re.sub(r"^Book [IVXLC]+\s*", "", book_text)
    chunks = re.split(r"HYMN ([IVXLC]+)\s*\n", content)
    hymns: list[list[str]] = []
    for index in range(1, len(chunks), 2):
        hymns.append(parse_hymn_stanzas(chunks[index + 1]))
    return hymns


def flatten_hymns(hymns: list[list[str]]) -> list[str]:
    flat: list[str] = []
    for hymn in hymns:
        flat.extend(hymn)
    return flat


def map_book_sequential(hymns: list[list[str]], verse_count: int) -> list[str]:
    """Map Griffith stanzas to JSON verses in order (robust across recension gaps)."""
    flat = flatten_hymns(hymns)
    if not flat:
        return [""] * verse_count

    mapped: list[str] = []
    cursor = 0
    for index in range(verse_count):
        remaining_verses = verse_count - index
        remaining_stanzas = len(flat) - cursor
        if remaining_stanzas <= 0:
            mapped.append(mapped[-1] if mapped else "")
            continue
        if remaining_verses <= 1:
            mapped.append(" ".join(flat[cursor:]))
            cursor = len(flat)
            continue
        take = max(1, round(remaining_stanzas / remaining_verses))
        chunk = flat[cursor : cursor + take]
        cursor += take
        mapped.append(" ".join(chunk))
    return mapped


def main() -> None:
    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    books = split_books(load_pdf_text())
    cache: dict[str, dict[str, str]] = {}
    stats: list[str] = []

    for chapter in scripture["chapters"]:
        kanda = chapter["number"]
        if kanda < FIRST_KANDA:
            continue
        if kanda not in books:
            stats.append(f"kanda {kanda}: missing Griffith book")
            continue

        hymns = extract_hymns(books[kanda])
        verse_keys = [str(verse["number"]) for verse in chapter["verses"]]
        translations = map_book_sequential(hymns, len(verse_keys))

        chapter_cache: dict[str, str] = {}
        empty = 0
        for key, text in zip(verse_keys, translations, strict=True):
            cleaned = text.strip()
            if cleaned:
                chapter_cache[key] = cleaned
            else:
                empty += 1
        cache[str(kanda)] = chapter_cache
        stats.append(
            f"kanda {kanda}: {len(chapter_cache)} translations, {empty} empty slots",
        )

    OUT_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    for line in stats:
        print(f"  {line}")


if __name__ == "__main__":
    main()