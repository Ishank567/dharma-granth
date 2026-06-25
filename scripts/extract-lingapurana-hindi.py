"""Extract Hindi for Linga Purana from Gita Press condensed edition OCR.

Source: archive.org 18mahapuran
  Linga Mahapuran of Veda Vyas with Illustration - Gita Press_djvu.txt

पूर्वभाग only (GRETIL Book 1, chapters 4–108). उत्तरभाग excluded.
Mapped in seed-lingapurana-hindi.ts:
  main → GRETIL chapters 4–108

Output: scripts/cache/lingapurana-hindi.json

Run: python scripts/extract-lingapurana-hindi.py
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
DJVU_FNAME = "Linga Mahapuran of Veda Vyas with Illustration - Gita Press_djvu.txt"
CACHE_PATH = ROOT / "scripts/cache/lingapurana-hindi-djvu.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/lingapuran.json"
OUT_PATH = ROOT / "scripts/cache/lingapurana-hindi.json"

BULK_START_LINE = 1860
BULK_END_LINE = 54821

DEV = re.compile(r"[\u0900-\u097f]")
HINDI_MARKERS = re.compile(
    r"(?:है|होता|होते|कर|से|के|की|का|को|में|इस|यह|वह|चाहिए|चाहिये|कहा|जाता|"
    r"नहीं|करना|हुआ|हुए|अर्थात्|क्योंकि|इसलिये|भगवान|विष्णु|पुराण|लिङ्ग|लिंग|शिव|"
    r"धर्म|मुनि|देव|राजा|ब्रह्म|श्रवण|पाप|मोक्ष|ऋषि|यज्ञ|लोक|पार्वती|रुद्र)"
)
SKIP_LINE = re.compile(
    r"^(?:ऋषिः|देवता|छन्द|मन्त्र|विषय|अध्याय\s*विषय|॥|\d+\s*$|श्रीपरमात्मने|"
    r"श्रीगणेशाय|नमो भगवते|In Public Domain)",
    re.I,
)
PAGE_HEADER = re.compile(
    r"^\*?\s*लिङ्गपुराण|^\*?\s*लिंगपुराण|श्रीलिङ्गमहापुराण|^\d{1,4}\s+\*?$|"
    r"^\s*॥ [^०-९\d]|अध्याय\s*विषय|पृष्ठ-संख्या|^\* [^*]+ \*$|संक्षिप्त|"
    r"\[ पूर्वभाग|\[उत्तरभाग|लिङ्गपुराण\s*सम्पूर्ण|लिंगपुराण\s*सम्पूर्ण",
    re.I,
)
GARBAGE = re.compile(r"(?:खरीदें|गीताप्रेस|मुद्रण|ISBN|file:|कुल मुद्रण|भूमिका|Digitzed)")
VERSE_END = re.compile(
    r"[\u0964\u0965]\s*[\d\u0966-\u096f]+(?:\s*-\s*[\d\u0966-\u096f]+)?\s*[\u0964\u0965]?\s*$"
)

OCR_FIXES: tuple[tuple[str, str], ...] = (
    ("दै", "है"),
    (" हे ", " है "),
    ("क्योकि", "क्योंकि"),
    ("चाहिये", "चाहिए"),
    ("नुप", "नृप"),
    ("लिड़", "लिङ्ग"),
)


def download_djvu() -> str:
    if CACHE_PATH.exists():
        text = CACHE_PATH.read_text(encoding="utf-8", errors="ignore")
        if sum(1 for char in text if "\u0900" <= char <= "\u097f") > 500000:
            return text

    url = f"https://archive.org/download/{IDENT}/{urllib.parse.quote(DJVU_FNAME)}"
    print(f"  downloading {DJVU_FNAME} …")
    last_error: Exception | None = None
    for attempt in range(5):
        try:
            data = urllib.request.urlopen(
                urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}),
                timeout=300,
            ).read()
            CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
            CACHE_PATH.write_bytes(data)
            return data.decode("utf-8", errors="ignore")
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as err:
            last_error = err
            wait = 3 * (attempt + 1)
            print(f"    retry {attempt + 1}/5 after {wait}s ({err})")
            time.sleep(wait)
    raise RuntimeError(f"Failed to download {DJVU_FNAME}") from last_error


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
    text = download_djvu()
    main_section = text[
        line_offset(text, BULK_START_LINE) : line_offset(text, BULK_END_LINE)
    ]

    main_blocks = extract_blocks(main_section)

    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    bulk_verses = sum(len(ch["verses"]) for ch in scripture["chapters"] if ch["number"] > 3)

    print(
        f"  main: {len(main_blocks):5} blocks "
        f"(json ch4–108 purvabhag: {bulk_verses:5} verses)"
    )

    payload = {
        "source": f"https://archive.org/details/{IDENT}",
        "license": (
            "Gita Press Gorakhpur condensed Hindi Linga Purana (purvabhag) "
            "(public domain scan, archive.org OCR)."
        ),
        "seedChapterStart": 4,
        "mainVerses": bulk_verses,
        "main": main_blocks,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(f"  {len(main_blocks)} Hindi blocks for {bulk_verses} bulk verses")


if __name__ == "__main__":
    main()