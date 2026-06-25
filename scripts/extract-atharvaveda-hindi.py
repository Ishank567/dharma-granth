"""Extract Hindi commentary for Atharva Veda from Prof. Vishwanath Vidyalankar bhashya OCR.

Source: archive.org atharvaveda-by-prof.-vishwanath-vidyalankar-complete-sanskrit-hindi
  9 DJVU files covering kandas 1–20.

Hindi padartha-style blocks are mapped per kanda in seed-atharvaveda-hindi.ts
(kandas 4–20 bulk; 1–3 curated).

Output: scripts/cache/atharvaveda-hindi.json

Run: python scripts/extract-atharvaveda-hindi.py
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
IDENT = "atharvaveda-by-prof.-vishwanath-vidyalankar-complete-sanskrit-hindi"
CACHE_DIR = ROOT / "scripts/cache/atharvaveda-hindi-djvu"
JSON_PATH = ROOT / "public/data/scriptures-full/atharvaveda.json"
OUT_PATH = ROOT / "scripts/cache/atharvaveda-hindi.json"

DJVU_FILES: list[tuple[str, list[int]]] = [
    ("Atharvaveda by Prof. Vishwanath Vidyalankar - Kand 1-3 (Sanskrit-Hindi)_djvu.txt", [1, 2, 3]),
    ("Atharvaveda by Prof. Vishwanath Vidyalankar - Kand 4-5 (Sanskrit-Hindi)_djvu.txt", [4, 5]),
    ("Atharvaveda by Prof. Vishwanath Vidyalankar - Kand 6 (Sanskrit-Hindi)_djvu.txt", [6]),
    ("Atharvaveda by Prof. Vishwanath Vidyalankar - Kand 7-8 (Sanskrit-Hindi)_djvu.txt", [7, 8]),
    ("Atharvaveda by Prof. Vishwanath Vidyalankar - Kand 9-10 (Sanskrit-Hindi)_djvu.txt", [9, 10]),
    ("Atharvaveda by Prof. Vishwanath Vidyalankar - Kand 11-13 (Sanskrit-Hindi)_djvu.txt", [11, 12, 13]),
    ("Atharvaveda by Prof. Vishwanath Vidyalankar - Kand 14-17 (Sanskrit-Hindi)_djvu.txt", [14, 15, 16, 17]),
    ("Atharvaveda by Prof. Vishwanath Vidyalankar - Kand 18-19 (Sanskrit-Hindi)_djvu.txt", [18, 19]),
    ("Atharvaveda by Prof. Vishwanath Vidyalankar - Kand 20 (Sanskrit-Hindi)_djvu.txt", [20]),
]

DEV = re.compile(r"[\u0900-\u097f]")
HINDI_MARKERS = re.compile(
    r"(?:है|होता|होते|कर|से|के|की|का|को|में|इस|यह|वह|चाहिए|चाहिये|कहा|जाता|"
    r"नहीं|करना|हुआ|हुए|अर्थात्|क्योंकि|इसलिये|मनुष्य|भगवान|वेद|प्रभु|कर्म|"
    r"धर्म|पुरुष|सत्य|देव|प्रकृति|जगत्|परमेश्वर|अर्थात)"
)
SKIP_LINE = re.compile(
    r"^(?:ऋषिः|देवता|छन्द|स्वर|पदार्थ|अन्वय|मन्त्र|अथर्ववेद|काण्ड|सूक्त|"
    r"अनुवाक|श्रनुवाक|श्रुवाक|॥|\d+\s*$)",
    re.I,
)
GARBAGE = re.compile(
    r"(?:अथर्ववेदभाष्य|अथर्वैवेदभाष्य|अथववेदभाष्य|पृष्ठ|file:)"
)

OCR_FIXES: tuple[tuple[str, str], ...] = (
    ("दै", "है"),
    (" हे ", " है "),
    ("क्योकि", "क्योंकि"),
    ("चाहिये", "चाहिए"),
    ("यतुर्थ", "चतुर्थ"),
)


def dev_num(number: int) -> str:
    return str(number).translate(str.maketrans("0123456789", "०१२३४५६७८९"))


def kanda_patterns(number: int) -> list[str]:
    ordinal: dict[int, list[str]] = {
        1: [r"प्रथम\s*काण्ड"],
        2: [r"द्वितीय\s*काण्ड"],
        3: [r"तृतीय\s*काण्ड"],
        4: [r"यतुर्थ\s*काण्ड", r"चतुर्थ\s*काण्ड"],
        5: [r"पञ्चम\s*काण्ड"],
        6: [r"षष्ठ\s*काण्ड", r"छठा\s*काण्ड", r"छठवाँ\s*काण्ड"],
        7: [r"सप्तम\s*काण्ड"],
        8: [r"अष्टम\s*काण्ड"],
        9: [r"नवम\s*काण्ड"],
        10: [r"दशम\s*काण्ड"],
        11: [r"एकादश\s*काण्ड"],
        12: [r"द्वादश\s*काण्ड"],
        13: [r"त्रयोदश\s*काण्ड"],
        14: [r"चतुर्दश\s*काण्ड"],
        15: [r"पञ्चदश\s*काण्ड"],
        16: [r"षोडश\s*काण्ड"],
        17: [r"सप्तदश\s*काण्ड"],
        18: [r"अष्टादश\s*काण्ड"],
        19: [r"एकोनविंश\s*काण्ड", r"उन्नीसवाँ\s*काण्ड"],
        20: [r"विंश\s*काण्ड", r"बीसवाँ\s*काण्ड", r"विंशतितम\s*काण्ड"],
    }
    digit = dev_num(number)
    patterns = list(ordinal.get(number, []))
    digit_boundary = rf"(?![०-९\d])"
    patterns.extend(
        [
            rf"का०\s*{digit}{digit_boundary}",
            rf"का०{digit}{digit_boundary}",
            rf"कां०\s*{digit}{digit_boundary}",
            rf"का०\.?\s*{digit}{digit_boundary}",
            rf"काण्ड\s*{digit}\s*।\s*अनु[°०]?\s*१",
            rf"काण्ड\s*{digit}\s*।\s*अनु[°०]?\s*०\s*१",
            rf"काण्ड\s*{digit}\s*।\s*सूक्त",
            rf"काण्ड\s*{digit}\s*।\s*सुक्त",
            rf"काण्ड\s*{digit}\s*।\s*सू",
            rf"काण्ड\s*{digit}\s*।\s*अनु",
            rf"काण्ड\s*{digit}\s*अनुवाक",
            rf"\(काण्ड\s*{digit}",
            rf"क\s*{{\s*?}}?ण्ड\s*{digit}",
            rf"ण्ड\s*{digit}\s*,\s*स",
            rf"काण्ड\s*{digit}[^०-९\d]",
        ]
    )
    return patterns


def is_noise_match(text: str, pos: int, kanda: int) -> bool:
    window = text[max(0, pos - 50) : pos + 120]
    digit = dev_num(kanda)
    if re.search(rf"काण्ड\s*{digit}\s*[-–—]", window):
        return True
    if re.search(rf"क्राण्ड\s*{digit}\s*[-–—]", window):
        return True
    if re.search(
        r"भूमिका|संक्षिप्त परिचय|विषयों का|के सूक्तों|विषय-प्रयेश्च|"
        r"सूर्यामुक्त|प्रकाशन|वे के|व्रात्य-परमेदवर",
        window,
    ):
        return True
    if re.search(r"का.*समाप्त|अनुवाक समाप्त|काण्ड का.*समाप्त", window):
        return True
    if "छप रहा" in window:
        return True
    if pos < 8000 and re.search(rf"\[\s*काण्ड\s*{digit}", window):
        return True
    return False


def match_quality(text: str, pos: int, kanda: int) -> int:
    if is_noise_match(text, pos, kanda):
        return -1

    head = text[pos : pos + 100]
    score = 0
    if re.search(r"का०|कां०", head[:24]):
        score += 12
    if re.search(r"काण्ड\s*" + dev_num(kanda) + r"\s*।", head[:40]):
        score += 8
    if re.search(r"काण्ड\s*" + dev_num(kanda) + r"\s*;", head[:40]):
        score += 8
    if re.search(r"सूक्त|सुक्त|सू°|सु°|सू०|सु०|अनु|श्रनु|भाष्य|माष्य", head):
        score += 6
    if re.search(r"यतुर्थ\s*काण्ड|पञ्चम\s*काण्ड|प्रथम\s*काण्ड", head):
        score += 10
    if re.match(r"काण्ड\s*" + dev_num(kanda) + r"[^।;०-९\d]", head) and score < 8:
        return -1
    return score


def download_file(fname: str) -> str:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^a-zA-Z0-9._-]+", "-", fname.replace("_djvu.txt", "")).strip("-").lower()
    path = CACHE_DIR / f"{slug}.txt"
    if path.exists():
        text = path.read_text(encoding="utf-8", errors="ignore")
        if sum(1 for char in text if "\u0900" <= char <= "\u097f") > 5000:
            return text

    url = f"https://archive.org/download/{IDENT}/{urllib.parse.quote(fname)}"
    print(f"  downloading {fname} …")
    last_error: Exception | None = None
    for attempt in range(5):
        try:
            data = urllib.request.urlopen(
                urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}),
                timeout=240,
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
    if len(line) < 20:
        return False
    if len(DEV.findall(line)) / max(len(line), 1) < 0.55:
        return False
    if not HINDI_MARKERS.search(line):
        return False
    if SKIP_LINE.match(line):
        return False
    if GARBAGE.search(line):
        return False
    if len(re.findall(r"ः\s", line)) > 4:
        return False
    if len(re.findall(r"[क-ह]्", line)) > 4:
        return False
    return True


def dedupe_blocks(blocks: list[str]) -> list[str]:
    deduped: list[str] = []
    for block in blocks:
        if deduped and block[:55] == deduped[-1][:55]:
            continue
        deduped.append(block)
    return deduped


def extract_marker_blocks(section: str) -> list[str]:
    blocks: list[str] = []
    markers = list(re.finditer(r"॥\s*([\d०-९]+)\s*॥", section))

    for index, marker in enumerate(markers):
        end = (
            markers[index + 1].start()
            if index + 1 < len(markers)
            else marker.end() + 1000
        )
        chunk = section[marker.end() : end]
        lines: list[str] = []
        for raw in chunk.splitlines():
            line = clean_line(raw)
            if is_hindi_line(line):
                lines.append(line)
        if not lines:
            continue
        para = " ".join(lines[:4])
        if len(para) >= 28:
            blocks.append(para)
    return blocks


def extract_paragraph_blocks(section: str) -> list[str]:
    blocks: list[str] = []
    current: list[str] = []

    for raw in section.splitlines():
        line = clean_line(raw)
        if is_hindi_line(line):
            current.append(line)
            continue
        if current:
            para = " ".join(current[:5])
            if len(para) >= 30:
                blocks.append(para)
            current = []

    if current:
        para = " ".join(current[:5])
        if len(para) >= 30:
            blocks.append(para)

    return blocks


def extract_blocks(section: str) -> list[str]:
    marker_blocks = extract_marker_blocks(section)
    paragraph_blocks = extract_paragraph_blocks(section)
    if len(paragraph_blocks) > len(marker_blocks) * 1.5:
        return dedupe_blocks(paragraph_blocks)
    return dedupe_blocks(marker_blocks)


def find_kanda_starts(text: str, kandas: list[int]) -> dict[int, int]:
    starts: dict[int, int] = {}
    min_pos = 0

    for kanda in kandas:
        ranked: list[tuple[int, int, int]] = []
        for pattern in kanda_patterns(kanda):
            for match in re.finditer(pattern, text):
                pos = match.start()
                if pos < min_pos:
                    continue
                quality = match_quality(text, pos, kanda)
                if quality < 0:
                    continue
                ranked.append((-quality, pos, quality))

        viable = [item for item in ranked if item[2] >= 8]
        if viable:
            viable.sort(key=lambda item: item[1])
            best = viable[0][1]
            starts[kanda] = best
            min_pos = best + 500

    return starts


def split_kandas(text: str, kandas: list[int]) -> dict[int, str]:
    starts = find_kanda_starts(text, kandas)
    if not starts:
        if len(kandas) == 1:
            return {kandas[0]: text}
        raise RuntimeError(f"Could not locate kanda boundaries for {kandas}")

    ordered = sorted(starts.items())
    sections: dict[int, str] = {}
    for index, (kanda, pos) in enumerate(ordered):
        end = ordered[index + 1][1] if index + 1 < len(ordered) else len(text)
        sections[kanda] = text[pos:end]
    return sections


def main() -> None:
    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    verse_counts = {ch["number"]: len(ch["verses"]) for ch in scripture["chapters"]}
    kandas: dict[str, list[str]] = {}
    total_blocks = 0

    for fname, kanda_list in DJVU_FILES:
        print(f"Processing {fname} …")
        text = download_file(fname)
        sections = split_kandas(text, kanda_list)
        for kanda, section in sections.items():
            blocks = extract_blocks(section)
            kandas[str(kanda)] = blocks
            total_blocks += len(blocks)
            print(
                f"  kanda {kanda}: {len(blocks)} blocks "
                f"(json: {verse_counts.get(kanda, 0)} verses)"
            )

    seed_from = 4
    seed_verses = sum(
        verse_counts.get(n, 0) for n in range(seed_from, 21) if n in verse_counts
    )
    seed_blocks = sum(len(kandas.get(str(n), [])) for n in range(seed_from, 21))

    payload = {
        "source": f"https://archive.org/details/{IDENT}",
        "license": (
            "Prof. Vishwanath Vidyalankar Atharva Veda Sanskrit-Hindi bhashya "
            "(public domain scan, archive.org OCR)."
        ),
        "seedChapterStart": seed_from,
        "verseCount": seed_verses,
        "blockCount": seed_blocks,
        "kandas": kandas,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(
        f"  {seed_blocks} Hindi blocks for "
        f"{seed_verses} bulk verses (kandas {seed_from}–20)"
    )


if __name__ == "__main__":
    main()