#!/usr/bin/env python3
"""Render the Biblical Archaeology Encyclopedia from its database.

Source of truth: public/Archaeology/data/sites.json
Output:          public/Archaeology/<id>.html, public/Archaeology/index.html

    python3 scripts/build_archaeology.py          # build
    python3 scripts/build_archaeology.py --check  # validate only (exit 1 on problems)

House rules the checker enforces: every entry cites sources, and no consensus
language ("scholars agree", "definitive proof", ...) stands in for evidence.
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ARCH = ROOT / "public" / "Archaeology"
DB = ARCH / "data" / "sites.json"
if "--db" in sys.argv:
    DB = Path(sys.argv[sys.argv.index("--db") + 1])
if "--out" in sys.argv:
    ARCH = Path(sys.argv[sys.argv.index("--out") + 1])
SITE = "https://nephilim-wars.pages.dev/Archaeology/"

PERIODS = [
    ("primeval", "Primeval History (Genesis 1–11)"),
    ("patriarchal", "Patriarchal Period (Genesis)"),
    ("exodus-conquest", "Exodus & Conquest Period"),
    ("united-monarchy", "United Monarchy Period"),
    ("divided-kingdom-israel", "Divided Kingdom - Israel (North)"),
    ("divided-kingdom-judah", "Divided Kingdom - Judah (South)"),
    ("exile-postexile", "Exile & Post-Exile Period"),
    ("second-temple", "Second Temple Period"),
]

BANNED = re.compile(
    r"scholarly consensus|consensus|scholars (agree|believe|debate)|most scholars|"
    r"widely (accepted|believed|held)|cannot be overstated|definitive(ly)? prov|"
    r"\bfringe\b|mainstream|it is (generally )?believed",
    re.I,
)

e = lambda s: html.escape(str(s or ""), quote=True)


def check(db):
    problems = []
    ids = set()
    for s in db["sites"]:
        sid = s.get("id", "?")
        if sid in ids:
            problems.append(f"{sid}: duplicate id")
        ids.add(sid)
        for k in ("name", "period_id", "overview", "sources"):
            if not s.get(k):
                problems.append(f"{sid}: missing {k}")
        if s.get("period_id") not in dict(PERIODS):
            problems.append(f"{sid}: unknown period_id {s.get('period_id')!r}")
        if not any(src.get("url") for src in s.get("sources", [])):
            problems.append(f"{sid}: no source carries a URL")
        text = json.dumps({k: v for k, v in s.items() if k not in ("corrections", "sources")}, ensure_ascii=False)
        for m in BANNED.finditer(text):
            problems.append(f"{sid}: consensus language {m.group(0)!r}")
    return problems


def ul(items, cls="plain"):
    return f'<ul class="{cls}">' + "".join(f"<li>{e(i)}</li>" for i in items) + "</ul>" if items else ""


def page(s, by_id):
    ph = s.get("physical") or {}
    disc = s.get("discovery") or {}
    facts = [("Date", s.get("date")), ("How dated", s.get("date_basis"))]
    found = ", ".join(x for x in (disc.get("when"), disc.get("who"), disc.get("where")) if x)
    facts += [("Discovered", found), ("Now held", s.get("location"))]
    facts += [(k.title(), ph.get(k)) for k in ("material", "dimensions", "script", "language")]
    fact_html = "".join(f'<li><span class="fact-label">{e(k)}</span>{e(v)}</li>' for k, v in facts if v)

    bib = "".join(
        f'<li><span class="ref">{e(b.get("ref"))}</span>{e(b.get("tie"))}</li>' for b in s.get("biblical", [])
    )

    body = [f"<h2>Overview</h2>" + "".join(f"<p>{e(p)}</p>" for p in s.get("overview", []))]
    t = s.get("text")
    if t and t.get("quote"):
        label = "In its own words" if t.get("quote_type") == "verbatim" else "What the text says (summary)"
        body.append(
            f'<h2>{label}</h2><blockquote class="inscription-box">{e(t["quote"])}'
            f'<cite>{e(t.get("translation"))}</cite></blockquote>'
        )
    if s.get("evidence"):
        body.append("<h2>What the evidence shows</h2>" + ul(s["evidence"], "evidence"))
    if s.get("questions"):
        body.append("<h2>Open questions</h2>" + ul(s["questions"], "questions"))
    ups = s.get("updates") or []
    if ups:
        items = "".join(
            f'<li><span class="when">{e(u.get("date"))}</span>{e(u.get("what"))}'
            + (f' <a href="#src{u["source_index"] + 1}">[{u["source_index"] + 1}]</a>' if isinstance(u.get("source_index"), int) else "")
            + "</li>"
            for u in ups
        )
        body.append(f'<h2>Since 2024</h2><ul class="updates">{items}</ul>')
    srcs = "".join(
        f'<li id="src{i + 1}">{e(x.get("cite"))}'
        + (f' <a href="{e(x["url"])}" rel="noopener" target="_blank">link</a>' if x.get("url") else "")
        + (f' <span class="kind">{e(x.get("kind"))}</span>' if x.get("kind") else "")
        + "</li>"
        for i, x in enumerate(s.get("sources", []))
    )
    body.append(f'<h2>Sources</h2><ol class="sources">{srcs}</ol>')
    if s.get("corrections"):
        body.append(
            '<details class="corrections"><summary>Corrected from the earlier edition of this page</summary>'
            + ul(s["corrections"]) + "</details>"
        )
    checked = s.get("checked_through")
    if s.get("currency_note"):
        body.append(f'<p class="checked">2024–2026 check incomplete: {e(s["currency_note"])}</p>')
    elif checked:
        body.append(f'<p class="checked">Checked against new publications through {e(checked)}.</p>')

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{e(s['name'])} - Biblical Archaeology Encyclopedia</title>
<meta name="description" content="{e(s.get('subtitle'))}">
<link rel="canonical" href="{SITE}{e(s['id'])}.html">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="archaeology.css">
</head>
<body class="entry">
<nav><a href="index.html">← Back to Index</a></nav>
<div class="wrapper">
<header><h1>{e(s['name'])}</h1><p>{e(s.get('subtitle'))}</p></header>
<main>
{''.join(body)}
</main>
<aside class="sidebar">
<div class="fact-box"><h3>The Find</h3><ul class="fact-list">{fact_html}</ul></div>
{'<div class="fact-box"><h3>Biblical Passages</h3><ul class="fact-list bib">' + bib + '</ul></div>' if bib else ''}
</aside>
</div>
</body>
</html>
"""


