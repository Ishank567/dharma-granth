"""Probe archive.org Hindi DJVU for a given identifier."""
from __future__ import annotations

import json
import sys
import urllib.parse
import urllib.request

IDENT = sys.argv[1] if len(sys.argv) > 1 else "BkzO_brihadaranyaka-upanishad-gita-press"


def main() -> None:
    meta = json.loads(
        urllib.request.urlopen(
            urllib.request.Request(
                f"https://archive.org/metadata/{IDENT}",
                headers={"User-Agent": "Mozilla/5.0"},
            ),
            timeout=30,
        ).read(),
    )
    txts = [
        f["name"]
        for f in meta.get("files", [])
        if "djvu.txt" in f.get("name", "") or f.get("name", "").endswith(".txt")
    ]
    print("files:", txts[:5])
    fname = txts[0] if txts else f"{IDENT}_djvu.txt"
    url = f"https://archive.org/download/{IDENT}/{urllib.parse.quote(fname)}"
    text = (
        urllib.request.urlopen(
            urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}),
            timeout=120,
        )
        .read(120000)
        .decode("utf-8", "replace")
    )
    dev = sum(1 for c in text if "\u0900" <= c <= "\u097f")
    print(f"len={len(text)} dev={dev} ratio={dev / max(len(text), 1):.2f}")
    for pat in ["बृहदारण्यक", "छान्दोग्य", "प्रथम", "अध्याय", "भावार्थ", "॥"]:
        print(pat, text.count(pat))
    print(text[8000:14000])


if __name__ == "__main__":
    main()