// Linear adapter: shells out to the shared benefriches-linear-tasks CLI (linear.mjs), the same
// tool interactive agents use. Anything the runner needs that the CLI lacks belongs in the CLI.
// The token is read once (1Password, through `linear.mjs token`) and passed to every call
// through the environment; it never reaches the agent sessions.
import { execFile } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import process from "node:process";

export type Linear = {
  snapshot(id: string, dir: string): Promise<void>;
  claim(id: string): Promise<void>;
  review(id: string): Promise<void>;
  comment(id: string, file: string): Promise<void>;
};

const DEFAULT_CLI = join(homedir(), ".claude/skills/benefriches-linear-tasks/linear.mjs");

function cli(args: string[], env: Record<string, string> = {}) {
  const path = process.env.ADW_LINEAR_CLI ?? DEFAULT_CLI;
  return new Promise<string>((done, fail) => {
    execFile(
      "node",
      [path, ...args],
      { env: { ...process.env, ...env }, maxBuffer: 16 * 1024 * 1024 },
      (error, stdout, stderr) =>
        error
          ? fail(new Error(`linear.mjs ${args[0]} failed: ${stderr || error.message}`))
          : done(stdout.trim()),
    );
  });
}

export async function linearCli(): Promise<Linear> {
  const token = process.env.LINEAR_TOKEN ?? (await cli(["token"]));
  const call = async (...args: string[]) => {
    await cli(args, { LINEAR_TOKEN: token });
  };
  return {
    snapshot: (id, dir) => call("snapshot", id, dir),
    claim: (id) => call("claim", id),
    review: (id) => call("review", id),
    comment: (id, file) => call("comment", id, "--file", file),
  };
}
