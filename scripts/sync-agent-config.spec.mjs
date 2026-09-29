import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const scriptPath = path.join(import.meta.dirname, "sync-agent-config.mjs");

function mkRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "agent-config-"));
}

function writeAgentMd(
  root,
  name,
  {
    description = "A test agent.",
    body = "# Test Agent\n\nDo the thing.",
  } = {},
) {
  const dir = path.join(root, ".claude", "agents");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${name}.md`),
    `---\nname: ${name}\ndescription: ${description}\nmodel: sonnet\n---\n\n${body}\n`,
  );
}

function writeHookScript(root, relPath) {
  const abs = path.join(root, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, "#!/usr/bin/env bash\nexit 0\n");
  fs.chmodSync(abs, 0o755);
}

function writeSettings(root, { includeFormatCheck = true } = {}) {
  writeHookScript(root, ".claude/hooks/block-env-read.sh");
  if (includeFormatCheck)
    writeHookScript(root, ".claude/hooks/format-check.sh");

  const hooks = {
    PreToolUse: [
      {
        matcher: "Bash",
        hooks: [
          {
            type: "command",
            command: "$CLAUDE_PROJECT_DIR/.claude/hooks/block-env-read.sh",
            statusMessage: "Checking command for .env access...",
          },
        ],
      },
    ],
  };
  if (includeFormatCheck) {
    hooks.PostToolUse = [
      {
        matcher: "Edit|Write",
        hooks: [
          {
            type: "command",
            command: "$CLAUDE_PROJECT_DIR/.claude/hooks/format-check.sh",
            statusMessage: "Formatting code with Prettier...",
          },
        ],
      },
    ];
  }

  fs.mkdirSync(path.join(root, ".claude"), { recursive: true });
  fs.writeFileSync(
    path.join(root, ".claude", "settings.json"),
    JSON.stringify(
      { permissions: { allow: [], deny: [], ask: [] }, hooks },
      null,
      2,
    ) + "\n",
  );
}

function writeCodexConfig(
  root,
  content = '[mcp_servers.context7]\ncommand = "pnpm"\n',
) {
  const dir = path.join(root, ".codex");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "config.toml"), content);
}

function baseRepo() {
  const root = mkRepo();
  writeAgentMd(root, "foo");
  writeSettings(root);
  writeCodexConfig(root);
  return root;
}

function runSync(root, ...flags) {
  return spawnSync(process.execPath, [scriptPath, "--root", root, ...flags], {
    encoding: "utf8",
  });
}

test("sync generates the agent TOML and hooks.json, excluding format-check", async (t) => {
  const root = baseRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const result = runSync(root);
  assert.equal(result.status, 0, result.stderr);

  const tomlPath = path.join(root, ".codex", "agents", "foo.toml");
  const toml = fs.readFileSync(tomlPath, "utf8");
  assert.match(
    toml,
    /^# Generated from \.claude\/agents\/foo\.md by `pnpm agent-config:sync`\. Do not edit\.\n/,
  );
  assert.match(toml, /name = "foo"/);
  assert.match(toml, /description = "A test agent\."/);
  assert.match(
    toml,
    /developer_instructions = '''\n# Test Agent\n\nDo the thing\.\n'''/,
  );

  const hooksJson = JSON.parse(
    fs.readFileSync(path.join(root, ".codex", "hooks.json"), "utf8"),
  );
  assert.equal(
    hooksJson.hooks.PreToolUse[0].hooks[0].command,
    '"$(git rev-parse --show-toplevel)"/.claude/hooks/block-env-read.sh',
  );
  assert.equal(hooksJson.hooks.PostToolUse, undefined);
});

test("--check passes right after sync", async (t) => {
  const root = baseRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  assert.equal(runSync(root).status, 0);
  const result = runSync(root, "--check");
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /in sync/);
});

test("--check fails after editing the .md description only", async (t) => {
  const root = baseRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  assert.equal(runSync(root).status, 0);
  writeAgentMd(root, "foo", { description: "A different description." });

  const result = runSync(root, "--check");
  assert.equal(result.status, 1);
  assert.match(result.stdout, /foo\.toml/);
});

test("--check fails after hand-editing the TOML", async (t) => {
  const root = baseRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  assert.equal(runSync(root).status, 0);
  const tomlPath = path.join(root, ".codex", "agents", "foo.toml");
  fs.writeFileSync(
    tomlPath,
    fs.readFileSync(tomlPath, "utf8") + "\n# hand edit\n",
  );

  const result = runSync(root, "--check");
  assert.equal(result.status, 1);
  assert.match(result.stdout, /foo\.toml/);
});

test("an orphan TOML is reported", async (t) => {
  const root = baseRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  assert.equal(runSync(root).status, 0);
  fs.rmSync(path.join(root, ".claude", "agents", "foo.md"));

  const result = runSync(root, "--check");
  assert.equal(result.status, 1);
  assert.match(result.stdout, /orphan .*foo\.toml/);
});

test("a missing backticked path is an error", async (t) => {
  const root = mkRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeAgentMd(root, "foo", {
    body: "See `apps/web/src/does-not-exist.ts` for details.",
  });
  writeSettings(root);
  writeCodexConfig(root);

  const result = runSync(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /references missing path/);
});

test("an absolute path in .codex/config.toml is an error", async (t) => {
  const root = baseRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  assert.equal(runSync(root).status, 0);
  writeCodexConfig(
    root,
    '[mcp_servers.context7]\ncommand = "/Users/someone/.local/bin/pnpm"\n',
  );

  const result = runSync(root, "--check");
  assert.equal(result.status, 1);
  assert.match(result.stdout + result.stderr, /absolute path/);
});

test(".codex/hooks/x.sh is reported as unexpected", async (t) => {
  const root = baseRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  assert.equal(runSync(root).status, 0);
  writeHookScript(root, ".codex/hooks/x.sh");

  const result = runSync(root, "--check");
  assert.equal(result.status, 1);
  assert.match(result.stdout + result.stderr, /unexpected/);
});

test("a body containing ''' is an error", async (t) => {
  const root = mkRepo();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeAgentMd(root, "foo", { body: "Contains a literal ''' triple-quote." });
  writeSettings(root);
  writeCodexConfig(root);

  const result = runSync(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /'''/);
});
