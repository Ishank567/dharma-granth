#!/usr/bin/env python3
"""Audit data quality of public/data/scriptures-full/*.json.

Reports, per scripture: verse count, script (devanagari vs romanized IAST),
translation %, Hindi %, and count of header-artifact verses. Used to generate
and refresh DATA_QUALITY_BACKLOG.md.

Run:  python scripts/audit-data-quality.py
"""
import json, glob, re, os

DEV = re.compile(r'[ऀ-ॿ]')
LAT = re.compile(r'[A-Za-z]')
HDR = re.compile(r'^\s*\.\.|##|endtitles', re.I)

def latin_ratio(s: str) -> float:
    d = len(DEV.findall(s or "")); l = len(LAT.findall(s or ""))
    return l / (d + l) if (d + l) else 0.0

def main() -> None:
    base = os.path.join(os.path.dirname(__file__), "..", "public", "data", "scriptures-full")
    print(f"{'id':22s}{'verses':>8}{'script':>11}{'tr%':>5}{'hi%':>5}{'hdr':>5}")
    for f in sorted(glob.glob(os.path.join(base, "*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        vs = [v for c in d.get("chapters", []) for v in c.get("verses", [])]
        if not vs:
            print(f"{d.get('id'):22s}{'EMPTY':>8}"); continue
        n = len(vs)
        san = [v for v in vs if (v.get("sanskrit") or "").strip()]
        tr = sum(1 for v in vs if (v.get("translation") or "").strip())
        hi = sum(1 for v in vs if (v.get("hindi") or "").strip())
        mid = san[len(san) // 2]["sanskrit"] if san else ""
        script = "romanized" if latin_ratio(mid) > 0.5 else "devanagari"
        hdr = sum(1 for v in vs if HDR.search((v.get("sanskrit") or "")[:30]))
        print(f"{d.get('id'):22s}{n:>8}{script:>11}{round(100*tr/n):>5}{round(100*hi/n):>5}{hdr:>5}")

if __name__ == "__main__":
    main()
