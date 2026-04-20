// oxlint-disable no-console
import fs from "node:fs";
import path from "node:path";

const parseDelimiter = (args: string[]): string => {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === undefined) continue;
    if (arg.startsWith("--delimiter=")) {
      return arg.slice("--delimiter=".length);
    }
    if (arg === "--delimiter") {
      const next = args[i + 1];
      if (next !== undefined) {
        return next;
      }
    }
  }
  return ";";
};

const stripTrailingEmptyRows = (filePath: string, delimiter: string): number => {
  const text = fs.readFileSync(filePath, "utf-8");
  const lines = text.split(/\r?\n/);

  // split on trailing newline introduces a trailing empty string; normalize by
  // always treating the last element as part of the data set (matches Python's splitlines semantics
  // when we re-join with "\n" + final newline).
  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }

  const originalCount = lines.length;

  while (lines.length > 0) {
    const last = lines[lines.length - 1];
    if (last === undefined) break;
    if (last.replaceAll(delimiter, "").trim() !== "") break;
    lines.pop();
  }

  const removed = originalCount - lines.length;

  if (removed > 0) {
    fs.writeFileSync(filePath, lines.join("\n") + "\n", "utf-8");
  }

  return removed;
};

const csvPath = process.argv[2];

if (!csvPath) {
  console.error(
    "Usage: pnpm exec tsx src/reconversion-projects/adapters/secondary/ademe-csv-import/stripTrailingEmptyCsvRows.ts <csv-path> [--delimiter ;]",
  );
  process.exit(1);
}

const resolvedPath = path.resolve(csvPath);

if (!fs.existsSync(resolvedPath)) {
  console.error(`Error: ${csvPath} not found`);
  process.exit(1);
}

const delimiter = parseDelimiter(process.argv.slice(3));
const removed = stripTrailingEmptyRows(resolvedPath, delimiter);
console.info(`Removed ${removed} trailing empty row(s) from ${csvPath}`);
