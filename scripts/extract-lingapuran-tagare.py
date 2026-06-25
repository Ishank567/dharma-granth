"""Extract Linga Purana English from Tagare/Shastri OCR (Motilal Banarsidass).

Sources:
  - Part I (ch 1-95): in.ernet.dli.2015.460751
  - Vol 5 gap-fill (ch 4-95): in.ernet.dli.2015.459303
  - Part II (ch 96-108): LingaPuranaJ.L.ShastriPart2

JSON chapters 4-108 map 1:1 to source adhyayas 4-108 (GRETIL rks edition).
Chapters 1-3 keep curated highlights.

Output: scripts/cache/lingapuran-translations.json

Run: python scripts/extract-lingapuran-tagare.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PART1_PATH = ROOT / "scripts/cache/linga-dli-part1-djvu.txt"
VOL5_PATH = ROOT / "scripts/cache/linga-tagare-vol5-djvu.txt"
PART2_PATH = ROOT / "scripts/cache/linga-shastri-part2-djvu.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/lingapuran.json"
OUT_PATH = ROOT / "scripts/cache/lingapuran-translations.json"
FIRST_CHAPTER = 4
LAST_CHAPTER = 108

CHAPTER_RE = re.compile(r"^CHAPTER\s+(.+?)\s*$", re.I | re.M)
CHAPTER_108_RE = re.compile(r"^CHAPTER\s*\]\s*$", re.I | re.M)
RED_AND_EIGHT_RE = re.compile(r"^RED\s+AND\s+EIGHT\s*$", re.I | re.M)
VERSE_START_RE = re.compile(r"^(\d{1,3})(?:-(\d{1,3}))?\.\s+(.+)")
PAGE_RE = re.compile(r"^\d{1,3}$")
FOOTNOTE_RE = re.compile(r"^\d{1,3}\.\s+[A-Za-z^]+\s*[—\-]")

WORD_ONES = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
    "thirty": 30,
    "forty": 40,
    "fifty": 50,
    "sixty": 60,
    "seventy": 70,
    "eighty": 80,
    "ninety": 90,
}

OCR_FIXES = (
    ("5ix", "six"),
    ("5ev", "sev"),
    ("sol", "six"),
    ("ninetysek", "ninetysix"),
    ("ninetydght", "ninetyeight"),
    ("ninetyn1ne", "ninetynine"),
    ("sixtysek", "sixtysix"),
    ("eightysek", "eightysix"),
    ("sixttseven", "sixtyseven"),
    ("sktynine", "sixtynine"),
    ("seveniyeight", "seventyeight"),
    ("seventtnine", "seventynine"),
    ("thmtytwo", "thirtytwo"),
    ("thirttytwo", "thirtytwo"),
    ("thirttfivb", "thirtyfive"),
    ("thmtyelght", "thirtyeight"),
    ("thmtyeigilt", "thirtyeight"),
    ("thlrty", "thirty"),
    ("thiknfflvb", "thirtyfive"),
    ("fiftysu", "fiftysix"),
    ("fbftyfour", "fiftyfour"),
    ("mgettyfour", "eightyfour"),
    ("twentyei ght", "twentyeight"),
    ("twentynbve", "twentynine"),
    ("thirtyttve", "thirtyfive"),
    ("hundredandeight", "onehundredeight"),
    ("redandeight", "onehundredeight"),
)


def preprocess_text(text: str) -> str:
    text = text.replace("\r\n", "\n")
    text = re.sub(r"^CHAPTER\s*\]\s*$", "CHAPTER ONE HUNDRED EIGHT", text, flags=re.I | re.M)
    text = re.sub(r"^RED\s+AND\s+EIGHT\s*$", "", text, flags=re.I | re.M)
    return text


def load_part1() -> str:
    if not PART1_PATH.exists():
        raise FileNotFoundError(f"Missing {PART1_PATH}")
    text = PART1_PATH.read_text(encoding="utf-8", errors="ignore")
    anchor = "CHAPTER ONE"
    start = text.find(anchor)
    if start < 0:
        raise ValueError("Could not locate Linga Purana Part I body")
    return preprocess_text(text[start:])


def load_vol5() -> str:
    if not VOL5_PATH.exists():
        return ""
    text = VOL5_PATH.read_text(encoding="utf-8", errors="ignore")
    anchor = "CHAPTER  FOUR"
    start = text.find(anchor)
    if start < 0:
        start = text.find("CHAPTER FOUR")
    if start < 0:
        return ""
    return preprocess_text(text[start:])


def load_part2() -> str:
    if not PART2_PATH.exists():
        raise FileNotFoundError(f"Missing {PART2_PATH}")
    text = PART2_PATH.read_text(encoding="utf-8", errors="ignore")
    anchor = "CHAPTER NINETYSEK"
    start = text.find(anchor)
    if start < 0:
        anchor = "CHAPTER NINETY SIX"
        start = text.find(anchor)
    if start < 0:
        raise ValueError("Could not locate Linga Purana Part II body")

    tail = text[start:]
    duplicate = re.search(r"^CHAPTER ONE\s*$", tail[500:], re.I | re.M)
    if duplicate:
        tail = tail[: 500 + duplicate.start()]
    return preprocess_text(tail)


def normalize_chapter_words(raw: str) -> str:
    token = raw.lower().strip()
    token = re.sub(r"[^a-z0-9\- ]", " ", token)
    token = re.sub(r"\s+", " ", token)
    for src, dst in OCR_FIXES:
        token = token.replace(src, dst)
    token = token.replace("-", "")
    token = token.replace(" ", "")
    return token


def parse_compound_number(token: str) -> int | None:
    if not token:
        return None

    if token in WORD_ONES:
        return WORD_ONES[token]

    hundred_match = re.fullmatch(
        r"(one|two|three|four|five|six|seven|eight|nine)?(hundred)(.+)?",
        token,
    )
    if hundred_match:
        prefix = hundred_match.group(1)
        suffix = hundred_match.group(3) or ""
        base = (WORD_ONES[prefix] if prefix else 1) * 100
        if not suffix:
            return base
        suffix_val = parse_compound_number(suffix)
        return base + (suffix_val or 0) if suffix_val else base

    one_hundred_match = re.fullmatch(
        r"onehundred(and)?(one|two|three|four|five|six|seven|eight|nine|ten|"
        r"eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|"
        r"twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)?",
        token,
    )
    if one_hundred_match:
        suffix = one_hundred_match.group(2)
        if not suffix:
            return 100
        suffix_val = parse_compound_number(suffix)
        return 100 + (suffix_val or 0) if suffix_val else 100

    match = re.fullmatch(
        r"(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(one|two|three|four|five|six|seven|eight|nine)?",
        token,
    )
    if match:
        base = WORD_ONES[match.group(1)]
        suffix = match.group(2)
        return base + (WORD_ONES[suffix] if suffix else 0)

    return None


def chapter_words_to_number(raw: str) -> int | None:
    token = normalize_chapter_words(raw)
    if "hundredand" in token:
        suffix = token.split("hundredand", 1)[1]
        suffix_val = parse_compound_number(suffix)
        if suffix_val:
            return 100 + suffix_val
    return parse_compound_number(token)


def clean_text(text: str) -> str:
    text = text.replace("\u2019", "'").replace("\u2018", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r"\^\d*", "", text)
    return text.strip()


def parse_chapter_blocks(chunk: str) -> list[str]:
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
        if CHAPTER_RE.match(stripped) or CHAPTER_108_RE.match(stripped):
            flush()
            continue
        if RED_AND_EIGHT_RE.match(stripped):
            continue
        if stripped.startswith("©") or stripped.startswith("Printed in"):
            continue
        if FOOTNOTE_RE.match(stripped):
            flush()
            continue
        if re.match(
            r"^(?:Sri\s+)?(?:Markandeya|Yudhisthira|Vyasa|Narada|Brahma|Suta|"
            r"The sages|Stita|Sata)\s+said:?$",
            stripped,
            re.I,
        ):
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


def split_chapters(text: str) -> dict[int, str]:
    markers: list[tuple[int, int, int]] = []
    for match in CHAPTER_RE.finditer(text):
        chapter_num = chapter_words_to_number(match.group(1))
        if not chapter_num:
            continue
        markers.append((match.start(), match.end(), chapter_num))

    seen: set[int] = set()
    unique: list[tuple[int, int, int]] = []
    for item in markers:
        if item[2] in seen:
            continue
        seen.add(item[2])
        unique.append(item)

    chapters: dict[int, str] = {}
    for index, (_start, end, chapter_num) in enumerate(unique):
        next_start = unique[index + 1][0] if index + 1 < len(unique) else len(text)
        chapters[chapter_num] = text[end:next_start]
    return chapters


def merge_chapter_sources(*sources: dict[int, str]) -> dict[int, str]:
    merged: dict[int, str] = {}
    for source in sources:
        for chapter_num, body in source.items():
            if chapter_num < FIRST_CHAPTER or chapter_num > LAST_CHAPTER:
                continue
            existing = merged.get(chapter_num, "")
            if len(body) > len(existing):
                merged[chapter_num] = body
    return merged


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


def build_global_blocks(chapters: dict[int, str], start: int, end: int) -> list[str]:
    stream: list[str] = []
    for chapter_num in range(start, end + 1):
        stream.extend(parse_chapter_blocks(chapters.get(chapter_num, "")))
    return stream


def global_block_slices(
    scripture_chapters: list[dict],
    stream: list[str],
) -> dict[int, list[str]]:
    eligible = [chapter for chapter in scripture_chapters if chapter["number"] >= FIRST_CHAPTER]
    total_verses = sum(len(chapter["verses"]) for chapter in eligible)
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
    part1 = split_chapters(load_part1())
    vol5 = split_chapters(load_vol5()) if VOL5_PATH.exists() else {}
    part2 = split_chapters(load_part2())
    raw_chapters = merge_chapter_sources(part1, vol5, part2)

    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    global_stream = build_global_blocks(raw_chapters, FIRST_CHAPTER, LAST_CHAPTER)
    global_slices = global_block_slices(scripture["chapters"], global_stream)

    cache: dict[str, dict[str, str]] = {}
    stats: list[str] = []

    for chapter in scripture["chapters"]:
        number = chapter["number"]
        if number < FIRST_CHAPTER:
            continue

        body = raw_chapters.get(number, "")
        blocks = parse_chapter_blocks(body)
        source = "chapter"

        if not blocks:
            blocks = global_slices.get(number, [])
            source = "global"

        verse_keys = [str(verse["number"]) for verse in chapter["verses"]]
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
    print(f"Detected chapters: {len(raw_chapters)} (max {max(raw_chapters, default=0)})")
    missing_nums = [n for n in range(FIRST_CHAPTER, LAST_CHAPTER + 1) if n not in raw_chapters]
    if missing_nums:
        print(f"Missing source chapters: {missing_nums}")
    empty = [int(k) for k, v in cache.items() if not v]
    if empty:
        print(f"Empty chapters: {empty}")
    for line in stats[:10]:
        print(f"  {line}")
    if len(stats) > 10:
        print(f"  ... {len(stats) - 10} more chapters")


if __name__ == "__main__":
    main()