"""Extract Mahabharata English from Kisari Mohan Ganguli (sacred-texts / archive.org).

Source: archive.org combined DJVU OCR text
  TheMahabharataOfKrishna-dwaipayanaVyasa/MahabharataOfVyasa-EnglishTranslationByKMGanguli_djvu.txt

Parvas 1-7 keep curated highlights; seed parvas 8-18 (Karna through Svargarohana).
Ganguli section N maps to DharmicData internal chapter N within each parva.
Prose paragraphs are mapped to verses via sequential block slicing + global-stream fallback.

Output: scripts/cache/mahabharata-translations.json

Run: python scripts/extract-mahabharata-ganguli.py
"""
from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DJVU_URL = (
    "https://archive.org/download/TheMahabharataOfKrishna-dwaipayanaVyasa/"
    "MahabharataOfVyasa-EnglishTranslationByKMGanguli_djvu.txt"
)
DJVU_PATH = ROOT / "scripts/cache/mahabharata-ganguli-djvu.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/mahabharata.json"
OUT_PATH = ROOT / "scripts/cache/mahabharata-translations.json"
FIRST_PARVA = 8
LAST_PARVA = 18

# OCR file markers per book (sacred-texts paths embedded in DJVU text).
BOOK_MARKERS: dict[int, list[str]] = {
    8: [r"m08(\d{3})\.htm"],
    9: [r"m09(\d{3})\.htm"],
    10: [r"ml0(\d{3})\.htm"],
    11: [r"mll(\d{3})\.htm"],
    12: [r"ml2a(\d{3})\.htm", r"ml2b(\d{3})\.htm", r"ml2c(\d{3})\.htm"],
    13: [r"ml3a(\d{3})\.htm", r"ml3b(\d{3})\.htm"],
    14: [r"ml4(\d{3})\.htm"],
    15: [r"ml5(\d{3})\.htm"],
    16: [r"ml6(\d{3})\.htm"],
    17: [r"ml7(\d{3})\.htm"],
    18: [r"ml8(\d{3})\.htm"],
}

NOISE_RE = re.compile(
    r"^(?:Table of Contents|Index|Previous|Next|file:///|"
    r"The Mahabharata|BOOK \d+|Om!|OM!|NOTICE OF ATTRIBUTION|"
    r"Translated into English|Scanned and Proofed|"
    r"Kisari Mohan Ganguli|\[1883-1896\]|"
    r"Sacred Texts|Hinduism|Mahabharata|Title Page|"
    r"\(\d+ of \d+\)\d|Next: Section|"
    r"Section [IVXLC]+ ?$)",
    re.I,
)
PAGE_RE = re.compile(r"^\d{1,3}$")
ROMAN_SECTION_RE = re.compile(r"^SECTION [IVXLC]+", re.I)
FOOTNOTE_RE = re.compile(r"^\d{1,3}:\d{1,3}\s", re.I)

OCR_FIXES: tuple[tuple[str, str], ...] = (
    ("Oml ", "Om! "),
    ("Oml!", "Om!"),
    ("J ay a", "Jaya"),
    ("Saras vati", "Sarasvati"),
    ("Kama Parva", "Karna Parva"),
    ("Kama-parva", "Karna-parva"),
    ("Kama parva", "Karna parva"),
    ("Suyodhana", "Duryodhana"),
    ("Duhshasana", "Dushasana"),
    (" file:///CI/", " "),
)


def download_djvu() -> str:
    if DJVU_PATH.exists():
        return DJVU_PATH.read_text(encoding="utf-8", errors="ignore")
    DJVU_PATH.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading {DJVU_URL} …")
    req = urllib.request.Request(DJVU_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=180) as response:
        data = response.read()
    DJVU_PATH.write_bytes(data)
    print(f"Cached {DJVU_PATH} ({len(data):,} bytes)")
    return data.decode("utf-8", errors="ignore")


