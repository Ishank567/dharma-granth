"""Extract Hindi translations for Vidura Niti from Gita Press DJVU OCR.

Source: archive.org HindiBookVidurNeetiCompleteByGitaPress
  Hindi Book-Vidur-Neeti (Complete) by Gita Press_djvu.txt

Hanuman Prasad Poddar Hindi anuvad follows each verse as:
  [sanskrit] ॥ N ॥ [hindi] ॥ N ॥

Output: scripts/cache/viduraniti-hindi.json

Run: python scripts/extract-viduraniti-hindi.py
"""
from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IDENT = "HindiBookVidurNeetiCompleteByGitaPress"
DJVU_PATH = ROOT / "scripts/cache/viduraniti-gita-press-djvu.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/viduraniti.json"
OUT_PATH = ROOT / "scripts/cache/viduraniti-hindi.json"

DEV = re.compile(r"[\u0900-\u097f]")
GARBAGE = re.compile(r"(?:अध्याय\s*[०-९\d]+|कक\s*कै|#\s*\+|फैह\s*ै|पहला\s+अध्याय)")
OCR_FIXES: tuple[tuple[str, str], ...] = (
    ("दै", "है"),
    (" हे ", " है "),
    ("क्योकि", "क्योंकि"),
    ("बिदुर", "विदुर"),
    ("घृतराष्ट्र", "धृतराष्ट्र"),
    ("युधिष्ठिक", "युधिष्ठिर"),
    ("पाण्डब", "पाण्डव"),
)


def download_djvu() -> str:
    if DJVU_PATH.exists():
        text = DJVU_PATH.read_text(encoding="utf-8", errors="ignore")
        if sum(1 for c in text if "\u0900" <= c <= "\u097f") > 50000:
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


def clean_hindi(raw: str) -> str:
    text = re.sub(r"\s+", " ", raw).strip()
    text = re.sub(r"[\^~`#@$%&*_\[\]{}<>|\\]", "", text)
    for src, dst in OCR_FIXES:
        text = text.replace(src, dst)
    if len(text) < 25 or len(text) > 1200:
        return ""
    if len(DEV.findall(text)) / max(len(text), 1) < 0.6:
        return ""
    if GARBAGE.search(text):
        return ""
    return text


def extract_blocks(text: str) -> list[str]:
    start = text.find("विदुरनीति")
    if start < 0:
        start = text.find("पहला अध्याय")
    body = text[start:]

    blocks: list[str] = []
    for match in re.finditer(
        r"॥\s*([\d०-९]+)\s*॥\s*([\s\S]{15,900}?)\s*॥\s*\1\s*॥",
        body,
    ):
        hindi = clean_hindi(match.group(2))
        if hindi:
            blocks.append(hindi)

    deduped: list[str] = []
    for block in blocks:
        if deduped and block[:50] == deduped[-1][:50]:
            continue
        deduped.append(block)
    return deduped


def main() -> None:
    text = download_djvu()
    blocks = extract_blocks(text)

    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    seed_chapters = [ch for ch in scripture["chapters"] if ch["number"] >= 4]
    verse_count = sum(len(ch["verses"]) for ch in seed_chapters)

    payload = {
        "source": f"https://archive.org/details/{IDENT}",
        "license": "Gita Press Vidura Niti Hindi anuvad by Hanuman Prasad Poddar (public domain scan).",
        "seedChapterStart": 4,
        "verseCount": verse_count,
        "blockCount": len(blocks),
        "blocks": blocks,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(f"  {len(blocks)} Hindi blocks for {verse_count} verses (chapters 4–8)")


if __name__ == "__main__":
    main()