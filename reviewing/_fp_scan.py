# -*- coding: utf-8 -*-
"""AI 指纹硬闸机器清点：破折号 + 超限长句。
用法: python reviewing/_fp_scan.py [--quiet]
闸值: zh 破折号(——)≤3 且单句≤60字; en em-dash(—)≤3 且单句≤40词。
跳过 essay-censorship-without-censor（2026-10-23 已审）。
"""
import re, sys, glob, os

HOME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = {"essay-censorship-without-censor.md"}

def strip_frontmatter(t):
    m = re.match(r"^---\n.*?\n---\n", t, flags=re.S)
    return (t[m.end():] if m else t), (t[:m.end()] if m else "")

def clean(body):
    # 去掉标题行/水平线/引用标记，避免标题与首句黏连造成长句假阳性
    lines = []
    for ln in body.split("\n"):
        s = ln.strip()
        if not s or s.startswith("#") or re.fullmatch(r"-{3,}", s):
            continue
        s = re.sub(r"^[>\-*]\s+", "", s)          # 引用与列表标记
        s = s.strip("*").strip()                   # 行尾斜体星号
        lines.append(s)
    return " ".join(lines)

def scan(path, lang):
    t = open(path, encoding="utf-8").read()
    body, fm = strip_frontmatter(t)
    # 直接引语（> 引用块）为原文照录，不可为闸值改写：硬闸豁免引用块。
    # 替换为句号占位以插入句界，避免引用块前后的正文被拼成一句（黏连假阳性）。
    body = "\n".join(
        "。" if ln.lstrip().startswith(">") else ln for ln in body.split("\n")
    )
    cap, dlimit = (60, 3) if lang == "zh" else (40, 3)
    if lang == "zh":
        dashes = len(re.findall(r"——", body))
        stray = len(re.findall(r"(?<!—)—(?!—)", body))
    else:
        dashes = body.count("—")
        stray = 0
    fm_dashes = len(re.findall(r"—", fm))
    text = clean(body)
    if lang == "zh":
        sents = [s for s in re.split(r"[。！？]", text) if s.strip()]
        lens = [len(re.sub(r"\s", "", s)) for s in sents]
    else:
        sents = [s for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
        lens = [len(s.split()) for s in sents]
    over = [(l, re.sub(r"\s+", " ", s)[:52]) for s, l in zip(sents, lens) if l > cap]
    return {
        "file": path.replace("\\", "/").replace(HOME.replace("\\", "/") + "/", ""),
        "dashes": dashes, "stray": stray, "fm_dashes": fm_dashes,
        "n_sent": len(sents), "max_sent": max(lens) if lens else 0,
        "over": over, "fail": dashes > dlimit or len(over) > 0,
    }

rows = []
for p in sorted(glob.glob(os.path.join(HOME, "posts", "*.md"))):
    if os.path.basename(p) not in SKIP:
        rows.append(scan(p, "zh"))
for p in sorted(glob.glob(os.path.join(HOME, "posts", "en", "*.md"))):
    if os.path.basename(p) not in SKIP:
        rows.append(scan(p, "en"))

quiet = "--quiet" in sys.argv
nfail = 0
for r in rows:
    if r["fail"]:
        nfail += 1
        print(f"[FAIL] {r['file']}: 破折号={r['dashes']}(fm={r['fm_dashes']}) 最长句={r['max_sent']} 超限句={len(r['over'])}")
        for l, prev in r["over"]:
            print(f"    ({l}) {prev}...")
    elif not quiet:
        print(f"[ok]   {r['file']}: 破折号={r['dashes']} 最长句={r['max_sent']}")
print(f"\n== {len(rows)} 篇扫描完成, 超标 {nfail} 篇 ==")
