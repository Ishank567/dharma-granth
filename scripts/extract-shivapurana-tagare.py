"""Extract Shiva Purana English from J.L. Shastri OCR (Motilal Banarsidass).

Sources (Samhitas 7–11):
  - Part III: dli.bengal.10689.12959 — Shatarudra, Kotirudra, Uma (pt 1)
  - Part IV: dli.bengal.10689.12960 — Uma (pt 2), Kailasa, Vayaviya

JSON chapters 1–6 are curated highlights only; chapters 7–11 are full Samhitas.
Each Samhita is parsed as one global verse stream (not per-adhyaya).

Output: scripts/cache/shivapurana-translations.json

Run: python scripts/extract-shivapurana-tagare.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PART3_PATH = ROOT / "scripts/cache/shiva-part3-djvu.txt"
PART4_PATH = ROOT / "scripts/cache/shiva-part4-djvu.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/shivpurana.json"
OUT_PATH = ROOT / "scripts/cache/shivapurana-translations.json"
FIRST_CHAPTER = 7

VERSE_START_RE = re.compile(r"^(\d{1,3}|l)(?:-(\d{1,3}))?\.\s+(.+)", re.I)
PAGE_RE = re.compile(r"^\d{1,3}$")
FOOTNOTE_RE = re.compile(r"^\d{1,3}\.\s+[A-Za-z^]+\s*[—\-]")
CHAPTER_RE = re.compile(r"^CHAPTER\s+.+$", re.I | re.M)

SAMHITA_START_RES: dict[int, re.Pattern[str]] = {
    7: re.compile(r"^\^ATARUDRASAMH", re.I | re.M),
    8: re.compile(r"^KOT(?:IRUDRASAMHITA|mUDR\s+ASAMHITX)", re.I | re.M),
    9: re.compile(r"^UMASAMHITA\s*$", re.I | re.M),
    10: re.compile(r"^KAI?LLASASAMHIT", re.I | re.M),
    11: re.compile(r"^VAYAVIYASAMHITA\s*$", re.I | re.M),
}


def load_raw(path: Path) -> str:
    if not path.exists():
        raise FileNotFoundError(f"Missing {path}")
    return path.read_text(encoding="utf-8", errors="ignore").replace("\r\n", "\n")


def clean_text(text: str) -> str:
    text = text.replace("\u2019", "'").replace("\u2018", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r"\^\d*", "", text)
    return text.strip()


def parse_blocks(chunk: str) -> list[str]:
    blocks: list[str] = []
    current: list[str] = []

    def flush() -> None:
        if not current:
            return
        merged = clean_text(" ".join(current))
        if len(merged) >= 8:
            blocks.append(merged)
        current.clear()

    for line in chunk.splitlines():
        stripped = line.strip()
        if not stripped:
            flush()
            continue
        if PAGE_RE.fullmatch(stripped):
            continue
        if CHAPTER_RE.match(stripped):
            flush()
            continue
        if stripped.startswith("©") or stripped.startswith("Printed in"):
            continue
        if FOOTNOTE_RE.match(stripped):
            flush()
            continue
        if re.match(r"^\d+\.\s+[A-Za-z].{0,40}\s+(was|is)\s", stripped):
            flush()
            continue
        if re.match(
            r"^(?:The sages|Suta|Saunaka|Vyasa|Vydsa|Vjdsa|Sanatkumara|Nandin|"
            r"Rudra|Parvati|Uma|Garu4o|Gcru4|Visnu|Brahma|Indra|Krsna|Krishna)\s+said:?$",
            stripped,
            re.I,
        ):
            flush()
            continue
        if re.match(r"^\{.+\}$", stripped):
            flush()
            continue
        if re.match(r"^Section\s+[IVX\d]+$", stripped, re.I):
            flush()
            continue

        match = VERSE_START_RE.match(stripped)
        if match:
            flush()
            current = [match.group(3).strip()]
            continue

        if current:
            if re.match(r"^[A-Za-z]+\s+\d+\s*—", stripped):
                flush()
                continue
            current.append(stripped)

    flush()
    return blocks


def find_samhita_start(text: str, pattern: re.Pattern[str], start: int = 0) -> int:
    """Pick content start, not TOC — marker must be followed by CHAPTER within 400 chars."""
    hits: list[int] = []
    for match in pattern.finditer(text, start):
        window = text[match.start() : match.start() + 400]
        if re.search(r"CHAPTER\s+", window, re.I):
            hits.append(match.start())
    if not hits:
        match = pattern.search(text, start)
        if not match:
            raise ValueError(f"Could not locate {pattern.pattern!r}")
        return match.start()
    return hits[-1]


def build_samhita_sections(part3: str, part4: str) -> dict[int, str]:
    shata = find_samhita_start(part3, SAMHITA_START_RES[7])
    koti = find_samhita_start(part3, SAMHITA_START_RES[8], shata + 1)
    uma3 = find_samhita_start(part3, SAMHITA_START_RES[9], koti + 1)
    uma4_pat = re.compile(r"^umasamhitI\s*$", re.I | re.M)
    uma4 = find_samhita_start(part4, uma4_pat)
    kailasa = find_samhita_start(part4, SAMHITA_START_RES[10], uma4 + 1)
    vayaviya = find_samhita_start(part4, SAMHITA_START_RES[11], kailasa + 1)

    return {
        7: part3[shata:koti],
        8: part3[koti:uma3],
        9: part3[uma3:] + "\n" + part4[uma4:kailasa],
        10: part4[kailasa:vayaviya],
        11: part4[vayaviya:],
    }


def map_sequential(blocks: list[str], verse_count: int) -> list[str]:
    if verse_count <= 0:
        return []
    if not blocks:
        return [""] * verse_count
    if len(blocks) == verse_count:
        return blocks

    mapped: list[str] = []
    cursor = 0
    for index in range(verse_count):
        remaining = verse_count - index
        left = len(blocks) - cursor
        if left <= 0:
            mapped.append(mapped[-1] if mapped else "")
            continue
        if remaining == 1:
            mapped.append(" ".join(blocks[cursor:]))
            break
        take = max(1, round(left / remaining))
        chunk = blocks[cursor : cursor + take]
        cursor += take
        mapped.append(" ".join(chunk))
    while len(mapped) < verse_count:
        mapped.append(mapped[-1] if mapped else "")
    return mapped[:verse_count]


def build_global_stream(sections: dict[int, str], start: int, end: int) -> list[str]:
    stream: list[str] = []
    for chapter_num in range(start, end + 1):
        stream.extend(parse_blocks(sections.get(chapter_num, "")))
    return stream


def global_block_slices(
    scripture_chapters: list[dict],
    stream: list[str],
) -> dict[int, list[str]]:
    eligible = [c for c in scripture_chapters if c["number"] >= FIRST_CHAPTER]
    total_verses = sum(len(c["verses"]) for c in eligible)
    slices: dict[int, list[str]] = {}
    cursor = 0
    verses_done = 0

    for index, chapter in enumerate(eligible):
        verse_count = len(chapter["verses"])
        verses_done += verse_count
        remaining_verses = total_verses - verses_done + verse_count
        remaining_blocks = len(stream) - cursor

        if index == len(eligible) - 1:
            chunk = stream[cursor:]
        else:
            take = max(1, round(remaining_blocks * verse_count / remaining_verses))
            chunk = stream[cursor : cursor + take]
            cursor += take

        slices[chapter["number"]] = chunk

    return slices


def main() -> None:
    part3 = load_raw(PART3_PATH)
    part4 = load_raw(PART4_PATH)
    sections = build_samhita_sections(part3, part4)

    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    global_stream = build_global_stream(sections, FIRST_CHAPTER, 11)
    global_slices = global_block_slices(scripture["chapters"], global_stream)

    cache: dict[str, dict[str, str]] = {}
    stats: list[str] = []

    for chapter in scripture["chapters"]:
        number = chapter["number"]
        if number < FIRST_CHAPTER:
            continue

        blocks = parse_blocks(sections.get(number, ""))
        source = "samhita"

        if not blocks:
            blocks = global_slices.get(number, [])
            source = "global"

        verse_keys = [str(v["number"]) for v in chapter["verses"]]
        translations = map_sequential(blocks, len(verse_keys))

        chapter_cache: dict[str, str] = {}
        for key, text in zip(verse_keys, translations, strict=True):
            cleaned = text.strip()
            if cleaned:
                chapter_cache[key] = cleaned
        cache[str(number)] = chapter_cache
        stats.append(
            f"chapter {number}: {len(chapter_cache)}/{len(verse_keys)} "
            f"(blocks {len(blocks)}, {source})",
        )

    OUT_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(f"Global stream blocks: {len(global_stream)}")
    for line in stats:
        print(f"  {line}")


if __name__ == "__main__":
    main()