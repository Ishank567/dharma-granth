"""Extract Hindi commentary for Vishnu Purana from Gita Press DJVU OCR.

Source: archive.org vishnu-puran-gita-press
  Vishnu Puran - Gita Press_djvu.txt

Hindi tika blocks are split by amsha (book 1–6) and mapped per-book in
seed-vishnupurana-hindi.ts (chapters 4–126 bulk; 1–3 curated).

Output: scripts/cache/vishnupurana-hindi.json

Run: python scripts/extract-vishnupurana-hindi.py
"""
from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IDENT = "vishnu-puran-gita-press"
DJVU_PATH = ROOT / "scripts/cache/vishnu-gita-press-djvu.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/vishnupurana.json"
OUT_PATH = ROOT / "scripts/cache/vishnupurana-hindi.json"

DEV = re.compile(r"[\u0900-\u097f]")
HINDI_MARKERS = re.compile(
    r"(?:है|होता|कर|से|के|की|का|को|में|इस|यह|वह|चाहिए|चाहिये|कहा|जाता|"
    r"नहीं|करना|हुआ|हुए|अर्थात्|क्योंकि|इसलिये|भगवान|विष्णु|पुराण|जगत्|"
    r"धर्म|ब्राह्मण|संसार|श्री|मुनि|देव)"
)
GARBAGE = re.compile(
    r"(?:अध्याय\s*[०-९\d]+|विष्णुपुराण\s*।|पहला\s+अध्याय|पृष्ठ|संख्या|"
    r"श्रीविष्णुपुराण|प्रथम\s+अंश|द्वितीय\s+अंश)"
)

AMSHA_PATTERNS: list[tuple[int, list[str]]] = [
    (1, [r"प्रथम\s+अंश", r"पहला\s+अंश"]),
    (2, [r"द्वितीय\s+अंश"]),
    (3, [r"तृतीय\s+अंश"]),
    (4, [r"चतुर्थ\s+अंश", r"अतुर्थ\s+अंश", r"चौथा\s+अंश"]),
    (5, [r"पंचम\s+अंश", r"पञ्चम\s+अंश", r"पञ्ञम\s+अंश"]),
    (6, [r"षष्ठ\s+अंश", r"षष्ठ\s*अंश", r"घषष्ठ\s+अंश"]),
]

ADHYAYA_HEADERS: dict[int, list[str]] = {
    1: [r"पहला\s+अध्याय"],
    2: [r"दूसरा\s+अध्याय"],
    3: [r"तीसरा\s+अध्याय"],
    4: [r"चौथा\s+अध्याय"],
    5: [r"[पप]ांचव[ााँ]?ं?\s+अध्याय", r"पाँचवाँ\s+अध्याय"],
    6: [r"छठा\s+अध्याय", r"छठवां\s+अध्याय"],
    7: [r"सातवां\s+अध्याय", r"सातवाँ\s+अध्याय"],
    8: [r"आठवां\s+अध्याय", r"आठवाँ\s+अध्याय"],
}

OCR_FIXES: tuple[tuple[str, str], ...] = (
    ("दै", "है"),
    (" हे ", " है "),
    ("क्योकि", "क्योंकि"),
    ("बरह्म", "ब्रह्म"),
    ("श्रीपपाशर", "श्रीपराशर"),
    ("श्रीपपराशर", "श्रीपराशर"),
    ("मेत्रेय", "मैत्रेय"),
)


def download_djvu() -> str:
    if DJVU_PATH.exists():
        text = DJVU_PATH.read_text(encoding="utf-8", errors="ignore")
        if sum(1 for c in text if "\u0900" <= c <= "\u097f") > 500000:
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
    fname = next(
        f["name"] for f in meta["files"] if "djvu.txt" in f.get("name", "")
    )
    url = f"https://archive.org/download/{IDENT}/{urllib.parse.quote(fname)}"
    print(f"Downloading {fname} …")
    data = urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}),
        timeout=300,
    ).read()
    DJVU_PATH.parent.mkdir(parents=True, exist_ok=True)
    DJVU_PATH.write_bytes(data)
    print(f"Cached {DJVU_PATH} ({len(data):,} bytes)")
    return data.decode("utf-8", errors="ignore")


def clean_line(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"[\^~`#@$%&*_\[\]{}<>|\\₹~]", "", text)
    text = text.replace("\u200c", "")
    for src, dst in OCR_FIXES:
        text = text.replace(src, dst)
    return text