def normalize_paragraph(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\s+(\d{1,3})\s*$", "", text)
    for src, dst in OCR_FIXES:
        text = text.replace(src, dst)
    return text


def clean_translation(text: str) -> str:
    cleaned = normalize_paragraph(text)
    if FOOTNOTE_RE.match(cleaned):
        return ""
    if re.match(r"^i\.e\.,", cleaned, re.I):
        return ""
    return cleaned


def is_prose_line(line: str) -> bool:
    stripped = line.strip()
    if len(stripped) < 15:
        return False
    if PAGE_RE.fullmatch(stripped):
        return False
    if NOISE_RE.match(stripped):
        return False
    if ROMAN_SECTION_RE.match(stripped):
        return False
    if stripped.startswith("file:///"):
        return False
    if FOOTNOTE_RE.match(stripped):
        return False
    if re.match(r"^i\.e\.,", stripped, re.I):
        return False
    letters = sum(ch.isalpha() and ord(ch) < 128 for ch in stripped)
    if letters / max(len(stripped), 1) < 0.5:
        return False
    return bool(re.search(r"[A-Za-z]{4,}", stripped))


def parse_section_blocks(body: str) -> list[str]:
    blocks: list[str] = []
    buffer: list[str] = []

    def flush() -> None:
        if not buffer:
            return
        merged = normalize_paragraph(" ".join(buffer))
        if len(merged) >= 25 and is_prose_line(merged):
            blocks.append(merged)
        buffer.clear()

    for raw in body.splitlines():
        line = raw.strip()
        if not line:
            flush()
            continue
        if NOISE_RE.match(line) or line.startswith("file:///"):
            flush()
            continue
        if is_prose_line(line):
            buffer.append(line)
        else:
            flush()
    flush()
    return blocks


def extract_book_sections(data: str, book: int) -> dict[int, list[str]]:
    patterns = BOOK_MARKERS.get(book, [])
    if not patterns:
        return {}

    markers: list[tuple[int, int]] = []
    for pattern in patterns:
        for match in re.finditer(pattern, data, re.I):
            markers.append((match.start(), int(match.group(1))))

    if not markers:
        return {}

    markers.sort(key=lambda item: item[0])
    ordered_bodies: list[str] = []
    for index, (pos, _sec_num) in enumerate(markers):
        end = markers[index + 1][0] if index + 1 < len(markers) else len(data)
        ordered_bodies.append(data[pos:end])

    sections: dict[int, list[str]] = {}
    section_no = 0
    for body in ordered_bodies:
        blocks = parse_section_blocks(body)
        if not blocks:
            continue
        section_no += 1
        sections[section_no] = blocks
    return sections


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


def group_verses_by_subchapter(verses: list[dict]) -> list[tuple[str, list[str]]]:
    groups: list[tuple[str, list[str]]] = []
    current_sub = ""
    current_keys: list[str] = []

    for verse in verses:
        raw = str(verse["number"])
        sub = raw.split(".", 1)[0] if "." in raw else raw
        if sub != current_sub:
            if current_keys:
                groups.append((current_sub, current_keys))
            current_sub = sub
            current_keys = [raw]
        else:
            current_keys.append(raw)

    if current_keys:
        groups.append((current_sub, current_keys))
    return groups


def build_global_stream(sections: dict[int, list[str]]) -> list[str]:
    stream: list[str] = []
    for section_no in sorted(sections.keys()):
        stream.extend(sections[section_no])
    return stream


def global_block_slices(
    subchapter_groups: list[tuple[str, list[str]]],
    stream: list[str],
) -> dict[str, list[str]]:
    total_verses = sum(len(keys) for _, keys in subchapter_groups)
    slices: dict[str, list[str]] = {}
    cursor = 0
    verses_done = 0

    for index, (sub, keys) in enumerate(subchapter_groups):
        verse_count = len(keys)
        verses_done += verse_count
        remaining_verses = total_verses - verses_done + verse_count
        remaining_blocks = len(stream) - cursor

        if index == len(subchapter_groups) - 1:
            chunk = stream[cursor:]
        else:
            take = max(1, round(remaining_blocks * verse_count / remaining_verses))
            chunk = stream[cursor : cursor + take]
            cursor += take

        slices[sub] = chunk

    return slices


def process_parva(parva: dict, sections: dict[int, list[str]]) -> dict[str, str]:
    subchapter_groups = group_verses_by_subchapter(parva["verses"])
    global_stream = build_global_stream(sections)
    global_slices = global_block_slices(subchapter_groups, global_stream)

    cache: dict[str, str] = {}
    for sub, verse_keys in subchapter_groups:
        sub_num = int(sub) if sub.isdigit() else 0
        blocks = sections.get(sub_num, [])
        source = "section"
        if not blocks:
            blocks = global_slices.get(sub, [])
            source = "global"

        translations = map_sequential(blocks, len(verse_keys))
        for key, text in zip(verse_keys, translations, strict=True):
            cleaned = clean_translation(text)
            if cleaned:
                cache[key] = cleaned

    return cache


def main() -> None:
    data = download_djvu()
    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    cache: dict[str, dict[str, str]] = {}
    stats: list[str] = []

    for parva in scripture["chapters"]:
        number = parva["number"]
        if number < FIRST_PARVA or number > LAST_PARVA:
            continue

        sections = extract_book_sections(data, number)
        parva_cache = process_parva(parva, sections)
        cache[str(number)] = parva_cache

        total = len(parva["verses"])
        filled = len(parva_cache)
        stats.append(
            f"parva {number}: {filled}/{total} verses "
            f"({len(sections)} Ganguli sections)",
        )

    OUT_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    for line in stats:
        print(f"  {line}")
    p8 = cache.get("8", {})
    print(f"  parva 8 [1.1]: {p8.get('1.1', '')[:140]}")


if __name__ == "__main__":
    main()