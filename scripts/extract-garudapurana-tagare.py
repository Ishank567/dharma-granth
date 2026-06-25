"""Extract Garuda Purana English from Tagare OCR (Motilal Banarsidass).

Sources:
  - Part I (Purva khanda ch 1-146): dli.bengal.10689.20541
  - Part II (ch 147-240 + Dharma khanda ch 1-20): dli.bengal.10689.21508
  - Part III (Dharma khanda ch 21-49 + Brahma khanda ch 1-29): dli.bengal.10689.12942

GRETIL JSON has 317 global chapters (Book 1: 1-239, Book 2: 240-288, Book 3: 289-317).
Tagare OCR uses per-khanda numbering in parts II-III; this script flattens to global numbers.
Chapters 1-3 keep curated highlights.

Output: scripts/cache/garudapurana-translations.json

Run: python scripts/extract-garudapurana-tagare.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PART1_PATH = ROOT / "scripts/cache/garuda-part1-djvu.txt"
PART2_PATH = ROOT / "scripts/cache/garuda-part2-djvu.txt"
PART3_PATH = ROOT / "scripts/cache/garuda-part3-djvu.txt"
JSON_PATH = ROOT / "public/data/scriptures-full/garudpurana.json"
OUT_PATH = ROOT / "scripts/cache/garudapurana-translations.json"
FIRST_CHAPTER = 4
LAST_SOURCE_CHAPTER = 317
BOOK2_GLOBAL_START = 240
BOOK3_GLOBAL_START = 289

CHAPTER_RE = re.compile(r"^CHAPTER\s+(.+?)\s*$", re.I | re.M)
VERSE_START_RE = re.compile(r"^(\d{1,3}|l)(?:-(\d{1,3})?[a-z])?\.\s+(.+)", re.I)
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
    ("ghaptestone", "chapterone"),
    ("hve", "five"),
    ("8ixty", "sixty"),
    ("8eventy", "seventy"),
    ("8ix", "six"),
    ("nptytwo", "fiftytwo"),
    ("fifittthree", "fiftythree"),
    ("fdftyfoint", "fortyfour"),
    ("nfiftyfive", "fiftyfive"),
    ("fifitsix", "fiftysix"),
    ("piptyseven", "fiftyseven"),
    ("fdtynine", "fiftynine"),
    ("sdcty", "sixty"),
    ("sxxty", "sixty"),
    ("sdctyeight", "sixtyeight"),
    ("slxtynine", "sixtynine"),
    ("sevep4tyeight", "seventyeight"),
    ("seventynlne", "seventynine"),
    ("eigrty", "eighty"),
    ("fortyeigrt", "fortyeight"),
    ("forty8ix", "fortysix"),
    ("twentt8even", "twentyseven"),
    ("twentynine", "twentynine"),
    ("huptored", "hundred"),
    ("hunderd", "hundred"),
    ("hxindred", "hundred"),
    ("hu?h>r£d", "hundred"),
    ("thdltyeigirr", "thirtyeight"),
    ("thirtysdc", "thirtysix"),
    ("thirty-.nine", "thirtynine"),
    ("thirty-eight", "thirtyeight"),
    ("forty-seven", "fortyseven"),
    ("forty-eight", "fortyeight"),
    ("twenty-eight", "twentyeight"),
    ("twenty-two", "twentytwo"),
    ("twentyone", "twentyone"),
    ("twentytwo", "twentytwo"),
    ("twentythree", "twentythree"),
    ("twentyfour", "twentyfour"),
    ("twentyfive", "twentyfive"),
    ("twentysix", "twentysix"),
    ("twentyseven", "twentyseven"),
    ("twentyeight", "twentyeight"),
    ("twentynine", "twentynine"),
    ("thirtyone", "thirtyone"),
    ("thirtytwo", "thirtytwo"),
    ("thirtythree", "thirtythree"),
    ("thirtyfour", "thirtyfour"),
    ("thirtyfive", "thirtyfive"),
    ("thirtysix", "thirtysix"),
    ("thirtyseven", "thirtyseven"),
    ("thirtyeight", "thirtyeight"),
    ("thirtynine", "thirtynine"),
    ("fortyone", "fortyone"),
    ("fortytwo", "fortytwo"),
    ("fortythree", "fortythree"),
    ("fortyfour", "fortyfour"),
    ("fortyfive", "fortyfive"),
    ("fortysix", "fortysix"),
    ("fortyseven", "fortyseven"),
    ("fortyeight", "fortyeight"),
    ("fortynine", "fortynine"),
    ("fiftyone", "fiftyone"),
    ("fiftytwo", "fiftytwo"),
    ("fiftythree", "fiftythree"),
    ("fiftyfour", "fiftyfour"),
    ("fiftyfive", "fiftyfive"),
    ("fiftysix", "fiftysix"),
    ("fiftyseven", "fiftyseven"),
    ("fiftyeight", "fiftyeight"),
    ("fiftynine", "fiftynine"),
    ("sixtyone", "sixtyone"),
    ("sixtytwo", "sixtytwo"),
    ("sixtythree", "sixtythree"),
    ("sixtyfour", "sixtyfour"),
    ("sixtyfive", "sixtyfive"),
    ("sixtysix", "sixtysix"),
    ("sixtyseven", "sixtyseven"),
    ("sixtyeight", "sixtyeight"),
    ("sixtynine", "sixtynine"),
    ("seventyone", "seventyone"),
    ("seventytwo", "seventytwo"),
    ("seventythree", "seventythree"),
    ("seventyfour", "seventyfour"),
    ("seventyfive", "seventyfive"),
    ("seventysix", "seventysix"),
    ("seventyseven", "seventyseven"),
    ("seventyeight", "seventyeight"),
    ("seventynine", "seventynine"),
    ("eightyone", "eightyone"),
    ("eightytwo", "eightytwo"),
    ("eightyfour", "eightyfour"),
    ("eightyfive", "eightyfive"),
    ("eightysix", "eightysix"),
    ("eightyseven", "eightyseven"),
    ("eightyeight", "eightyeight"),
    ("eightynine", "eightynine"),
    ("ninetyone", "ninetyone"),
    ("nxnetytwo", "ninetytwo"),
    ("ninetythree", "ninetythree"),
    ("ninetyfour", "ninetyfour"),
    ("ninetyfive", "ninetyfive"),
    ("ninetysix", "ninetysix"),
    ("ninetyeight", "ninetyeight"),
    ("ninetynine", "ninetynine"),
)


def preprocess_text(text: str) -> str:
    text = text.replace("\r\n", "\n")
    text = re.sub(r"GHAPTE\S*ONE", "CHAPTER ONE", text, flags=re.I)
    text = re.sub(r"CHAPTER\s+ONE\s+HXINDRED", "CHAPTER ONE HUNDRED", text, flags=re.I)
    text = re.sub(r"CHAPTER\s+ONE\s+HUNDR\b", "CHAPTER ONE HUNDRED", text, flags=re.I)
    text = re.sub(r"CHAPTER\s+ONE\s+HUNDRED\s+AND\s+HVE\b", "CHAPTER ONE HUNDRED AND FIVE", text, flags=re.I)
    text = re.sub(r"CHAPTER\s+ONE\s+HUNDRED\s+AND\s+TT\b", "CHAPTER ONE HUNDRED AND THIRTEEN", text, flags=re.I)
    text = re.sub(r"CHAPTER\s+TWO\s+HUNDRED\s+AND\s+Tt\b", "CHAPTER TWO HUNDRED AND THIRTY", text, flags=re.I)
    text = re.sub(r"CHAPTER\s+TWO\s+HUNDRED\s+AND\s+H\b", "CHAPTER TWO HUNDRED AND THIRTYTHREE", text, flags=re.I)
    text = re.sub(r"CHAPTER\s+TE\b", "CHAPTER TWENTYNINE", text, flags=re.I | re.M)
    text = re.sub(r"CHAPTER\s+Tt\b", "CHAPTER THIRTY", text, flags=re.I | re.M)
    text = re.sub(r"CHAPTER\s+TK\b", "CHAPTER THIRTYONE", text, flags=re.I | re.M)
    text = re.sub(r"CHAPTER\s+Tf\b", "CHAPTER THIRTYTWO", text, flags=re.I | re.M)
    text = re.sub(r"CHAPTER\s+T¥\b", "CHAPTER THIRTYFIVE", text, flags=re.I | re.M)
    text = re.sub(r"CHAPTER\s+TT\b", "CHAPTER THIRTYSEVEN", text, flags=re.I | re.M)
    return text


def load_raw(path: Path) -> str:
    if not path.exists():
        raise FileNotFoundError(f"Missing {path}")
    return preprocess_text(path.read_text(encoding="utf-8", errors="ignore"))


def load_part(text: str, anchor: str) -> str:
    start = text.find(anchor)
    if start < 0:
        raise ValueError(f"Could not locate anchor {anchor!r}")
    return text[start:]


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
        if suffix.startswith("and"):
            suffix = suffix[3:]
        base = (WORD_ONES[prefix] if prefix else 1) * 100
        if not suffix:
            return base
        suffix_val = parse_compound_number(suffix)
        return base + (suffix_val or 0) if suffix_val else base

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
    return parse_compound_number(normalize_chapter_words(raw))


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
            r"^(?:Fire-god|The sages|Suta|Agni|Visnu|Brahma|Markandeya|Rudra|Hari|Garuda|"
            r"The lord|Thi saga|Gcru4|Garu4o)\s+said:?$",
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
            if chapter_num < 1 or chapter_num > LAST_SOURCE_CHAPTER:
                continue
            existing = merged.get(chapter_num, "")
            if len(body) > len(existing):
                merged[chapter_num] = body
    return merged


def load_part1_chapters(text: str) -> dict[int, str]:
    ch2 = text.find("CHAPTER TWO")
    if ch2 < 0:
        raise ValueError("Could not locate CHAPTER TWO in part 1")
    ch1_anchor = text.rfind("CHAPTER ONE", 0, ch2)
    if ch1_anchor < 0:
        ch1_anchor = text.rfind("GHAPTE", 0, ch2)
    ch1_end = text.find("\n", ch1_anchor) if ch1_anchor >= 0 else ch2
    ch1_body = text[ch1_end:ch2]
    rest = split_chapters(text[ch2:])
    return {1: ch1_body, **rest}


def load_part2_chapters(text: str) -> dict[int, str]:
    anchor = "CHAPTER ONE HUNDRED AND FORTYSEVEN"
    start = text.find(anchor)
    if start < 0:
        anchor = "CHAPTER ONE HUNDRED AND FORTYSEVEN^"
        start = text.find(anchor)
    if start < 0:
        raise ValueError("Could not locate part 2 purva-khanda start")

    restart = text.find("CHAPTER ONE", text.find("CHAPTER TWO HUNDRED AND FORTY"))
    if restart < 0:
        restart = text.find("BRAHMA (MORJ^A) KLArSTDA")
    if restart < 0:
        raise ValueError("Could not locate part 2 Dharma-khanda restart")

    purva = split_chapters(text[start:restart])
    book2_local = split_chapters(text[restart:])

    result: dict[int, str] = dict(purva)
    for local_num, body in book2_local.items():
        result[BOOK2_GLOBAL_START - 1 + local_num] = body
    return result


def load_part3_chapters(text: str) -> dict[int, str]:
    book2_start = text.find("CHAPTER TWENTYONE")
    if book2_start < 0:
        raise ValueError("Could not locate part 3 Dharma-khanda continuation")

    book3_marker = text.find("BRAHMA (MORJ^A) KLArSTDA")
    if book3_marker < 0:
        book3_marker = text.find("Classification of the Pitrinas")
    if book3_marker < 0:
        raise ValueError("Could not locate part 3 Brahma-khanda start")

    book3_ch1 = text.find("CHAPTER ONE", book3_marker)
    if book3_ch1 < 0:
        raise ValueError("Could not locate part 3 CHAPTER ONE")

    book2_local = split_chapters(text[book2_start:book3_ch1])
    book3_local = split_chapters(text[book3_ch1:])

    result: dict[int, str] = {}
    for local_num, body in book2_local.items():
        if local_num >= 21:
            result[BOOK2_GLOBAL_START - 1 + local_num] = body
    for local_num, body in book3_local.items():
        result[BOOK3_GLOBAL_START - 1 + local_num] = body
    return result


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
    part1_text = load_raw(PART1_PATH)
    part2_text = load_raw(PART2_PATH)
    part3_text = load_raw(PART3_PATH)

    raw_chapters = merge_chapter_sources(
        load_part1_chapters(part1_text),
        load_part2_chapters(part2_text),
        load_part3_chapters(part3_text),
    )

    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    global_stream = build_global_blocks(raw_chapters, FIRST_CHAPTER, LAST_SOURCE_CHAPTER)
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
    print(f"Detected source chapters: {len(raw_chapters)} (max {max(raw_chapters, default=0)})")
    print(f"Global stream blocks: {len(global_stream)}")
    missing_nums = [
        n for n in range(FIRST_CHAPTER, LAST_SOURCE_CHAPTER + 1) if n not in raw_chapters
    ]
    if missing_nums:
        print(f"Missing source chapters: {len(missing_nums)} — {missing_nums[:15]}")
    empty = [int(k) for k, v in cache.items() if not v]
    if empty:
        print(f"Empty chapters: {empty[:20]}{'...' if len(empty) > 20 else ''}")
    for line in stats[:10]:
        print(f"  {line}")
    if len(stats) > 10:
        print(f"  ... {len(stats) - 10} more chapters")


if __name__ == "__main__":
    main()