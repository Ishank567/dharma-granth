"""Extract Hindi for Shiva Purana from Gita Press OCR (Ramnarayan Dutt Shastri).

Source: archive.org shiv-puran-hindi + shiv-puran-2
  शिवपुराण - खंड 1/2 (संस्कृत - हिंदी) - गीता प्रेस_djvu.txt

Samhitas 7–11 (khand 2) are mapped per chapter in seed-shivapurana-hindi.ts.
Chapters 1–6 are curated highlights only in published JSON.

Output: scripts/cache/shivapurana-hindi.json

Run: python scripts/extract-shivapurana-hindi.py
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
CACHE_DIR = ROOT / "scripts/cache/shivpurana-hindi-djvu"
JSON_PATH = ROOT / "public/data/scriptures-full/shivpurana.json"
OUT_PATH = ROOT / "scripts/cache/shivapurana-hindi.json"

KHAN_FILES: list[tuple[str, str]] = [
    ("shiv-puran-hindi", "शिवपुराण - खंड 1 (संस्कृत - हिंदी) - गीता प्रेस_djvu.txt"),
    ("shiv-puran-2", "शिवपुराण - खंड 2 (संस्कृत - हिंदी) - गीता प्रेस_djvu.txt"),
]

# First-adhyaya markers for samhitas 7–11 inside khand 2 (line numbers, 1-based).
KHAND2_SAMHITA_LINES: list[tuple[int, int]] = [
    (7, 963),
    (8, 19837),
    (9, 38864),
    (10, 60085),
    (11, 70376),
]

DEV = re.compile(r"[\u0900-\u097f]")
HINDI_MARKERS = re.compile(
    r"(?:है|होता|होते|कर|से|के|की|का|को|में|इस|यह|वह|चाहिए|चाहिये|कहा|जाता|"
    r"नहीं|करना|हुआ|हुए|अर्थात्|क्योंकि|इसलिये|शिव|भगवान|देव|धर्म|पार्वती|ब्रह्मा)"
)
SKIP_LINE = re.compile(r"^(?:ऋषिः|देवता|छन्द|मन्त्र|विषय|अध्याय\s*विषय|॥|\d+\s*$)", re.I)
GARBAGE = re.compile(r"(?:खरीदें|गीताप्रेस|मुद्रण|ISBN|file:)")
VERSE_END = re.compile(r"॥\s*[\d०-९]+(?:\s*-\s*[\d०-९]+)?\s*॥\s*$")

OCR_FIXES: tuple[tuple[str, str], ...] = (
    ("दै", "है"),
    (" हे ", " है "),
    ("क्योकि", "क्योंकि"),
    ("चाहिये", "चाहिए"),
    ("शंकर", "शंकर"),
)


def download_file(ident: str, fname: str) -> str:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^a-zA-Z0-9._-]+", "-", fname.replace("_djvu.txt", "")).strip("-").lower()
    path = CACHE_DIR / f"{slug}.txt"
    if path.exists():
        text = path.read_text(encoding="utf-8", errors="ignore")
        if sum(1 for char in text if "\u0900" <= char <= "\u097f") > 50000:
            return text

    url = f"https://archive.org/download/{ident}/{urllib.parse.quote(fname)}"
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
    if len(line) < 14:
        return False
    if len(DEV.findall(line)) / max(len(line), 1) < 0.5:
        return False
    if not HINDI_MARKERS.search(line):
        return False
    if SKIP_LINE.match(line):
        return False
    if GARBAGE.search(line):
        return False
    return True


def extract_blocks(section: str) -> list[str]:
    blocks: list[str] = []
    for raw in section.splitlines():
        line = clean_line(raw)
        if not VERSE_END.search(line):
            continue
        text = VERSE_END.sub("", line).strip()
        if len(text) < 8:
            continue
        if not is_hindi_line(text) and len(text) < 20:
            continue
        blocks.append(text)

    if blocks:
        return dedupe(blocks)

    current: list[str] = []
    for raw in section.splitlines():
        line = clean_line(raw)
        if is_hindi_line(line):
            current.append(line)
            continue
        if current:
            para = " ".join(current[:4])
            if len(para) >= 28:
                blocks.append(para)
            current = []
    if current:
        para = " ".join(current[:4])
        if len(para) >= 28:
            blocks.append(para)
    return dedupe(blocks)


def dedupe(blocks: list[str]) -> list[str]:
    out: list[str] = []
    for block in blocks:
        if out and block[:55] == out[-1][:55]:
            continue
        out.append(block)
    return out


def split_khand2(khand2: str) -> dict[int, str]:
    offsets = [(samhita, line_offset(khand2, line)) for samhita, line in KHAND2_SAMHITA_LINES]
    offsets.sort(key=lambda item: item[1])
    sections: dict[int, str] = {}
    for index, (samhita, pos) in enumerate(offsets):
        end = offsets[index + 1][1] if index + 1 < len(offsets) else len(khand2)
        sections[samhita] = khand2[pos:end]
    return sections


def main() -> None:
    khand1 = download_file(KHAN_FILES[0][0], KHAN_FILES[0][1])
    khand2 = download_file(KHAN_FILES[1][0], KHAN_FILES[1][1])
    sections = split_khand2(khand2)

    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    verse_counts = {ch["number"]: len(ch["verses"]) for ch in scripture["chapters"]}
    samhitas: dict[str, list[str]] = {}
    total_blocks = 0

    for samhita in range(1, 12):
        section = sections.get(samhita, "") if samhita >= 7 else ""
        if samhita < 7:
            # Khand 1 holds samhitas 1–6; only cached for reference — JSON is curated-only.
            if samhita == 1:
                section = khand1[line_offset(khand1, 2275) :]
        blocks = extract_blocks(section) if section else []
        samhitas[str(samhita)] = blocks
        total_blocks += len(blocks)
        print(
            f"  samhita {samhita:2}: {len(blocks):5} blocks "
            f"(json: {verse_counts.get(samhita, 0):5} verses)"
        )

    seed_from = 7
    seed_verses = sum(verse_counts.get(n, 0) for n in range(seed_from, 12))
    seed_blocks = sum(len(samhitas.get(str(n), [])) for n in range(seed_from, 12))

    payload = {
        "source": "https://archive.org/details/shiv-puran-hindi; https://archive.org/details/shiv-puran-2",
        "license": (
            "Pandit Ramnarayan Dutt Shastri Hindi vyakhya, Gita Press Gorakhpur "
            "(public domain scan, archive.org OCR)."
        ),
        "seedChapterStart": seed_from,
        "verseCount": seed_verses,
        "blockCount": seed_blocks,
        "samhitas": samhitas,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(f"  {seed_blocks} Hindi blocks for {seed_verses} bulk verses (samhitas {seed_from}–11)")


if __name__ == "__main__":
    main()