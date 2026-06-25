"""Extract Hindi for Brahmanda Purana from Gita Press OCR (Chaman Lal Gautam).

Source: archive.org 18mahapuran
  Brahamand Puran-1(hindi)_djvu.txt
  Brahamand Puran-2(hindi)_djvu.txt

Mapped in seed-brahmandapurana-hindi.ts:
  khand 1 → GRETIL chapters 4–38 (Book 1)
  khand 2 → GRETIL chapters 39–156 (Books 2–3)

Output: scripts/cache/brahmandapurana-hindi.json

Run: python scripts/extract-brahmandapurana-hindi.py
"""
from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IDENT = "18mahapuran"
CACHE_DIR = ROOT / "scripts/cache/brahmandapurana-hindi-djvu"
JSON_PATH = ROOT / "public/data/scriptures-full/brahmandpuran.json"
OUT_PATH = ROOT / "scripts/cache/brahmandapurana-hindi.json"

KHAN_FILES: list[tuple[str, str]] = [
    ("Brahamand Puran-1(hindi)_djvu.txt", "khand-1.txt"),
    ("Brahamand Puran-2(hindi)_djvu.txt", "khand-2.txt"),
]

KHAND1_START_LINE = 37
KHAND2_START_LINE = 184

DEV = re.compile(r"[\u0900-\u097f]")
HINDI_MARKERS = re.compile(
    r"(?:है|होता|होते|कर|से|के|की|का|को|में|इस|यह|वह|चाहिए|चाहिये|कहा|जाता|"
    r"नहीं|करना|हुआ|हुए|अर्थात्|क्योंकि|इसलिये|भगवान|विष्णु|पुराण|ब्रह्माण्ड|"
    r"धर्म|मुनि|देव|राजा|ब्रह्म|श्रवण|पाप|मोक्ष|ऋषि|यज्ञ|लोक)"
)
SKIP_LINE = re.compile(
    r"^(?:ऋषिः|देवता|छन्द|मन्त्र|विषय|अध्याय\s*विषय|॥|\d+\s*$|श्रीपरमात्मने|"
    r"श्रीगणेशाय|नमो भगवते|सम्पादक)",
    re.I,
)
PAGE_HEADER = re.compile(
    r"^\[.*ब्रह्माण्ड|कृत्य-समुद्देश्य|^\d{1,4}\s*\]|^\s*॥ [^०-९\d]",
    re.I,
)
GARBAGE = re.compile(r"(?:खरीदें|गीताप्रेस|मुद्रण|ISBN|file:|कुल मुद्रण|भूमिका)")
VERSE_END = re.compile(
    r"[\u0964\u0965]\s*[\d\u0966-\u096f]+(?:\s*-\s*[\d\u0966-\u096f]+)?\s*[\u0964\u0965]?\s*$"
)

OCR_FIXES: tuple[tuple[str, str], ...] = (
    ("दै", "है"),
    (" हे ", " है "),
    ("क्योकि", "क्योंकि"),
    ("चाहिये", "चाहिए"),
    ("बरह्माण्ड", "ब्रह्माण्ड"),
    ("नुप", "नृप"),
)


def download_file(fname: str, cache_name: str) -> str:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    path = CACHE_DIR / cache_name
    if path.exists():
        text = path.read_text(encoding="utf-8", errors="ignore")
        if sum(1 for char in text if "\u0900" <= char <= "\u097f") > 100000:
            return text

    url = f"https://archive.org/download/{IDENT}/{urllib.parse.quote(fname)}"
    print(f"  downloading {fname} …")
    last_error: Exception | None = None
    for attempt in range(5):
        try:
            data = urllib.request.urlopen(
                urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}),
                timeout=300,
            ).read()
            path.write_bytes(data)
            return data.decode("utf-8", errors="ignore")
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as err:
            last_error = err
            wait = 3 * (attempt + 1)
            print(f"    retry {attempt + 1}/5 after {wait}s ({err})")
            time.sleep(wait)
    raise RuntimeError(f"Failed to download {fname}") from last_error


