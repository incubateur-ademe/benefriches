// Real processes: git worktrees, pnpm, Docker. Takes a few minutes; needs Docker running.
// Worktrees are checked out from the current tracked changes (`git stash create` builds a
// commit object without touching the stash list), so uncommitted compose edits are tested.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";

import { ENV_FILE, envDown, envUp, portsForSlot } from "./env.ts";

const repo = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const git = (...args: string[]) => execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" });
const sh = (cwd: string, cmd: string, args: string[]) =>
  execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

const [SLOT_A, SLOT_B, SLOT_TAKEN, SLOT_BROKEN] = [92, 93, 94, 95];
const tmp = mkdtempSync(join(tmpdir(), "adw-env-"));
const worktreeA = join(tmp, "a");
const worktreeB = join(tmp, "b");

const containers = (slot: number) =>
  sh(repo, "docker", [
    "ps",
    "-aq",
    "--filter",
    `label=com.docker.compose.project=benefriches-e2e-${slot}`,
  ]).trim();
const psql = (worktree: string, sql: string) =>
  sh(worktree, "docker", [
    "compose",
    "--env-file",
    ".env.e2e",
    "--env-file",
    ENV_FILE,
    "-f",
    "docker-compose.e2e.yml",
    "exec",
    "-T",
    "postgres",
    "psql",
    "-U",
    "postgres",
    "-d",
    "benefriches_e2e_tests_db",
    "-tAc",
    sql,
  ]).trim();

describe("e2e environment per port slot", { timeout: 20 * 60_000 }, () => {
  before(() => {
    const snapshot = git("stash", "create").trim() || git("rev-parse", "HEAD").trim();
    for (const dir of [worktreeA, worktreeB]) git("worktree", "add", "--detach", dir, snapshot);
  });

  after(async () => {
    await Promise.allSettled([SLOT_A, SLOT_B, SLOT_TAKEN].map((slot) => envDown(worktreeA, slot)));
    for (const dir of [worktreeA, worktreeB]) git("worktree", "remove", "--force", dir);
    rmSync(tmp, { recursive: true, force: true });
  });

  it("brings two slots up at the same time, each healthy with its own env file", async () => {
    const [a, b] = await Promise.all([envUp(worktreeA, SLOT_A), envUp(worktreeB, SLOT_B)]);
    assert.equal(a.outcome, "ready", JSON.stringify(a));
    assert.equal(b.outcome, "ready", JSON.stringify(b));

    const envFile = readFileSync(join(worktreeB, ENV_FILE), "utf8");
    const { web, api, mailcatcherUi, database } = portsForSlot(SLOT_B);
    assert.match(envFile, new RegExp(`^BASE_URL=http://localhost:${web}$`, "m"));
    assert.match(envFile, new RegExp(`^API_URL=http://localhost:${api}/api$`, "m"));
    assert.match(envFile, new RegExp(`^MAILCATCHER_URL=http://localhost:${mailcatcherUi}$`, "m"));
    assert.match(envFile, new RegExp(`^DATABASE_URL=postgresql://.+@localhost:${database}/`, "m"));

    for (const { vars } of [a, b] as Extract<typeof a, { outcome: "ready" }>[]) {
      assert.equal((await fetch(`${vars.API_URL}/healthcheck`)).status, 200);
    }
  });

  it("removes containers and volume on env down, and the next env up starts empty", async () => {
    psql(worktreeA, "create table adw_marker (id int)");
    const volume = sh(repo, "docker", [
      "inspect",
      `benefriches-e2e-${SLOT_A}-postgres-1`,
      "--format",
      "{{range .Mounts}}{{.Name}}{{end}}",
    ]).trim();

    await envDown(worktreeA);
    assert.equal(containers(SLOT_A), "");
    assert.throws(() => sh(repo, "docker", ["volume", "inspect", volume]));

    const again = await envUp(worktreeA, SLOT_A);
    assert.equal(again.outcome, "ready", JSON.stringify(again));
    assert.equal(psql(worktreeA, "select to_regclass('adw_marker') is null"), "t");
  });

  it("fails with the compose output when a port of the slot is taken", async () => {
    // Held by a container: Docker Desktop (macOS) publishes over a plain host socket.
    const port = portsForSlot(SLOT_TAKEN).web;
    const blocker = sh(repo, "docker", [
      "run",
      "-d",
      "--rm",
      "-p",
      `${port}:1080`,
      "dockage/mailcatcher",
    ]).trim();
    try {
      const result = await envUp(worktreeB, SLOT_TAKEN);
      assert.ok(result.outcome === "env-failed", JSON.stringify(result));
      assert.equal(result.step, "compose up");
      assert.match(result.command, /docker compose .* up/);
      assert.match(result.output, new RegExp(`${port}.*(already allocated|in use)`));
      assert.equal(containers(SLOT_TAKEN), "", "the half-started stack is removed");
    } finally {
      sh(repo, "docker", ["rm", "-f", blocker]);
    }
  });

  it("fails at install or shared build without starting the stack", async () => {
    const broken = join(tmp, "broken");
    mkdirSync(join(broken, "packages/shared"), { recursive: true });
    writeFileSync(join(broken, ".env.e2e"), readFileSync(join(repo, ".env.e2e")));
    const root = { name: "broken", private: true, dependencies: { shared: "workspace:*" } };
    const unpublished = { ...root, dependencies: { "adw-env-no-such-package": "1.0.0" } };
    writeFileSync(join(broken, "package.json"), JSON.stringify(unpublished));
    writeFileSync(join(broken, "pnpm-workspace.yaml"), "packages:\n  - packages/*\n");
    const shared = {
      name: "shared",
      private: true,
      scripts: { build: "echo tsc exploded && exit 1" },
    };
    writeFileSync(join(broken, "packages/shared/package.json"), JSON.stringify(shared));

    const installFails = await envUp(broken, SLOT_BROKEN);
    assert.ok(installFails.outcome === "env-failed", JSON.stringify(installFails));
    assert.equal(installFails.step, "install");
    assert.match(installFails.command, /^pnpm install/);
    assert.match(installFails.output, /lockfile/i);

    writeFileSync(join(broken, "package.json"), JSON.stringify(root));
    sh(broken, "pnpm", ["install"]);
    const buildFails = await envUp(broken, SLOT_BROKEN);
    assert.ok(buildFails.outcome === "env-failed");
    assert.equal(buildFails.step, "shared build");
    assert.match(buildFails.output, /tsc exploded/);

    assert.equal(containers(SLOT_BROKEN), "");
  });
});
