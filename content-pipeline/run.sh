#!/bin/bash
# Run the daily content pipeline: generate media (if possible) then post.
# Usage: ./content-pipeline/run.sh

set -e
cd "$(dirname "$0")"

# Load .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "=== PayAPI Content Pipeline ==="
echo "Date: $(date +%Y-%m-%d)"
echo ""

echo "→ Step 1: Generate media for today..."
node generate-media.js 2>&1 || echo "  (media generation skipped)"

echo ""
echo "→ Step 2: Post today's content..."
node post-daily.js 2>&1

echo ""
echo "=== Done ==="
