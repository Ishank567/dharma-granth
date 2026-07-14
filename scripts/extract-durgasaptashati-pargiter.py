"""Extract Pargiter English for Durga Saptashati (Devi Mahatmyam).

Maps Pargiter Markandeya cantos 81–93 (OCR-corrupted labels allowed)
onto the 13 Durga Saptashati chapters by sequential stanza alignment
within each matched canto pair.

Source: F. Eden Pargiter (1904), public domain.
Output: scripts/cache/durgasaptashati-translations.json

Run: python scripts/extract-durgasaptashati-pargiter.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEXT_PATH = ROOT / "scripts/cache/markandeya-pargiter.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/durgasaptashati.json"
OUT_PATH = ROOT / "scripts/cache/durgasaptashati-translations.json"

# Pargiter canto number → Durga chapter number (classic 13-adhyaya DM).
# Canto 81 opens the DM (Madhu-Kaitabha); 93 closes it.
# Some intermediate labels are missing in OCR; we fall back to position order.
CANTO_TO_DURGA: dict[int, int] = {
    81: 1,
    82: 2,
    83: 3,
    84: 4,
    85: 5,
    86: 6,
    87: 7,
    88: 8,
    89: 9,
    90: 10,
    91: 11,
    92: 12,
    93: 13,
}


def roman_to_int(raw: str) -> int:
    vals = {"M": 1000, "D": 500, "C": 100, "L": 50, "X": 10, "V": 5, "I": 1}
    s = raw.upper().strip().rstrip(".")
    total = 0
    i = 0
    while i < len(s):
        if s[i] not in vals:
            return 0
        if i + 1 < len(s) and s[i + 1] in vals and vals[s[i]] < vals[s[i + 1]]:
            total += vals[s[i + 1]] - vals[s[i]]
            i += 2
        else:
            total += vals[s[i]]
            i += 1
    return total


def clean_text(text: str) -> str:
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    # Drop footnote markers and common OCR junk
    text = re.sub(r"\*+", "", text)
    text = re.sub(r"\^[a-zA-Z0-9]+", "", text)
    return text.strip()


def is_junk(text: str) -> bool:
    s = text.strip()
    if len(s) < 12:
        return True
    if re.fullmatch(r"\d{1,4}\.?", s):
        return True
    if re.fullmatch(r"[-–—.)\]\"'”’]+", s):
        return True
    # Pure footnote / OCR debris
    if re.fullmatch(r"[A-Za-z]\s+and\s+[A-Za-z].{0,40}", s) and "might bo" in s:
        return True
    return False


def parse_numbered_verses(chunk: str) -> list[str]:
    """Pull numbered English stanzas from a Pargiter canto body."""
    verses: dict[int, str] = {}
    current = 0
    buffer: list[str] = []

    def flush() -> None:
        nonlocal current, buffer
        if current and buffer:
            cleaned = clean_text(" ".join(buffer))
            if cleaned and not is_junk(cleaned):
                verses[current] = cleaned
        current = 0
        buffer = []

    for line in chunk.splitlines():
        stripped = line.strip()
        if not stripped:
            flush()
            continue
        if re.fullmatch(r"\d{1,3}", stripped):
            continue
        if re.match(
            r"^(THE |Markandeya spoke|Jaimini spoke|Or |\*|Canto|Page|Kraushtuki)",
            stripped,
            re.I,
        ):
            continue
        match = re.match(r"^\s*(\d{1,3})\s+(.+)", line)
        if match:
            flush()
            current = int(match.group(1))
            buffer = [match.group(2).strip()]
            continue
        if current:
            buffer.append(stripped)

    flush()
    if verses:
        return [verses[n] for n in sorted(verses)]

    # Fallback: paragraph split when OCR lost verse numbers
    paras = [
        clean_text(p)
        for p in re.split(r"\n\s*\n", chunk)
        if clean_text(p) and not is_junk(clean_text(p))
    ]
    # Drop short title lines
    paras = [p for p in paras if len(p) > 40 and not p.lower().startswith("the devi")]
    return paras


def map_sequential(paragraphs: list[str], count: int) -> list[str]:
    if count <= 0:
        return []
    if not paragraphs:
        return [""] * count
    if len(paragraphs) == count:
        return paragraphs
    mapped: list[str] = []
    cursor = 0
    for index in range(count):
        remaining = count - index
        left = len(paragraphs) - cursor
        if left <= 0:
            mapped.append(mapped[-1] if mapped else "")
            continue
        if remaining == 1:
            mapped.append(" ".join(paragraphs[cursor:]))
            break
        take = max(1, round(left / remaining))
        mapped.append(" ".join(paragraphs[cursor : cursor + take]))
        cursor += take
    while len(mapped) < count:
        mapped.append(mapped[-1] if mapped else "")
    return mapped[:count]


# OCR-corrupted roman numerals seen in the Pargiter DJVU text.
OCR_ROMAN_FIXES: dict[str, int] = {
    "LXXXT": 81,  # LXXXI
    "LXXXILL": 83,  # LXXXIII
    "LXXXIll": 83,
    "LXXXIII": 83,
    "XOL": 91,  # XCI
    "XCI": 91,
}


def find_cantos(text: str) -> dict[int, str]:
    # Allow mixed-case OCR roman numerals (LXXXIll, LXXXT, XOL).
    # Period after the numeral is optional in the DJVU text.
    markers = list(re.finditer(r"Canto\s+([A-Za-z]+)\.?\s*", text))
    cantos: dict[int, str] = {}
    ordered: list[tuple[int, int, int]] = []  # (pos, num, end)

    for index, match in enumerate(markers):
        label = match.group(1)
        num = OCR_ROMAN_FIXES.get(label) or OCR_ROMAN_FIXES.get(label.upper())
        if not num:
            num = roman_to_int(label.upper())
        if num < 80 or num > 94:
            continue
        end = markers[index + 1].start() if index + 1 < len(markers) else len(text)
        ordered.append((match.start(), num, end))

    for pos, num, end in ordered:
        # Prefer first occurrence of each canto number
        if num not in cantos:
            cantos[num] = text[pos:end]
    return cantos


def main() -> None:
    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    text = TEXT_PATH.read_text(encoding="utf-8", errors="ignore")
    cantos = find_cantos(text)

    # Prefer explicit 81–93; fill gaps from available cantos in order
    available = sorted(n for n in cantos if 81 <= n <= 93)
    print(f"Found Pargiter DM cantos: {available}")

    cache: dict[str, dict[str, str]] = {}
    stats: list[str] = []

    for chapter in scripture["chapters"]:
        ch_num = chapter["number"]
        # Find matching canto
        canto_num = next((c for c, d in CANTO_TO_DURGA.items() if d == ch_num), None)
        body = cantos.get(canto_num or -1, "")
        if not body and available:
            # Index into available by chapter order (1-based)
            idx = ch_num - 1
            if 0 <= idx < len(available):
                body = cantos[available[idx]]
                canto_num = available[idx]

        paragraphs = parse_numbered_verses(body) if body else []
        verse_keys = [str(v["number"]) for v in chapter["verses"]]
        mapped = map_sequential(paragraphs, len(verse_keys))

        chapter_cache: dict[str, str] = {}
        for key, tr in zip(verse_keys, mapped, strict=True):
            cleaned = tr.strip()
            if cleaned and not is_junk(cleaned):
                chapter_cache[key] = cleaned

        cache[str(ch_num)] = chapter_cache
        stats.append(
            f"ch {ch_num}: {len(chapter_cache)}/{len(verse_keys)} "
            f"(canto {canto_num}, paras {len(paragraphs)})"
        )

    OUT_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    for line in stats:
        print(f"  {line}")


if __name__ == "__main__":
    main()