def index(db):
    sections = []
    for pid, title in PERIODS:
        rows = sorted((s for s in db["sites"] if s["period_id"] == pid), key=lambda s: s.get("sort", s["name"]))
        if not rows:
            continue
        cards = "".join(
            f'<li class="discovery-card"><h3 class="discovery-title"><a href="{e(s["id"])}.html">{e(s["name"])}</a></h3>'
            f'<div class="meta-data">{e(s.get("subtitle"))}'
            + (f'<br><span class="meta-label">Passages:</span> {e(", ".join(b["ref"] for b in s.get("biblical", [])[:4]))}' if s.get("biblical") else "")
            + (f'<br><span class="meta-label">Now held:</span> {e(s.get("location"))}' if s.get("location") else "")
            + "</div>"
            + (f'<p class="significance">{e(s["evidence"][0])}</p>' if s.get("evidence") else "")
            + "</li>"
            for s in rows
        )
        sections.append(
            f'<section class="period-section" id="{pid}"><h2 class="period-title">{e(title)}</h2>'
            f'<ul class="discovery-list">{cards}</ul></section>'
        )
    n = len(db["sites"])
    partial = sum(1 for s in db["sites"] if s.get("currency_note"))
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Biblical Archaeology Encyclopedia</title>
<link rel="canonical" href="{SITE}index.html">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="archaeology.css">
</head>
<body class="index">
<header><h1>Biblical Archaeology Encyclopedia</h1>
<p>Archives of the Nephilim Wars &amp; Ancient History</p>
<p class="standard">{n} finds · every claim carries its source, and each page says what could not be confirmed · checked for new publications through {e(db.get('checked_through'))} ({partial} pages note a partial check)</p></header>
<div class="container">
{''.join(sections)}
</div>
</body>
</html>
"""


def main():
    db = json.loads(DB.read_text())
    problems = check(db)
    for p in problems:
        print("PROBLEM", p)
    if "--check" in sys.argv:
        sys.exit(1 if problems else 0)
    by_id = {s["id"]: s for s in db["sites"]}
    for s in db["sites"]:
        (ARCH / f"{s['id']}.html").write_text(page(s, by_id))
    (ARCH / "index.html").write_text(index(db))
    print(f"built {len(db['sites'])} pages + index ({len(problems)} problems)")


if __name__ == "__main__":
    main()
