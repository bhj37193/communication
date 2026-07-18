#!/usr/bin/env python3
"""
Batch-transcribe every .mp4 in the Stage Bundle into a mirrored transcripts/ tree.

    python3 batch_transcribe.py [--workers N] [--dry-run]

- Mirrors the source folder structure under ./transcripts/
- Each  <...>/foo.mp4  ->  ./transcripts/<...>/foo.md
- Skips files whose .md already exists (safe to re-run / resume)
- Runs transcribe.py per file; a failure logs and continues (never aborts the run)
- Progress + failures written to ./transcripts/_batch.log
"""
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(
    HERE,
    "Vinh Giang - Stage Bundle (3xSTAGE Programs + Live Q&A)",
    "Vinh Giang - Stage Bundle (3xSTAGE Programs + Live Q&A)",
)
OUT_ROOT = os.path.join(HERE, "transcripts")
LOG = os.path.join(OUT_ROOT, "_batch.log")


def find_videos():
    vids = []
    for root, _, files in os.walk(SRC):
        for fn in files:
            if fn.lower().endswith(".mp4"):
                vids.append(os.path.join(root, fn))
    return sorted(vids)


def out_path_for(video):
    rel = os.path.relpath(video, SRC)
    rel_md = os.path.splitext(rel)[0] + ".md"
    return os.path.join(OUT_ROOT, rel_md)


def log(msg):
    with open(LOG, "a") as f:
        f.write(msg + "\n")
    print(msg, flush=True)


def do_one(video):
    out = out_path_for(video)
    if os.path.exists(out):
        return ("skip", video, None)
    proc = subprocess.run(
        [sys.executable, os.path.join(HERE, "transcribe.py"), video, out],
        capture_output=True, text=True,
    )
    if proc.returncode != 0:
        # Don't leave a half-written file around
        if os.path.exists(out):
            os.remove(out)
        return ("fail", video, proc.stderr.strip()[-500:])
    return ("ok", video, None)


def main():
    workers = 3
    dry = False
    args = sys.argv[1:]
    if "--dry-run" in args:
        dry = True
    if "--workers" in args:
        workers = int(args[args.index("--workers") + 1])

    videos = find_videos()
    todo = [v for v in videos if not os.path.exists(out_path_for(v))]
    done = len(videos) - len(todo)

    print(f"Total videos: {len(videos)}")
    print(f"Already transcribed: {done}")
    print(f"To do: {len(todo)}")
    print(f"Workers: {workers}")

    if dry:
        for v in todo[:10]:
            print("  would do:", os.path.relpath(v, SRC))
        if len(todo) > 10:
            print(f"  ... and {len(todo) - 10} more")
        return

    os.makedirs(OUT_ROOT, exist_ok=True)
    log(f"=== batch start: {len(todo)} to do, {done} already done ===")

    ok = fail = 0
    n = len(todo)
    with ThreadPoolExecutor(max_workers=workers) as ex:
        futs = {ex.submit(do_one, v): v for v in todo}
        for i, fut in enumerate(as_completed(futs), 1):
            status, video, err = fut.result()
            rel = os.path.relpath(video, SRC)
            if status == "ok":
                ok += 1
                log(f"[{i}/{n}] OK   {rel}")
            elif status == "fail":
                fail += 1
                log(f"[{i}/{n}] FAIL {rel}\n        {err}")
            else:
                log(f"[{i}/{n}] SKIP {rel}")

    log(f"=== batch done: {ok} ok, {fail} failed ===")
    print(f"\nDONE. {ok} transcribed, {fail} failed. Log: {LOG}")


if __name__ == "__main__":
    main()
