import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const scriptPath = path.join(import.meta.dirname, "sync-agent-skills.mjs");

function writeSkill(dir, name) {
  const skillDir = path.join(dir, name);
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, "SKILL.md"), `---\nname: ${name}\n---\n`);
}

function runSync(root, ...flags) {
  return spawnSync(process.execPath, [scriptPath, "--root", root, ...flags], {
    encoding: "utf8",
  });
}

function mkRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "agent-skills-"));
}

test("skill created under .claude/skills is moved and linked back", async (t) => {
  const root = mkRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  // Arrange
  writeSkill(path.join(root, ".claude", "skills"), "foo");
  fs.mkdirSync(path.join(root, ".agents", "skills"), { recursive: true });

  // Act
  const result = runSync(root);

  // Assert
  assert.equal(result.status, 0, result.stderr);
  const canonSkillMd = path.join(root, ".agents", "skills", "foo", "SKILL.md");
  assert.equal(fs.readFileSync(canonSkillMd, "utf8"), "---\nname: foo\n---\n");
  const linkPath = path.join(root, ".claude", "skills", "foo");
  assert.equal(fs.lstatSync(linkPath).isSymbolicLink(), true);
  assert.equal(fs.readlinkSync(linkPath), "../../.agents/skills/foo");
  assert.equal(
    fs.readFileSync(path.join(linkPath, "SKILL.md"), "utf8"),
    "---\nname: foo\n---\n",
  );
});

test("skill created under .agents/skills gets its link", async (t) => {
  const root = mkRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  // Arrange
  writeSkill(path.join(root, ".agents", "skills"), "bar");

  // Act
  const result = runSync(root);

  // Assert
  assert.equal(result.status, 0, result.stderr);
  const linkPath = path.join(root, ".claude", "skills", "bar");
  assert.equal(fs.lstatSync(linkPath).isSymbolicLink(), true);
  assert.equal(fs.readlinkSync(linkPath), "../../.agents/skills/bar");
});

test("--check passes on a synced tree", async (t) => {
  const root = mkRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  // Arrange
  writeSkill(path.join(root, ".agents", "skills"), "bar");
  const syncResult = runSync(root);
  assert.equal(syncResult.status, 0, syncResult.stderr);

  // Act
  const result = runSync(root, "--check");

  // Assert
  assert.equal(result.status, 0, result.stderr);
});

test("--check fails on drift and writes nothing", async (t) => {
  const root = mkRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  // Arrange
  writeSkill(path.join(root, ".agents", "skills"), "bar");

  // Act
  const result = runSync(root, "--check");

  // Assert
  assert.equal(result.status, 1);
  assert.match(result.stdout, /pnpm agent-skills:sync/);
  assert.equal(fs.existsSync(path.join(root, ".claude", "skills", "bar")), false);
});

test("a skill that is a real directory in both places is refused", async (t) => {
  const root = mkRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  // Arrange
  writeSkill(path.join(root, ".claude", "skills"), "foo");
  writeSkill(path.join(root, ".agents", "skills"), "foo");

  // Act
  const result = runSync(root);

  // Assert
  assert.equal(result.status, 1);
  assert.match(result.stderr, /both/);
  assert.equal(fs.lstatSync(path.join(root, ".claude", "skills", "foo")).isDirectory(), true);
  assert.equal(fs.lstatSync(path.join(root, ".agents", "skills", "foo")).isDirectory(), true);
});

test("a link to a missing skill is refused", async (t) => {
  const root = mkRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  // Arrange
  fs.mkdirSync(path.join(root, ".claude", "skills"), { recursive: true });
  fs.mkdirSync(path.join(root, ".agents", "skills"), { recursive: true });
  fs.symlinkSync(
    "../../.agents/skills/ghost",
    path.join(root, ".claude", "skills", "ghost"),
  );

  // Act
  const result = runSync(root);

  // Assert
  assert.equal(result.status, 1);
  const linkPath = path.join(root, ".claude", "skills", "ghost");
  assert.equal(fs.lstatSync(linkPath).isSymbolicLink(), true);
});
