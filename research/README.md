# research

The academic grounding behind the 5-skill curriculum: communication, problem-solving,
critical thinking, decision-making, behavior science. Plain text and JSON, ICM-style. The
folder structure tells you what feeds what.

## Layout

```
fetch_literature.py   the fetch script; run it to (re)build literature/
literature/            one JSON file per skill topic + INDEX.md summary
```

## Author vs serve

This folder is reference-only, like `content-library/library/`: nothing in here is read
by the server at runtime. It exists so a human (or an agent drafting curriculum content)
can cite a real paper instead of asserting a claim from memory. Papers here inform
`CONTENT-ROADMAP-4-SKILLS.md` skill definitions and lesson content; they are never served
directly.

## Sources

Four official, free, no-scraping APIs (per `RESEARCH-METHODOLOGY.md`'s "primary source
over scraper" rule):

- **arXiv API** (stdlib-only, no key): CS/HCI/econ preprints.
- **Semantic Scholar Graph API** (no key, rate-limited): psychology/communication
  journals arXiv doesn't index.
- **OpenAlex** (no key): broadest multidisciplinary coverage; DOI, OA status, citation
  counts.
- **Europe PMC** (no key): strongest source for behavior-change literature: habit
  formation, nudge interventions, behavior-change-technique taxonomies.

Elsevier's Scopus Search API was evaluated and excluded: it requires a registered/
institutional API key, so it fails the free-and-open bar the other four clear.

## Fetching

```
SSL_CERT_FILE=$(python3 -m certifi) python3 research/fetch_literature.py
```

(`SSL_CERT_FILE` is only needed if your Python build lacks a working local CA bundle,
e.g. python.org's macOS installer.) Each of the 5 topics is queried against all 4 sources
and written to `literature/<topic>.json`, deduped by lowercased title. Re-runs are
additive: existing papers are merged with the new fetch, never dropped by a thin or
rate-limited run. Every paper record carries its `source` field as provenance.

## Sourcing discipline

Every citation drawn from here into curriculum content follows `RESEARCH-METHODOLOGY.md`
section 4: named source + access date, primary over secondary, and absence of evidence
recorded as a finding, not silently skipped.
