#!/usr/bin/env python3
"""Pull academic literature grounding for the 4-skill curriculum + behavior science.

Sources: arXiv API (official, stdlib-only) and Semantic Scholar Graph API
(official, covers psychology/communication journals arXiv doesn't index).
No scraping: both targets expose clean free APIs, so Scrapling isn't needed
here (see RESEARCH-METHODOLOGY.md's "primary source over scraper" rule).

Usage: python3 research/fetch_literature.py
Output: research/literature/<topic>.json + research/literature/INDEX.md
"""
import json
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

OUT_DIR = Path(__file__).parent / "literature"
UA = "charisma-curriculum-research/1.0 (thebohyeon@gmail.com)"
ARXIV_DELAY = 3.0  # arXiv community etiquette: no more than 1 req/3s
S2_DELAY = 1.2

# topic -> (arxiv query, arxiv category filter, semantic scholar query)
TOPICS = {
    "communication": (
        "conversational reciprocity self-disclosure dialogue follow-up questions",
        "cat:cs.CL OR cat:cs.HC OR cat:cs.CY",
        "active listening follow-up questions reciprocal self-disclosure conversation quality",
    ),
    "problem_solving": (
        "root cause analysis diagnostic reasoning hypothesis testing",
        "cat:cs.AI OR cat:cs.CY",
        "clarifying questions before problem solving symptom versus root cause diagnosis",
    ),
    "critical_thinking": (
        "evidence evaluation claim verification argumentation misinformation",
        "cat:cs.CL OR cat:cs.CY",
        "evaluating evidence claims critical thinking skills adults",
    ),
    "decision_making": (
        "decision making under uncertainty tradeoffs cognitive bias",
        "cat:econ.GN OR cat:cs.AI OR cat:q-fin.GN",
        "decision making under tradeoffs commitment cognitive bias adults",
    ),
    "behavior_science": (
        "behavior change intervention habit formation nudge",
        "cat:physics.soc-ph OR cat:q-bio.NC OR cat:econ.GN",
        "behavior change technique taxonomy habit formation nudge intervention",
    ),
}

MAX_RESULTS = 15


def fetch_arxiv(query, category_filter):
    q = f'({urllib.parse.quote(query)}) AND ({category_filter})'
    url = (
        "http://export.arxiv.org/api/query"
        f"?search_query=all:{q}&start=0&max_results={MAX_RESULTS}"
        "&sortBy=relevance&sortOrder=descending"
    )
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = resp.read()
    ns = {"a": "http://www.w3.org/2005/Atom"}
    root = ET.fromstring(raw)
    out = []
    for entry in root.findall("a:entry", ns):
        out.append({
            "source": "arxiv",
            "title": (entry.findtext("a:title", "", ns) or "").strip(),
            "abstract": (entry.findtext("a:summary", "", ns) or "").strip(),
            "authors": [a.findtext("a:name", "", ns) for a in entry.findall("a:author", ns)],
            "year": (entry.findtext("a:published", "", ns) or "")[:4],
            "url": entry.findtext("a:id", "", ns),
        })
    return out


def fetch_semantic_scholar(query):
    params = urllib.parse.urlencode({
        "query": query,
        "fields": "title,abstract,year,authors,venue,url,citationCount",
        "limit": MAX_RESULTS,
    })
    url = f"https://api.semanticscholar.org/graph/v1/paper/search?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read())
            break
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 2:
                time.sleep(5 * (attempt + 1))
                continue
            raise
    out = []
    for p in data.get("data", []):
        if not p.get("abstract"):
            continue
        out.append({
            "source": "semantic_scholar",
            "title": p.get("title", ""),
            "abstract": p.get("abstract", ""),
            "authors": [a.get("name") for a in p.get("authors", [])],
            "year": str(p.get("year", "")),
            "venue": p.get("venue", ""),
            "citation_count": p.get("citationCount", 0),
            "url": p.get("url", ""),
        })
    return out


def dedupe(papers):
    seen, out = set(), []
    for p in papers:
        key = p["title"].strip().lower()
        if key and key not in seen:
            seen.add(key)
            out.append(p)
    return out


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    index_lines = ["# Literature index", "", "Fetched via arXiv API + Semantic Scholar Graph API (no scraping; both are official free APIs).", ""]

    for topic, (arxiv_q, cat_filter, s2_q) in TOPICS.items():
        print(f"[{topic}] querying arXiv...")
        try:
            arxiv_papers = fetch_arxiv(arxiv_q, cat_filter)
        except Exception as e:
            print(f"  arXiv error: {e}")
            arxiv_papers = []
        time.sleep(ARXIV_DELAY)

        print(f"[{topic}] querying Semantic Scholar...")
        try:
            s2_papers = fetch_semantic_scholar(s2_q)
        except Exception as e:
            print(f"  Semantic Scholar error: {e}")
            s2_papers = []
        time.sleep(S2_DELAY)

        papers = dedupe(arxiv_papers + s2_papers)
        out_path = OUT_DIR / f"{topic}.json"
        out_path.write_text(json.dumps(papers, indent=2))
        print(f"  -> {len(papers)} papers -> {out_path}")

        index_lines.append(f"## {topic} ({len(papers)} papers)")
        for p in papers[:8]:
            index_lines.append(f"- [{p['title']}]({p['url']}) ({p['source']}, {p.get('year', '?')})")
        index_lines.append("")

    (OUT_DIR / "INDEX.md").write_text("\n".join(index_lines))
    print(f"\nDone. See {OUT_DIR}/INDEX.md")


if __name__ == "__main__":
    main()