def is_hindi_line(line: str) -> bool:
    if len(line) < 18:
        return False
    if len(DEV.findall(line)) / max(len(line), 1) < 0.58:
        return False
    if not HINDI_MARKERS.search(line):
        return False
    if len(re.findall(r"ः\s", line)) > 4:
        return False
    if len(re.findall(r"[क-ह]्", line)) > 3:
        return False
    if re.match(r"^(?:अन्वय|पदार्थ|मूलम्|श्लोक)", line):
        return False
    return True


def extract_blocks(section: str) -> list[str]:
    blocks: list[str] = []
    markers = list(re.finditer(r"॥\s*([\d०-९]+)\s*॥", section))

    for index, marker in enumerate(markers):
        end = (
            markers[index + 1].start()
            if index + 1 < len(markers)
            else marker.end() + 900
        )
        chunk = section[marker.end() : end]
        lines: list[str] = []
        for raw in chunk.splitlines():
            line = clean_line(raw)
            if is_hindi_line(line) and not GARBAGE.search(line):
                lines.append(line)
        if not lines:
            continue
        para = " ".join(lines[:4])
        if len(para) >= 28:
            blocks.append(para)

    deduped: list[str] = []
    for block in blocks:
        if deduped and block[:55] == deduped[-1][:55]:
            continue
        deduped.append(block)
    return deduped


def block_offset_before_adhyaya(section: str, adhyaya: int) -> int:
    """Skip commentary blocks belonging to earlier adhyayas in this amsha."""
    if adhyaya <= 1:
        return 0
    for pattern in ADHYAYA_HEADERS.get(adhyaya, []):
        match = re.search(pattern, section)
        if match:
            return len(extract_blocks(section[: match.start()]))
    return 0


def find_amsha_starts(text: str) -> dict[int, int]:
    """Locate amsha (book) boundaries via श्रीविष्णुपुराण + amsha + पहला अध्याय."""
    starts: dict[int, int] = {}
    header = re.compile(r"श्रीविष्ण[ु]?पुराण")

    for match in header.finditer(text):
        window = text[match.start() : match.start() + 300]
        if "पहला अध्याय" not in window and "पहले" not in window:
            continue
        for amsha, patterns in AMSHA_PATTERNS:
            if amsha in starts:
                continue
            for pattern in patterns:
                if re.search(pattern, window):
                    starts[amsha] = match.start()
                    break

    missing = [n for n in range(1, 7) if n not in starts]
    if missing:
        raise ValueError(f"Could not locate amsha starts for books: {missing}")
    return starts


def main() -> None:
    text = download_djvu()
    starts = find_amsha_starts(text)
    ordered = sorted(starts.items())

    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    book_verses: dict[int, int] = {}
    first_bulk_adhyaya: dict[int, int] = {}
    for chapter in scripture["chapters"]:
        book = int(chapter["title"].split()[1])
        adhyaya = int(chapter["title"].split()[-1])
        book_verses[book] = book_verses.get(book, 0) + len(chapter["verses"])
        if chapter["number"] >= 4:
            first_bulk_adhyaya.setdefault(book, adhyaya)

    books: dict[str, list[str]] = {}
    book_offsets: dict[str, int] = {}
    total_blocks = 0
    for index, (book, pos) in enumerate(ordered):
        end = ordered[index + 1][1] if index + 1 < len(ordered) else len(text)
        section = text[pos:end]
        blocks = extract_blocks(section)
        offset = block_offset_before_adhyaya(section, first_bulk_adhyaya.get(book, 1))
        books[str(book)] = blocks
        book_offsets[str(book)] = offset
        total_blocks += max(0, len(blocks) - offset)
        print(
            f"  book {book}: {len(blocks)} blocks, offset {offset} "
            f"(json: {book_verses.get(book, 0)} verses)"
        )

    payload = {
        "source": f"https://archive.org/details/{IDENT}",
        "license": "Gita Press Gorakhpur Hindi translation (public domain scan).",
        "seedChapterStart": 4,
        "verseCount": scripture["totalVerses"] - sum(
            len(ch["verses"])
            for ch in scripture["chapters"]
            if ch["number"] <= 3
        ),
        "blockCount": total_blocks,
        "bookOffsets": book_offsets,
        "books": books,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(
        f"  {total_blocks} Hindi blocks for "
        f"{payload['verseCount']} bulk verses (chapters 4–126)"
    )


if __name__ == "__main__":
    main()