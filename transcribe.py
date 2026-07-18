#!/usr/bin/env python3
"""
Video -> Deepgram transcript -> Markdown.

Usage:
    python3 transcribe.py "<video.mp4>" "<output.md>"

Reads DEEPGRAM_API_KEY from ./.env . Extracts audio with ffmpeg (mono 16kHz FLAC,
tiny + lossless for speech), sends to Deepgram pre-recorded (nova-3), and writes a
clean Markdown transcript with timestamped paragraphs. Speaker labels only appear
when more than one speaker is detected.
"""
import json
import os
import subprocess
import sys
import tempfile
from datetime import date

DG_URL = (
    "https://api.deepgram.com/v1/listen"
    "?model=nova-3"
    "&smart_format=true"
    "&punctuate=true"
    "&paragraphs=true"
    "&diarize=true"
    "&utterances=true"
)


def load_api_key(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line.startswith("DEEPGRAM_API_KEY="):
                return line.split("=", 1)[1].strip()
    raise SystemExit("DEEPGRAM_API_KEY not found in .env")


def extract_audio(video_path, flac_path):
    subprocess.run(
        ["ffmpeg", "-y", "-i", video_path,
         "-vn", "-ac", "1", "-ar", "16000", "-c:a", "flac", flac_path],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def transcribe(flac_path, api_key):
    # Use curl (system CA store) to dodge python.org framework SSL cert issues.
    proc = subprocess.run(
        ["curl", "-sS", "--fail-with-body", "-X", "POST", DG_URL,
         "-H", f"Authorization: Token {api_key}",
         "-H", "Content-Type: audio/flac",
         "--data-binary", f"@{flac_path}"],
        capture_output=True,
        text=True,
        timeout=1800,
    )
    if proc.returncode != 0:
        raise SystemExit(f"Deepgram request failed (curl {proc.returncode}): {proc.stdout or proc.stderr}")
    return json.loads(proc.stdout)


def ts(seconds):
    seconds = int(seconds)
    h, rem = divmod(seconds, 3600)
    m, s = divmod(rem, 60)
    if h:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"


def to_markdown(dg, title, source_rel):
    alt = dg["results"]["channels"][0]["alternatives"][0]
    para_block = alt.get("paragraphs", {}) or {}
    paragraphs = para_block.get("paragraphs", []) or []

    # Auto-detect: only label speakers when it's a genuinely multi-speaker
    # recording. Diarization often invents a phantom minority speaker on solo
    # monologues, so we suppress labels unless the second speaker holds a real
    # share of the words (>= 15%).
    words_by_speaker = {}
    for p in paragraphs:
        spk = p.get("speaker")
        n = sum(len(s["text"].split()) for s in p.get("sentences", []))
        words_by_speaker[spk] = words_by_speaker.get(spk, 0) + n
    total_words = sum(words_by_speaker.values()) or 1
    minority_share = (
        sorted(words_by_speaker.values(), reverse=True)[1] / total_words
        if len(words_by_speaker) > 1 else 0
    )
    multi = minority_share >= 0.15

    dur = dg.get("metadata", {}).get("duration", 0)

    lines = [
        "---",
        f"title: {title}",
        f"source: {source_rel}",
        f"duration: {ts(dur)}",
        "model: deepgram nova-3",
        f"speakers: {'multi' if multi else 'single'} ({len(words_by_speaker)} detected, minority {minority_share:.0%})",
        f"transcribed: {date.today().isoformat()}",
        "---",
        "",
        f"# {title}",
        "",
    ]

    if not paragraphs:
        # Fallback: flat transcript with no paragraph structure
        lines.append(alt.get("transcript", "").strip())
        return "\n".join(lines) + "\n"

    last_speaker = None
    for p in paragraphs:
        text = " ".join(s["text"] for s in p.get("sentences", [])).strip()
        if not text:
            continue
        stamp = ts(p.get("start", 0))
        if multi and p.get("speaker") != last_speaker:
            last_speaker = p.get("speaker")
            lines.append(f"**Speaker {last_speaker}** `[{stamp}]`")
            lines.append("")
            lines.append(text)
        else:
            lines.append(f"`[{stamp}]` {text}")
        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def main():
    if len(sys.argv) != 3:
        raise SystemExit("Usage: python3 transcribe.py <video> <output.md>")
    video_path, out_path = sys.argv[1], sys.argv[2]
    here = os.path.dirname(os.path.abspath(__file__))
    api_key = load_api_key(os.path.join(here, ".env"))

    title = os.path.splitext(os.path.basename(video_path))[0]
    source_rel = os.path.basename(video_path)

    with tempfile.NamedTemporaryFile(suffix=".flac", delete=False) as tmp:
        flac_path = tmp.name
    try:
        print(f"[1/3] extracting audio: {title}", file=sys.stderr)
        extract_audio(video_path, flac_path)
        print("[2/3] transcribing via Deepgram...", file=sys.stderr)
        dg = transcribe(flac_path, api_key)
        print("[3/3] writing markdown...", file=sys.stderr)
        md = to_markdown(dg, title, source_rel)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w") as f:
            f.write(md)
        print(f"DONE -> {out_path}", file=sys.stderr)
    finally:
        if os.path.exists(flac_path):
            os.remove(flac_path)


if __name__ == "__main__":
    main()
