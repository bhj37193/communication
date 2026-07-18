#!/bin/bash
cd /private/tmp/claude-501/-Users-main-Desktop-transcripts/080704ff-842c-4506-a63b-2e0ee9807ad8/scratchpad/reviews
> low_all.jsonl
> high_all.jsonl
for f in reviews_*.jsonl; do
  appid=$(echo "$f" | sed -E 's/reviews_[0-9]+_([A-Za-z]+)\.jsonl/\1/')
  echo "processing $f -> $appid"
  timeout 15 jq -c --arg app "$appid" '. + {app:$app} | select((.rating|tonumber) <= 2)' "$f" >> low_all.jsonl
  timeout 15 jq -c --arg app "$appid" '. + {app:$app} | select((.rating|tonumber) >= 4)' "$f" >> high_all.jsonl
  echo "done $f"
done
echo "SPLIT_DONE"
