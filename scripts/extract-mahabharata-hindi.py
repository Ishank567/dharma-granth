"""Extract Hindi prose for Mahabharata from Gita Press Ramnarayan Dutt Shastri OCR.

Source: archive.org mahabharata-gita-press-gorakhpur
  Mahabharata Volume 1–6_djvu.txt

Hindi lines ending in ।। N ।। are mapped per parva in seed-mahabharata-hindi.ts
(parvas 8–18 bulk; 1–7 curated highlights).

Output: scripts/cache/mahabharata-hindi.json

Run: python scripts/extract-mahabharata-hindi.py
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
IDENT = "mahabharata-gita-press-gorakhpur"
CACHE_DIR = ROOT / "scripts/cache/mahabharata-hindi-djvu"
JSON_PATH = ROOT / "public/data/scriptures-full/mahabharata.json"
OUT_PATH = ROOT / "scripts/cache/mahabharata-hindi.json"

VOLUME_FILES = [f"Mahabharata Volume {n}_djvu.txt" for n in range(1, 7)]

# (volume index 1..6, parva number, start patterns within that volume)
VOLUME_PARVA_SPLITS: list[tuple[int, int, list[str]]] = [
    (1, 1, [r"\[आदिपर्व और सभापर्व\]"]),
    (1, 2, [r"(?m)^सभापर्व\s*$", r"सभाक्रियापर्वणि सभास्थाननिर्णये"]),
    (2, 3, [r"\[वनपर्व और विराटपर्व\]"]),
    (2, 4, [r"(?m)^विराटपर्व\s*$"]),
    (3, 5, [r"\[उद्योगपर्व और भीष्मपर्व\]"]),
    (3, 6, [r"(?m)^भीष्मपर्व\s*$"]),
    (4, 7, [r"\[द्रोण, कर्ण, शल्य, सौप्तिक और स्त्रीपर्व\]"]),
    (4, 8, [r"(?m)^कर्णपर्व\s*$"]),
    (4, 9, [r"(?m)^शल्यपर्व\s*$"]),
    (4, 10, [r"(?m)^सौप्तिकपर्व\s*$"]),
    (4, 11, [r"(?m)^स्त्रीपर्व\s*$"]),
    (5, 12, [r"शान्तिपर्व \[सचित्र"]),
    (6, 13, [r"\(अनुशासनपर्व\)", r"विषय-सूची\s*\n\(अनुशासनपर्व\)"]),
    (6, 14, [r"(?m)^अश्वमेधपर्व\s*$"]),
    (6, 15, [r"(?m)^आश्रमवासिक पर्व\s*$", r"(?m)^आश्रमवासपर्व\s*$"]),
    (6, 16, [r"(?m)^मौसलपर्व\s*$"]),
    (6, 17, [r"(?m)^महाप्रस्थानिकपर्व\s*$"]),
    (6, 18, [r"(?m)^स्वर्गारोहणपर्व\s*$"]),
]

DEV = re.compile(r"[\u0900-\u097f]")
HINDI_MARKERS = re.compile(
    r"(?:है|होता|होते|कर|से|के|की|का|को|में|इस|यह|वह|चाहिए|चाहिये|कहा|जाता|"
    r"नहीं|करना|हुआ|हुए|अर्थात्|क्योंकि|इसलिये|राजा|भगवान|देव|धर्म|पाण्डव|कौरव|"
    r"युधिष्ठिर|अर्जुन|कृष्ण|भीष्म|द्रोण|कर्ण)"
)
SKIP_LINE = re.compile(
    r"^(?:ऋषिः|देवता|छन्द|मन्त्र|अध्याय विषय|विषय-सूची|पृष्ठ|॥|\d+\s*$)",
    re.I,
)
GARBAGE = re.compile(r"(?:खरीदें|गीताप्रेस|मुद्रण|कुल मुद्रण|ISBN|file:)")
DANDA_END = re.compile(r"।।\s*[\d०-९]+\s*।।\s*$")

OCR_FIXES: tuple[tuple[str, str], ...] = (
    ("दै", "है"),
    (" हे ", " है "),
    ("क्योकि", "क्योंकि"),
    ("चाहिये", "चाहिए"),
    ("युधिष्ठटिर", "युधिष्ठिर"),
    ("धूृतराष्ट्र", "धृतराष्ट्र"),
)


def download_volume(fname: str) -> str:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^a-zA-Z0-9._-]+", "-", fname.replace("_djvu.txt", "")).strip("-").lower()
    path = CACHE_DIR / f"{slug}.txt"
    if path.exists():
        text = path.read_text(encoding="utf-8", errors="ignore")
        if sum(1 for char in text if "\u0900" <= char <= "\u097f") > 50000:
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


def clean_line(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"[\^~`#@$%&*_\[\]{}<>|\\₹~]", "", text)
    text = text.replace("\u200c", "")
    for src, dst in OCR_FIXES:
        text = text.replace(src, dst)
    return text


def is_hindi_line(line: str) -> bool:
    if len(line) < 16:
        return False
    if len(DEV.findall(line)) / max(len(line), 1) < 0.52:
        return False
    if not HINDI_MARKERS.search(line):
        return False
    if SKIP_LINE.match(line):
        return False
    if GARBAGE.search(line):
        return False
    if len(re.findall(r"ः\s", line)) > 5:
        return False
    return True


def is_noise_start(text: str, pos: int) -> bool:
    window = text[max(0, pos - 40) : pos + 100]
    return bool(
        re.search(
            r"की कुल|की सम्पूर्ण|श्लोक-संख्या|श्लोकसंख्या|समाप्त",
            window,
        )
    )


def find_parva_starts(volumes: dict[int, str]) -> dict[int, int]:
    starts: dict[int, tuple[int, int]] = {}
    offset = 0

    for vol_num in range(1, 7):
        text = volumes[vol_num]
        vol_splits = [(p, pats) for v, p, pats in VOLUME_PARVA_SPLITS if v == vol_num]
        vol_splits.sort(key=lambda item: item[0])
        min_pos = 0

        for parva, patterns in vol_splits:
            best: int | None = None
            for pattern in patterns:
                for match in re.finditer(pattern, text):
                    pos = match.start()
                    if pos < min_pos or is_noise_start(text, pos):
                        continue
                    if best is None or pos < best:
                        best = pos
            if best is not None:
                starts[parva] = (offset + best, vol_num)
                min_pos = best + 300
        offset += len(text)

    return {parva: pos for parva, (pos, _) in starts.items()}


def extract_blocks(section: str) -> list[str]:
    blocks: list[str] = []
    for raw in section.splitlines():
        line = clean_line(raw)
        if not DANDA_END.search(line):
            continue
        text = DANDA_END.sub("", line).strip()
        if len(text) < 12:
            continue
        if not is_hindi_line(text) and len(text) < 25:
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


def main() -> None:
    volumes = {n: download_volume(fname) for n, fname in enumerate(VOLUME_FILES, start=1)}
    full_text = "".join(volumes[n] for n in range(1, 7))
    starts = find_parva_starts(volumes)

    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    verse_counts = {ch["number"]: len(ch["verses"]) for ch in scripture["chapters"]}
    parvas: dict[str, list[str]] = {}
    total_blocks = 0

    ordered = sorted(starts.items())
    for index, (parva, pos) in enumerate(ordered):
        end = ordered[index + 1][1] if index + 1 < len(ordered) else len(full_text)
        blocks = extract_blocks(full_text[pos:end])
        parvas[str(parva)] = blocks
        total_blocks += len(blocks)
        print(
            f"  parva {parva:2}: {len(blocks):5} blocks "
            f"(json: {verse_counts.get(parva, 0):5} verses)"
        )

    seed_from = 8
    seed_verses = sum(verse_counts.get(n, 0) for n in range(seed_from, 19))
    seed_blocks = sum(len(parvas.get(str(n), [])) for n in range(seed_from, 19))

    payload = {
        "source": f"https://archive.org/details/{IDENT}",
        "license": (
            "Pandit Ramnarayan Dutt Shastri Hindi translation, Gita Press Gorakhpur "
            "(public domain scan, archive.org OCR)."
        ),
        "seedParvaStart": seed_from,
        "verseCount": seed_verses,
        "blockCount": seed_blocks,
        "parvas": parvas,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(f"  {seed_blocks} Hindi blocks for {seed_verses} bulk verses (parvas {seed_from}–18)")


if __name__ == "__main__":
    main()