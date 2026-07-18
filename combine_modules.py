#!/usr/bin/env python3
"""
Combine per-video transcripts into one markdown file per module.

    python3 combine_modules.py

For every folder under ./transcripts/ that directly contains .md files, writes a
single combined file to ./transcripts/_combined/<module name>.md :
- videos ordered by their numeric lesson prefix (1.1, 1.1.1, 1.2, ... 1.10)
- each video's YAML frontmatter stripped; its title becomes a `##` section
- a short "duration | speakers" note kept under each title
- a table-of-contents at the top
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "transcripts")
OUT = os.path.join(ROOT, "_combined")


def natural_key(filename):
    """Sort by leading dotted-number prefix, e.g. '2.10.1 Foo' -> (2,10,1)."""
    m = re.match(r"^([\d]+(?:\.[\d]+)*)", filename)
    nums = tuple(int(x) for x in m.group(1).split(".")) if m else ()
    return (nums, filename.lower())


def parse(md_text):
    """Return (title, meta_note, body_without_h1)."""
    lines = md_text.split("\n")
    title, duration, speakers = None, None, None
    body_start = 0
    if lines and lines[0].strip() == "---":
        end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
        if end is not None:
            for fl in lines[1:end]:
                if fl.startswith("title:"):
                    title = fl.split(":", 1)[1].strip()
                elif fl.startswith("duration:"):
                    duration = fl.split(":", 1)[1].strip()
                elif fl.startswith("speakers:"):
                    speakers = fl.split(":", 1)[1].strip()
            body_start = end + 1
    body_lines = lines[body_start:]
    # Drop leading blank lines and the H1 title line
    while body_lines and body_lines[0].strip() == "":
        body_lines.pop(0)
    if body_lines and body_lines[0].startswith("# "):
        if title is None:
            title = body_lines[0][2:].strip()
        body_lines.pop(0)
    body = "\n".join(body_lines).strip()
    note = " | ".join(x for x in [duration, speakers] if x)
    return title or "Untitled", note, body


def combine_folder(folder):
    files = sorted(
        (f for f in os.listdir(folder) if f.endswith(".md")),
        key=natural_key,
    )
    if not files:
        return None
    module_name = os.path.basename(folder)

    entries = []
    for fn in files:
        with open(os.path.join(folder, fn)) as f:
            title, note, body = parse(f.read())
        entries.append((title, note, body))

    out_lines = [f"# {module_name}", ""]
    out_lines.append(f"_{len(entries)} lessons_")
    out_lines.append("")
    out_lines.append("## Contents")
    out_lines.append("")
    for title, _, _ in entries:
        anchor = re.sub(r"[^\w\s-]", "", title).strip().lower().replace(" ", "-")
        out_lines.append(f"- [{title}](#{anchor})")
    out_lines.append("")
    out_lines.append("---")
    out_lines.append("")

    for title, note, body in entries:
        out_lines.append(f"## {title}")
        if note:
            out_lines.append(f"_{note}_")
        out_lines.append("")
        out_lines.append(body)
        out_lines.append("")
        out_lines.append("---")
        out_lines.append("")

    return module_name, "\n".join(out_lines).rstrip() + "\n", len(entries)


def main():
    # Folders that directly contain .md files (skip the output folder itself)
    folders = []
    for dirpath, _, filenames in os.walk(ROOT):
        if os.path.abspath(dirpath).startswith(os.path.abspath(OUT)):
            continue
        if any(f.endswith(".md") for f in filenames):
            folders.append(dirpath)
    folders.sort(key=lambda p: natural_key(os.path.basename(p)))

    os.makedirs(OUT, exist_ok=True)
    total = 0
    print(f"Combining {len(folders)} modules...\n")
    for folder in folders:
        result = combine_folder(folder)
        if not result:
            continue
        module_name, text, n = result
        out_path = os.path.join(OUT, f"{module_name}.md")
        with open(out_path, "w") as f:
            f.write(text)
        total += n
        print(f"  {n:>3} lessons -> _combined/{module_name}.md")
    print(f"\nDONE. {len(folders)} module files, {total} lessons combined.")
    print(f"Output: {OUT}")


if __name__ == "__main__":
    main()
