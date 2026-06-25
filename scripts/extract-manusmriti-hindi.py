"""Extract Hindi commentary for Manusmriti from Dwivedi translation DJVU OCR.

Source: archive.org ManuSmritHindi-GpDwivedi
  ManuSmritHindi-GpDwivedi_djvu.txt

Sections split by adhyaya headers (OCR-tolerant). Hindi blocks mapped per chapter
in seed-manusmriti-hindi.ts (chapters 5–12 bulk; 1–4 curated).

Output: scripts/cache/manusmriti-hindi.json

Run: python scripts/extract-manusmriti-hindi.py
"""
from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IDENT = "ManuSmritHindi-GpDwivedi"
DJVU_PATH = ROOT / "scripts/cache/manusmriti-hindi-djvu.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/manusmriti.json"
OUT_PATH = ROOT / "scripts/cache/manusmriti-hindi.json"

DEV = re.compile(r"[\u0900-\u097f]")
HINDI_MARKERS = re.compile(
    r"(?:है|होता|कर|से|के|की|का|को|में|इस|यह|वह|चाहिए|चाहिये|कहा|जाता|"
    r"नहीं|करना|हुआ|हुए|अर्थात्|क्योंकि|इसलिये|मनु|धर्म|पुरुष|ब्राह्मण|संसार|जगत्)"
)
GARBAGE = re.compile(
    r"(?:अध्याय\s*[०-९\d]+|मनुस्मृति\s*।|पहला\s+अध्याय|कक\s*कै|पूर्ण\s+हुआ)"
)

ADHYAYA_PATTERNS: list[tuple[int, list[str]]] = [
    (1, [r"पहला\s+अध्याय"]),
    (2, [r"दूसरा\s+अध्याय"]),
    (3, [r"तीसरा\s+अध्याय"]),
    (4, [r"चौथा\s+अध्याय"]),
    (5, [r"पांचवां\s+अध्याय", r"पाँचवाँ\s+अध्याय", r"पांचवाँ\s+अध्याय"]),
    (6, [r"छठवां\s+अध्याय", r"छठा\s+अध्याय", r"षष्ठ\s+अध्याय"]),
    (7, [r"सातवां\s+अध्याय", r"सातवाँ\s+अध्याय", r"सप्तम\s+अध्याय"]),
    (8, [r"आठवां\s+अध्याय", r"आठवाँ\s+अध्याय", r"अष्टम\s+अध्याय"]),
    (9, [r"नवां\s+अध्याय", r"नवाँ\s+अध्याय", r"नौवां\s+अध्याय"]),
    (
        10,
        [
            r"दश्वा\s+अध्याय",
            r"दशुवां\s+अध्याय",
            r"दशवां\s+अध्याय",
            r"दसवां\s+अध्याय",
            r"दशम\s+अध्याय",
        ],
    ),
    (11, [r"ग्यारहवां\s+अध्याय", r"ग्यारहवाँ\s+अध्याय", r"एकादश\s+अध्याय"]),
    (12, [r"बारहवां\s+अध्याय", r"बारहवाँ\s+अध्याय", r"द्वादश\s+अध्याय"]),
]

OCR_FIXES: tuple[tuple[str, str], ...] = (
    ("दै", "है"),
    (" हे ", " है "),
    ("क्योकि", "क्योंकि"),
    ("बरह्म", "ब्रह्म"),
    ("बरह्म", "ब्रह्म"),
)


def download_djvu() -> str:
    if DJVU_PATH.exists():
        text = DJVU_PATH.read_text(encoding="utf-8", errors="ignore")
        if sum(1 for c in text if "\u0900" <= c <= "\u097f") > 100000:
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


def find_adhyaya_starts(text: str) -> dict[int, int]:
    main = text.find("महर्पियों ने एकाग्रचिस")
    if main < 0:
        main = text.find("पहला अध्याय")
    if main < 0:
        main = 0

    starts: dict[int, int] = {}
    for chapter, patterns in ADHYAYA_PATTERNS:
        best = 10**9
        for pattern in patterns:
            match = re.search(pattern, text[main:])
            if match and match.start() < best:
                best = match.start()
        if best < 10**9:
            starts[chapter] = main + best
    return starts


def main() -> None:
    text = download_djvu()
    starts = find_adhyaya_starts(text)
    ordered = sorted(starts.items())

    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    verse_counts = {
        ch["number"]: len(ch["verses"]) for ch in scripture["chapters"]
    }

    chapters: dict[str, list[str]] = {}
    for index, (chapter, pos) in enumerate(ordered):
        end = ordered[index + 1][1] if index + 1 < len(ordered) else len(text)
        blocks = extract_blocks(text[pos:end])
        chapters[str(chapter)] = blocks
        print(
            f"  adhyaya {chapter}: {len(blocks)} blocks "
            f"(json chapter {chapter}: {verse_counts.get(chapter, 0)} verses)"
        )

    seed_from = 5
    seed_verses = sum(
        verse_counts.get(n, 0) for n in range(seed_from, 13) if n in verse_counts
    )
    seed_blocks = sum(len(chapters.get(str(n), [])) for n in range(seed_from, 13))

    payload = {
        "source": f"https://archive.org/details/{IDENT}",
        "license": "Pandit Girija Prasad Dwivedi Hindi translation (1917, public domain scan).",
        "seedChapterStart": seed_from,
        "verseCount": seed_verses,
        "blockCount": seed_blocks,
        "chapters": chapters,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(f"  {seed_blocks} Hindi blocks for {seed_verses} verses (chapters {seed_from}–12)")


if __name__ == "__main__":
    main()