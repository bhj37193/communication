#!/usr/bin/env bash
# Ralph-style refresh loop for the charisma build.
# Run this in a SEPARATE terminal/pane. It drives a Claude Code worker running in tmux.
#
# Usage:  ./loop.sh <tmux-target>        e.g.  ./loop.sh charisma:0.0   (session:window.pane)
# Find the target with:  tmux list-panes -a -F '#{session_name}:#{window_index}.#{pane_index}'
set -euo pipefail

W="${1:?pass the tmux target, e.g. charisma:0.0}"
DIR="/Users/main/Desktop/Active Projects/communication"
HANDOFF="$DIR/HANDOFF.md"
SENTINEL="PRIMER UPDATED - READY TO CLEAR"
POLL=15          # seconds between checks
MAX_CYCLES="${2:-50}"

send_handoff() {
  tmux load-buffer -b handoff "$HANDOFF"
  tmux paste-buffer -b handoff -t "$W"
  sleep 1
  tmux send-keys -t "$W" Enter
}

wait_for_sentinel() {
  # returns 0 when the worker prints the sentinel in its visible pane
  while true; do
    if tmux capture-pane -p -t "$W" | grep -qF "$SENTINEL"; then return 0; fi
    sleep "$POLL"
  done
}

echo "Driving worker at $W. Ctrl-C to stop."
send_handoff
for ((i=1; i<=MAX_CYCLES; i++)); do
  wait_for_sentinel
  echo "[cycle $i] sentinel seen -> clearing + re-sending handoff"
  tmux send-keys -t "$W" "/clear" Enter
  sleep 3
  send_handoff
  sleep 3   # let the fresh turn start so we don't match the previous sentinel
done
echo "Reached MAX_CYCLES=$MAX_CYCLES; stopping."
