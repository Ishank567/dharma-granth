"""Extract Hindi commentary blocks for Brihadaranyaka Upanishad from Gita Press DJVU OCR.

Source: archive.org RUgF_brihadaranyaka-upanishad-577-gita-press-gorakhpur
  Brihadaranyaka Upanishad 577 - Gita Press Gorakhpur_djvu.txt

Shankara bhashya with Hindi tika — blocks mapped sequentially in seed script.

Output: scripts/cache/brihadaranyaka-hindi.json

Run: python scripts/extract-brihadaranyaka-hindi.py
"""
from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IDENT = "RUgF_brihadaranyaka-upanishad-577-gita-press-gorakhpur"
DJVU_PATH = ROOT / "scripts/cache/brihadaranyaka-gita-press-djvu.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/brihadaranyaka.json"
OUT_PATH = ROOT / "scripts/cache/brihadaranyaka-hindi.json"

DEV = re.compile(r"[\u0900-\u097f]")
HINDI_MARKERS = re.compile(
    r"(?:है|हें|होता|कर|से|के|की|का|को|में|इस|यह|वह|अर्थात्|क्योंकि|"
    r"इसलिये|इसलिए|चाहिये|चाहिए|जाता|करना|करते|कहा|कहते|उपासना|ब्रह्म|जगत्|जीव)"
)
NOISE = re.compile(
    r"^(?:अन्वय|पदार्थ|मूलम्|इति|श्लोक|खण्ड|मन्त्र|अध्याय|प्रपाठक|ब्राह्मण|"
    r"सम्पादक|शङ्करभाष्य|शांकरभाष्य|^\d+\s*$|file:)",
    re.I,
)
OCR_FIXES: tuple[tuple[str, str], ...] = (
    ("बरह्म", "ब्रह्म"),
    ("बरह्म", "ब्रह्म"),
    ("दै", "है"),
    (" हे ", " है "),
    ("क्योकि", "क्योंकि"),
    ("इसल्यि", "इसलिये"),
    ("परथिवी", "पृथिवी"),
    ("त्राह्मण", "ब्राह्मण"),
    ("राह्यण", "ब्राह्मण"),
    ("याज्गवल्वय", "याज्ञवल्क्य"),
    ("याज्ञवत्क्य", "याज्ञवल्क्य"),
)


def download_djvu() -> str:
    if DJVU_PATH.exists():
        text = DJVU_PATH.read_text(encoding="utf-8", errors="ignore")
        if sum(1 for c in text if "\u0900" <= c <= "\u097f") > 10000:
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


def dev_ratio(text: str) -> float:
    if not text:
        return 0.0
    return len(DEV.findall(text)) / len(text)


def clean_line(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"[\^~`#@$%&*_\[\]{}<>|\\]", "", text)
    for src, dst in OCR_FIXES:
        text = text.replace(src, dst)
    return text


def is_hindi_line(line: str) -> bool:
    if len(line) < 20:
        return False
    if dev_ratio(line) < 0.55:
        return False
    if not HINDI_MARKERS.search(line):
        return False
    if NOISE.match(line):
        return False
    if len(re.findall(r"ः\s", line)) > 3:
        return False
    return True


def extract_blocks(text: str) -> list[str]:
    start = text.find("बृहदारण्यकोपनिषद")
    if start < 0:
        start = text.find("बृहदारण्यक")
    if start < 0:
        start = 0
    body = text[start:]

    blocks: list[str] = []
    markers = list(re.finditer(r"॥\s*([\d०-९]+)\s*॥", body))

    for index, marker in enumerate(markers):
        end = (
            markers[index + 1].start()
            if index + 1 < len(markers)
            else marker.end() + 1200
        )
        chunk = body[marker.end() : end]
        lines: list[str] = []
        for raw in chunk.splitlines():
            line = clean_line(raw)
            if is_hindi_line(line):
                lines.append(line)
        if not lines:
            continue
        para = " ".join(lines[:3])
        if len(para) >= 30:
            blocks.append(para)

    deduped: list[str] = []
    for block in blocks:
        if deduped and block[:60] == deduped[-1][:60]:
            continue
        deduped.append(block)
    return deduped


def main() -> None:
    text = download_djvu()
    blocks = extract_blocks(text)

    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    verse_count = sum(len(ch["verses"]) for ch in scripture["chapters"])

    payload = {
        "source": f"https://archive.org/details/{IDENT}",
        "license": "Gita Press Gorakhpur Hindi tika (public domain scan, archive.org OCR).",
        "verseCount": verse_count,
        "blockCount": len(blocks),
        "blocks": blocks,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(f"  {len(blocks)} Hindi blocks for {verse_count} verses")


if __name__ == "__main__":
    main()