def line_offset(text: str, line_number: int) -> int:
    if line_number <= 1:
        return 0
    offset = 0
    for index, line in enumerate(text.splitlines(keepends=True), start=1):
        if index >= line_number:
            break
        offset += len(line)
    return offset


def clean_line(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"[\^~`#@$%&*_\[\]{}<>|\\₹~]", "", text)
    text = text.replace("\u200c", "")
    for src, dst in OCR_FIXES:
        text = text.replace(src, dst)
    return text


def is_hindi_line(line: str) -> bool:
    if len(line) < 12:
        return False
    if len(DEV.findall(line)) / max(len(line), 1) < 0.48:
        return False
    if not HINDI_MARKERS.search(line):
        return False
    if SKIP_LINE.match(line):
        return False
    if PAGE_HEADER.search(line):
        return False
    if GARBAGE.search(line):
        return False
    if len(re.findall(r"ः\s", line)) > 4 and not VERSE_END.search(line):
        return False
    return True


def looks_like_sanskrit_verse(line: str) -> bool:
    if VERSE_END.search(line) and is_hindi_line(line):
        return False
    if len(re.findall(r"ः\s", line)) >= 2:
        return True
    if re.search(r"[।|]\s*$", line) and len(re.findall(r"ः\s", line)) >= 1:
        return True
    return False


def dedupe(blocks: list[str]) -> list[str]:
    out: list[str] = []
    for block in blocks:
        if out and block[:55] == out[-1][:55]:
            continue
        out.append(block)
    return out


def extract_blocks(section: str) -> list[str]:
    blocks: list[str] = []
    current: list[str] = []

    def flush() -> None:
        nonlocal current
        if not current:
            return
        merged = " ".join(current)
        if len(merged) >= 16:
            blocks.append(merged)
        current = []

    for raw in section.splitlines():
        line = clean_line(raw)
        if not line:
            flush()
            continue
        if PAGE_HEADER.search(line) or GARBAGE.search(line):
            flush()
            continue
        if looks_like_sanskrit_verse(line) and not is_hindi_line(line):
            flush()
            continue

        if VERSE_END.search(line):
            text = VERSE_END.sub("", line).strip()
            if text and (is_hindi_line(text) or current):
                current.append(text)
            flush()
            continue

        if is_hindi_line(line):
            current.append(line)
            if len(current) >= 4:
                flush()
            continue

        flush()

    flush()
    return dedupe(blocks)


def main() -> None:
    khand1 = download_file(KHAN_FILES[0][0], KHAN_FILES[0][1])
    khand2 = download_file(KHAN_FILES[1][0], KHAN_FILES[1][1])

    book1_section = khand1[line_offset(khand1, KHAND1_START_LINE) :]
    book23_section = khand2[line_offset(khand2, KHAND2_START_LINE) :]

    book1_blocks = extract_blocks(book1_section)
    book23_blocks = extract_blocks(book23_section)

    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    verse_counts = {ch["number"]: len(ch["verses"]) for ch in scripture["chapters"]}
    book1_verses = sum(verse_counts[n] for n in range(4, 39))
    book23_verses = sum(verse_counts[n] for n in range(39, 157))

    print(f"  book1:  {len(book1_blocks):5} blocks (json ch4–38: {book1_verses:5} verses)")
    print(f"  book23: {len(book23_blocks):5} blocks (json ch39–156: {book23_verses:5} verses)")

    payload = {
        "source": f"https://archive.org/details/{IDENT}",
        "license": (
            "Gita Press Gorakhpur Hindi Brahmanda Purana (Chaman Lal Gautam), "
            "public domain scan, archive.org OCR."
        ),
        "seedChapterStart": 4,
        "book1Verses": book1_verses,
        "book23Verses": book23_verses,
        "book1": book1_blocks,
        "book23": book23_blocks,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(
        f"  {len(book1_blocks) + len(book23_blocks)} Hindi blocks for "
        f"{book1_verses + book23_verses} bulk verses"
    )


if __name__ == "__main__":
    main()