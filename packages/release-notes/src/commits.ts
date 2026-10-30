import { execFileSync } from "node:child_process";

export type Commit = {
  id: string;
  subject: string;
  body: string;
};

const FIELD_SEPARATOR = "\x1f";
const RECORD_SEPARATOR = "\x1e";

const git = (args: string[]): string =>
  execFileSync("git", args, {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });

export const isKnownCommit = (commit: string): boolean => {
  try {
    git(["cat-file", "-e", `${commit}^{commit}`]);
    return true;
  } catch {
    return false;
  }
};

export const listNonMergeCommits = (previousCommit: string, currentCommit: string): Commit[] => {
  const output = git([
    "log",
    "--no-merges",
    "--reverse",
    `--format=%H${FIELD_SEPARATOR}%s${FIELD_SEPARATOR}%b${RECORD_SEPARATOR}`,
    `${previousCommit}..${currentCommit}`,
  ]);

  return output
    .split(RECORD_SEPARATOR)
    .map((record) => record.trim())
    .filter((record) => record !== "")
    .map((record) => {
      const [id = "", subject = "", body = ""] = record.split(FIELD_SEPARATOR);
      return { id, subject, body: body.trim() };
    });
};
