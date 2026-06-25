"""Extract Hindi for Narada Purana from Gita Press condensed edition OCR.

Source: archive.org narada-puran-gita-press
  Narada Puran - Gita Press_djvu.txt

संक्षिप्त हिंदी-only edition split into पूर्वभाग (4 पाद) and उत्तरभाग.
Mapped globally to GRETIL chapters 7–124 (purva) and 125–167 (uttara) in
seed-naradapurana-hindi.ts.

Output: scripts/cache/naradapurana-hindi.json

Run: python scripts/extract-naradapurana-hindi.py
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
IDENT = "narada-puran-gita-press"
CACHE_PATH = ROOT / "scripts/cache/naradapurana-hindi-djvu.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/naradapuran.json"
OUT_PATH = ROOT / "scripts/cache/naradapurana-hindi.json"

# 1-based line boundaries inside the DJVU (content body, after TOC).
PURVA_START_LINE = 1333
UTTARA_START_LINE = 46257

DEV = re.compile(r"[\u0900-\u097f]")
HINDI_MARKERS = re.compile(
    r"(?:है|होता|होते|कर|से|के|की|का|को|में|इस|यह|वह|चाहिए|चाहिये|कहा|जाता|"
    r"नहीं|करना|हुआ|हुए|अर्थात्|क्योंकि|इसलिये|भगवान|विष्णु|पुराण|नारद|धर्म|"
    r"मुनि|देव|राजा|ब्रह्म|श्रवण|पाप|मोक्ष|भक्ति)"
)
SKIP_LINE = re.compile(
    r"^(?:ऋषिः|देवता|छन्द|मन्त्र|विषय|अध्याय\s*विषय|॥|\d+\s*$|श्रीपरमात्मने|"
    r"श्रीगणेशाय|नमो भगवते)",
    re.I,
)
PAGE_HEADER = re.compile(
    r"^\*?\s*पूर्वभाग|^\*?\s*उत्तरभाग|पूर्वभाग\s*समाप्त|उत्तर\s*भाग\s*समाप्त|"
    r"^\d{1,4}\s*$",
    re.I,
)
GARBAGE = re.compile(r"(?:खरीदें|गीताप्रेस|मुद्रण|ISBN|file:|कुल मुद्रण)")
VERSE_END = re.compile(r"॥\s*[\d०-९]+(?:\s*-\s*[\d०-९]+)?\s*॥\s*$")
SANSKRIT_HEAVY = re.compile(r"[ः॰।]{2,}|\.{3,}")

OCR_FIXES: tuple[tuple[str, str], ...] = (
    ("दै", "है"),
    (" हे ", " है "),
    ("क्योकि", "क्योंकि"),
    ("चाहिये", "चाहिए"),
    ("नस्प्रेष्ठ", "नरश्रेष्ठ"),
)


def download_djvu() -> str:
    if CACHE_PATH.exists():
        text = CACHE_PATH.read_text(encoding="utf-8", errors="ignore")
        if sum(1 for char in text if "\u0900" <= char <= "\u097f") > 200000:
            return text

    meta = json.loads(
        urllib.request.urlopen(
            urllib.request.Request(
                f"https://archive.org/metadata/{IDENT}",
                headers={"User-Agent": "Mozilla/5.0"},
            ),
            timeout=30,
        ).read(),
    )
    fname = next(f["name"] for f in meta["files"] if f.get("name", "").endswith("_djvu.txt"))
    url = f"https://archive.org/download/{IDENT}/{urllib.parse.quote(fname)}"
    print(f"  downloading {fname} …")
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
    if len(line) < 14:
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
    if len(re.findall(r"ः\s", line)) > 4:
        return False
    if SANSKRIT_HEAVY.search(line) and len(line) < 40:
        return False
    return True


def looks_like_sanskrit_verse(line: str) -> bool:
    if not VERSE_END.search(line):
        return False
    return len(re.findall(r"ः\s", line)) >= 1 or "|" in line or "।" in line


def dedupe(blocks: list[str]) -> list[str]:
    out: list[str] = []
    for block in blocks:
        if out and block[:55] == out[-1][:55]:
            continue
        out.append(block)
    return out


def extract_blocks(section: str) -> list[str]:
    blocks: list[str] = []
    lines = section.splitlines()
    index = 0

    while index < len(lines):
        line = clean_line(lines[index])
        index += 1

        if not line or PAGE_HEADER.search(line) or GARBAGE.search(line):
            continue

        if looks_like_sanskrit_verse(line) or VERSE_END.search(line):
            hindi_lines: list[str] = []
            while index < len(lines):
                nxt = clean_line(lines[index])
                if not nxt:
                    if hindi_lines:
                        break
                    index += 1
                    continue
                if looks_like_sanskrit_verse(nxt) or PAGE_HEADER.search(nxt):
                    break
                if is_hindi_line(nxt):
                    hindi_lines.append(nxt)
                    index += 1
                    continue
                if hindi_lines:
                    break
                index += 1
            if hindi_lines:
                blocks.append(" ".join(hindi_lines[:6]))
            continue

        if is_hindi_line(line):
            para = [line]
            while index < len(lines):
                nxt = clean_line(lines[index])
                if not nxt or not is_hindi_line(nxt):
                    break
                para.append(nxt)
                index += 1
                if len(para) >= 4:
                    break
            merged = " ".join(para)
            if len(merged) >= 28:
                blocks.append(merged)

    return dedupe(blocks)


def main() -> None:
    text = download_djvu()
    purva = text[line_offset(text, PURVA_START_LINE) : line_offset(text, UTTARA_START_LINE)]
    uttara = text[line_offset(text, UTTARA_START_LINE) :]

    purva_blocks = extract_blocks(purva)
    uttara_blocks = extract_blocks(uttara)

    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    verse_counts = {ch["number"]: len(ch["verses"]) for ch in scripture["chapters"]}
    purva_verses = sum(verse_counts[n] for n in range(7, 125))
    uttara_verses = sum(verse_counts[n] for n in range(125, 168))

    print(f"  purva:  {len(purva_blocks):5} blocks (json ch7–124: {purva_verses:5} verses)")
    print(f"  uttara: {len(uttara_blocks):5} blocks (json ch125–167: {uttara_verses:5} verses)")

    payload = {
        "source": f"https://archive.org/details/{IDENT}",
        "license": (
            "Gita Press Gorakhpur condensed Hindi Narada Purana "
            "(public domain scan, archive.org OCR)."
        ),
        "seedChapterStart": 7,
        "purvaVerses": purva_verses,
        "uttaraVerses": uttara_verses,
        "purva": purva_blocks,
        "uttara": uttara_blocks,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(
        f"  {len(purva_blocks) + len(uttara_blocks)} Hindi blocks for "
        f"{purva_verses + uttara_verses} bulk verses"
    )


if __name__ == "__main__":
    main()