"""Extract Hindi commentary for Shukla Yajurveda from Pt. Harisharan bhashya OCR.

Source: archive.org yajurved-pt-harisharan-saiddhantalankar-complete-in-40-parts
  Yajurvedbhashyam_(chapter_N)_djvu.txt  (N = 1..40)

Hindi भावार्थ/भावार्थभाषा blocks are mapped per adhyaya in seed-yajurveda-hindi.ts
(chapters 5–40 bulk; 1–4 curated).

Output: scripts/cache/yajurveda-hindi.json

Run: python scripts/extract-yajurveda-hindi.py
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
IDENT = "yajurved-pt-harisharan-saiddhantalankar-complete-in-40-parts"
CACHE_DIR = ROOT / "scripts/cache/yajurveda-hindi-djvu"
JSON_PATH = ROOT / "public/data/scriptures-full/yajurveda.json"
OUT_PATH = ROOT / "scripts/cache/yajurveda-hindi.json"

DEV = re.compile(r"[\u0900-\u097f]")
HINDI_MARKERS = re.compile(
    r"(?:है|होता|होते|कर|से|के|की|का|को|में|इस|यह|वह|चाहिए|चाहिये|कहा|जाता|"
    r"नहीं|करना|हुआ|अर्थात्|क्योंकि|इसलिये|मनुष्य|भगवान|यज्ञ|वेद|प्रभु|कर्म|"
    r"धर्म|पुरुष|सत्य|अग्नि|देव)"
)
SKIP_LINE = re.compile(
    r"^(?:ऋषिः|देवता|छन्द|स्वर|पदार्थ|अन्वय|मन्त्र|यजुर्वेद|प्रथम|द्वितीय|"
    r"तृतीय|चतुर्थ|पंचम|षष्ठ|सप्तम|अष्टम|नवम|दशम|अध्याय|॥|\d+\s*$)",
    re.I,
)
GARBAGE = re.compile(r"(?:यजुर्वेदभाष्य|अध्याय\s*[०-९\d]+|पृष्ठ)")

BHAVARTH_PATTERNS = (
    r"भावार्थभाषा\s*[:-]",
    r"भावार्थ\s*[:-]",
    r"भावार्थ\s",
)

OCR_FIXES: tuple[tuple[str, str], ...] = (
    ("दै", "है"),
    (" हे ", " है "),
    ("क्योकि", "क्योंकि"),
    ("चाहिये", "चाहिए"),
    ("ईश्वर:", "ईश्वर "),
)


def download_chapter(chapter: int) -> str:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    path = CACHE_DIR / f"chapter-{chapter:02d}.txt"
    if path.exists():
        text = path.read_text(encoding="utf-8", errors="ignore")
        if sum(1 for c in text if "\u0900" <= c <= "\u097f") > 500:
            return text

    fname = f"Yajurvedbhashyam_(chapter_{chapter})_djvu.txt"
    url = f"https://archive.org/download/{IDENT}/{urllib.parse.quote(fname)}"
    print(f"  downloading {fname} …")
    last_error: Exception | None = None
    for attempt in range(5):
        try:
            data = urllib.request.urlopen(
                urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}),
                timeout=180,
            ).read()
            path.write_bytes(data)
            return data.decode("utf-8", errors="ignore")
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as err:
            last_error = err
            wait = 3 * (attempt + 1)
            print(f"    retry {attempt + 1}/5 after {wait}s ({err})")
            time.sleep(wait)
    raise RuntimeError(f"Failed to download {fname}") from last_error


def clean_line(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"[\^~`#@$%&*_\[\]{}<>|\\₹~]", "", text)
    text = text.replace("\u200c", "")
    for src, dst in OCR_FIXES:
        text = text.replace(src, dst)
    return text


def is_hindi_line(line: str) -> bool:
    if len(line) < 22:
        return False
    if len(DEV.findall(line)) / max(len(line), 1) < 0.58:
        return False
    if not HINDI_MARKERS.search(line):
        return False
    if SKIP_LINE.match(line):
        return False
    if GARBAGE.search(line):
        return False
    if len(re.findall(r"ः\s", line)) > 4:
        return False
    return True


def extract_blocks(text: str) -> list[str]:
    blocks: list[str] = []
    seen: set[str] = set()

    for pattern in BHAVARTH_PATTERNS:
        for match in re.finditer(pattern, text):
            chunk = text[match.end() : match.end() + 1800]
            lines: list[str] = []
            for raw in chunk.splitlines():
                line = clean_line(raw)
                if not is_hindi_line(line):
                    continue
                if line.startswith("भावार्थ"):
                    continue
                lines.append(line)
                if len(lines) >= 4:
                    break
            if not lines:
                continue
            para = " ".join(lines[:4])
            if len(para) < 30:
                continue
            key = para[:60]
            if key in seen:
                continue
            seen.add(key)
            blocks.append(para)

    if not blocks:
        markers = list(re.finditer(r"॥\s*([\d०-९]+)\s*॥", text))
        for index, marker in enumerate(markers):
            end = (
                markers[index + 1].start()
                if index + 1 < len(markers)
                else marker.end() + 900
            )
            chunk = text[marker.end() : end]
            lines = [
                clean_line(raw)
                for raw in chunk.splitlines()
                if is_hindi_line(clean_line(raw))
            ]
            if lines:
                para = " ".join(lines[:3])
                if len(para) >= 30:
                    blocks.append(para)

    deduped: list[str] = []
    for block in blocks:
        if deduped and block[:55] == deduped[-1][:55]:
            continue
        deduped.append(block)
    return deduped


def main() -> None:
    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    chapters: dict[str, list[str]] = {}
    total_blocks = 0

    for chapter in scripture["chapters"]:
        num = chapter["number"]
        text = download_chapter(num)
        blocks = extract_blocks(text)
        chapters[str(num)] = blocks
        total_blocks += len(blocks)
        print(
            f"  adhyaya {num}: {len(blocks)} blocks "
            f"(json: {len(chapter['verses'])} verses)"
        )

    seed_from = 5
    seed_verses = sum(
        len(ch["verses"])
        for ch in scripture["chapters"]
        if ch["number"] >= seed_from
    )

    payload = {
        "source": f"https://archive.org/details/{IDENT}",
        "license": "Pt. Harisharan Siddhantalankar Yajurveda bhashya (public domain scan).",
        "seedChapterStart": seed_from,
        "verseCount": seed_verses,
        "blockCount": sum(len(chapters[str(n)]) for n in range(seed_from, 41)),
        "chapters": chapters,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(
        f"  {payload['blockCount']} Hindi blocks for "
        f"{seed_verses} bulk verses (chapters {seed_from}–40)"
    )


if __name__ == "__main__":
    main()