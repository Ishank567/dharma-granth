"""Extract cleaner Pargiter English for Durga Saptashati from wisdomlib HTML caches.

Source: F. E. Pargiter 1904 (public domain), hosted on wisdomlib.org cantos 81–93.
Prerequisite: scripts/cache/wisdomlib-canto-{81..93}.html
Output: scripts/cache/durgasaptashati-translations.json

Run: python scripts/extract-durgasaptashati-wisdomlib.py
"""
from __future__ import annotations

import html as html_lib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "scripts" / "cache"
JSON_PATH = ROOT / "public/data/scriptures-full/durgasaptashati.json"
OUT_PATH = CACHE / "durgasaptashati-translations.json"

# wisdomlib canto number → Durga chapter
CANTO_TO_CHAPTER = {81 + i: i + 1 for i in range(13)}


def clean_text(text: str) -> str:
    text = html_lib.unescape(text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    return text.strip()


def is_junk(text: str) -> bool:
    s = text.strip()
    if len(s) < 20:
        return True
    lower = s.lower()
    if lower.startswith("this page relates"):
        return True
    if "patreon" in lower or "newsletter" in lower:
        return True
    if "isbn-" in lower:
        return True
    if "frederick eden pargiter" in lower:
        return True
    if lower.startswith("king suratha being defeated") and "took refuge" in lower:
        # page summary, not a verse
        return True
    return False


def extract_paragraphs(html: str) -> list[str]:
    blocks = re.findall(r"<p[^>]*>(.*?)</p>", html, flags=re.I | re.S)
    out: list[str] = []
    for block in blocks:
        text = clean_text(block)
        if text and not is_junk(text):
            out.append(text)
    return out


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


def main() -> None:
    scripture = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    cache: dict[str, dict[str, str]] = {}

    for canto, chapter_num in CANTO_TO_CHAPTER.items():
        path = CACHE / f"wisdomlib-canto-{canto}.html"
        if not path.exists():
            print(f"missing {path.name}")
            continue
        chapter = next(c for c in scripture["chapters"] if c["number"] == chapter_num)
        paras = extract_paragraphs(path.read_text(encoding="utf-8", errors="ignore"))
        keys = [str(v["number"]) for v in chapter["verses"]]
        mapped = map_sequential(paras, len(keys))
        chapter_cache = {
            key: text
            for key, text in zip(keys, mapped, strict=True)
            if text.strip() and not is_junk(text)
        }
        cache[str(chapter_num)] = chapter_cache
        print(
            f"ch {chapter_num} (canto {canto}): "
            f"{len(chapter_cache)}/{len(keys)} from {len(paras)} paragraphs"
        )

    OUT_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
