# ADEME reconversion-projects analysis pipeline

Tooling for one-off impact analyses on batches of reconversion projects financed by ADEME, provided as CSV files by an external partner.

## ⚠️ Data confidentiality

The input/output CSV files and the address cache **must never be committed**. The local `.gitignore` in this folder already excludes:

- `*.csv`
- `address-cache.json`

Keep all analysis files inside this folder so they are covered by the local `.gitignore`.

## Prerequisites

- `pnpm install` has been run at the repo root (pulls in `tsx`, used by the scripts).
- A running database (same as normal dev setup — see root `README.md`).
- A `.env` file in `apps/api/` with a valid `DATABASE_URL`.
- A dedicated user in the `users` table for the analysis (e.g. `ademe-analysis`). **Do not reuse a real user's id**: the pipeline starts by deleting all sites and projects owned by that user.
- The input CSV placed inside this folder (so it's covered by the local `.gitignore`).

## One-shot pipeline

Run from `apps/api/`:

```bash
./src/reconversion-projects/adapters/secondary/ademe-csv-import/run-ademe-analysis.sh \
  <path-to-input.csv> <analysis-user-id> [output.csv]
```

Concrete example (input CSV dropped in this folder):

```bash
./src/reconversion-projects/adapters/secondary/ademe-csv-import/run-ademe-analysis.sh \
  src/reconversion-projects/adapters/secondary/ademe-csv-import/data.csv \
  b562bcb1-0998-49ab-8212-7436603460af
```

If `[output.csv]` is omitted, the output defaults to `ademe-impacts-export.csv` inside this folder (gitignored).

The wrapper:

1. Deletes all sites and projects owned by `<analysis-user-id>` (logs the counts first).
2. Strips trailing empty rows from the input CSV (edits in place).
3. Imports the CSV: creates sites + projects, computes impacts. **Fail-fast on any validation error** — if the file is malformed, nothing is partially imported because step 1 cleaned up first.
4. Exports the per-project impacts CSV.

`set -euo pipefail` stops the pipeline at the first error. The DB-touching scripts exit with code `1` on error (via `process.exitCode`), so `set -e` catches them.

## Individual steps

Each step can also be invoked on its own from `apps/api/`:

```bash
# Cleanup (destructive — no confirmation prompt, relies on the counts log)
pnpm exec tsx src/reconversion-projects/adapters/secondary/ademe-csv-import/delete-ademe-user-data.ts <user-id>

# Strip trailing empty rows
pnpm exec tsx src/reconversion-projects/adapters/secondary/ademe-csv-import/stripTrailingEmptyCsvRows.ts <csv-path> [--delimiter ;]

# Import (creates sites + projects + computes impacts)
pnpm exec tsx src/reconversion-projects/adapters/secondary/ademe-csv-import/import-ademe-csv.ts <csv-path> <user-id> [departments-csv-list]

# Export impacts
pnpm exec tsx src/reconversion-projects/adapters/secondary/ademe-csv-import/export-ademe-impacts-csv.ts <user-id> [output-csv]
```

## Rerunning an analysis

Just relaunch `run-ademe-analysis.sh` with the same `<analysis-user-id>`. The cleanup step runs first, so the pipeline is idempotent.
