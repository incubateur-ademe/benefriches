import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { findHookBypass } from "./block-hook-bypass.mjs";

const scriptPath = path.join(import.meta.dirname, "block-hook-bypass.mjs");

const MUST_BLOCK = [
  "git commit --no-verify",
  "git commit -m x --no-verify",
  "git commit -n -m x",
  "git commit -nm x",
  "git commit -anm x",
  "git commit --amend --no-edit --no-verify",
  "git commit --no-veri -m x",
  "git -C apps/web commit -n -m x",
  "/usr/bin/git commit --no-verify -m x",
  "rtk git commit -n -m x",
  "pnpm lint && git commit -n -m x",
  "git add .; git commit --no-verify",
  "git -c core.hooksPath=/dev/null commit -m x",
  "HUSKY=0 git commit -m x",
  'bash -c "git commit -n -m x"',
  "git commit -m \"$(cat <<'EOF'\nmsg\nEOF\n)\" --no-verify",
  "git commit -F - <<EOF --no-verify\nmsg\nEOF",
  "cat <<'MSG-END'\ndon't\nMSG-END\ngit commit -n",
  "cat <<< foo\ngit commit -n",
  "git commit -m x -n",
  "git commit -C HEAD -n",
  "git commit $'--no-verify'",
  "env HUSKY=0 git commit -m x",
  "export HUSKY=0; git commit -m x",
  "sudo -u bob git commit -n",
  "echo | xargs git commit -n",
  "{ git commit -n; }",
  "if true; then git commit -n; fi",
  "GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.hooksPath GIT_CONFIG_VALUE_0=/dev/null git commit -m x",
  "git --config-env=core.hooksPath=HOME commit -m x",
  "git -c alias.ci='commit --no-verify' ci -m x",
  "git config core.hooksPath /dev/null && git commit -m x",
];

const MUST_ALLOW = [
  "git commit -m x",
  'git commit -m "-n"',
  "git commit -m-n",
  'git commit -am "-n"',
  'git commit -m "mention --no-verify"',
  "git commit -F - <<'EOF'\n-n --no-verify don't \"quoted\"\nEOF\n",
  "git commit -m x -- -n",
  "git push -n",
  "git push --no-verify",
  "git log -n 5",
  "grep -n foo f && git commit -m x",
  'echo "git commit --no-verify"',
  "git status",
  "git config --get core.hooksPath",
  "git -c user.name=x commit -m y",
  "HUSKY=1 git commit -m x",
  "",
];

test("blocks every pre-commit bypass form", () => {
  for (const command of MUST_BLOCK) {
    const reason = findHookBypass(command);
    assert.ok(reason, `expected to block: ${command}`);
  }
});

test("allows commands that are not a bypass", () => {
  for (const command of MUST_ALLOW) {
    const reason = findHookBypass(command);
    assert.equal(reason, null, `expected to allow: ${command}, got: ${reason}`);
  }
});

function runCli(command) {
  const payload = JSON.stringify({
    tool_name: "Bash",
    tool_input: { command },
  });
  return spawnSync(process.execPath, [scriptPath], {
    input: payload,
    encoding: "utf8",
  });
}

test("checks argv-style commands", () => {
  assert.ok(findHookBypass(["bash", "-lc", "git commit -n -m x"]));
  assert.equal(findHookBypass(["git", "commit", "-m", "-n"]), null);
});

test("CLI exits 2 with a pre-commit message on a bypass", () => {
  const result = runCli("git commit --no-verify");
  assert.equal(result.status, 2);
  assert.match(result.stderr, /pre-commit/);
});

test("CLI exits 0 on an allowed command", () => {
  const result = runCli("git commit -m x");
  assert.equal(result.status, 0);
});

test("CLI exits 0 on invalid JSON on stdin", () => {
  const result = spawnSync(process.execPath, [scriptPath], {
    input: "not json",
    encoding: "utf8",
  });
  assert.equal(result.status, 0);
});
