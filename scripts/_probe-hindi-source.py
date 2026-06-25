"""Probe archive.org Hindi OCR sources."""
from __future__ import annotations

import json
import urllib.parse
import urllib.request

IDENT = "ChandogyaUpanishadWithHindiTike1929NawalKishorPress"


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
    print("files:", txts[:10])
    fname = txts[0] if txts else f"{IDENT}_djvu.txt"
    url = f"https://archive.org/download/{IDENT}/{urllib.parse.quote(fname)}"
    text = (
        urllib.request.urlopen(
            urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}),
            timeout=120,
        )
        .read(80000)
        .decode("utf-8", "replace")
    )
    dev = sum(1 for c in text if "\u0900" <= c <= "\u097f")
    print(f"len={len(text)} dev={dev} ratio={dev / max(len(text), 1):.2f}")
    print(text[3000:7000])


if __name__ == "__main__":
    main()