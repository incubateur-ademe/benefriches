#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Usage: $(basename "$0") <csv-path> <user-id> [output-csv]

Runs the full ADEME reconversion-projects analysis pipeline:
  1. Cleanup — delete existing sites/projects for <user-id>
  2. Strip  — remove trailing empty rows from <csv-path>
  3. Import — create sites + projects + compute impacts
  4. Export — write impacts to <output-csv> (default: ademe-impacts-export.csv)

<user-id> must be the dedicated ADEME-analysis user (see README).
EOF
  exit 1
}

[[ $# -lt 2 ]] && usage

CSV_PATH="$1"
USER_ID="$2"
OUTPUT_CSV="${3:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/ademe-impacts-export.csv}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"

cd "$API_DIR"

IMPORT_DIR="src/reconversion-projects/adapters/secondary/ademe-csv-import"

echo "▶️  Step 1/4 — Cleanup existing data for user $USER_ID"
pnpm exec tsx "$IMPORT_DIR/delete-ademe-user-data.ts" "$USER_ID"

echo "▶️  Step 2/4 — Strip trailing empty rows from $CSV_PATH"
pnpm exec tsx "$IMPORT_DIR/stripTrailingEmptyCsvRows.ts" "$CSV_PATH"

echo "▶️  Step 3/4 — Import CSV (sites + projects + impacts)"
pnpm exec tsx "$IMPORT_DIR/import-ademe-csv.ts" "$CSV_PATH" "$USER_ID"

echo "▶️  Step 4/4 — Export impacts CSV to $OUTPUT_CSV"
pnpm exec tsx "$IMPORT_DIR/export-ademe-impacts-csv.ts" "$USER_ID" "$OUTPUT_CSV"

echo "✅ Done. Impacts exported to: $OUTPUT_CSV"
