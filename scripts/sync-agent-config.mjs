#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const CODEX_EVENTS = [
  "SessionStart",
  "UserPromptSubmit",
  "PreToolUse",
  "PostToolUse",
  "Stop",
];

const CLAUDE_ONLY_HOOKS = {
  "format-check.sh": "Codex apply_patch input has no tool_input.file_path",
};

const PATH_PREFIXES = [
  ".claude/",
  ".agents/",
  ".codex/",
  "apps/",
  "packages/",
  "scripts/",
  "docs/",
];
const ABSOLUTE_PATH_RE =
  /(\/Users\/|\/home\/|\/private\/|\/tmp\/|\/var\/folders\/|[A-Za-z]:\\)/;

function isDotEntry(name) {
  return name.startsWith(".");
}

/**
 * Minimal YAML frontmatter parser: `key: value` (quotes stripped, split on
 * the first ": ") and `key:` followed by `  - item` lines. Any other line
 * is an error.
 */
function parseFrontmatter(text, errors, fileLabel) {
  const fields = {};
  const lines = text.split("\n");
  let currentListKey = null;

  for (const rawLine of lines) {
    if (rawLine.trim() === "") continue;

    const listItemMatch = /^\s{2,}-\s+(.*)$/.exec(rawLine);
    if (listItemMatch && currentListKey) {
      fields[currentListKey].push(listItemMatch[1].trim());
      continue;
    }

    const keyOnlyMatch = /^([A-Za-z0-9_-]+):\s*$/.exec(rawLine);
    if (keyOnlyMatch) {
      currentListKey = keyOnlyMatch[1];
      fields[currentListKey] = [];
      continue;
    }

    const idx = rawLine.indexOf(": ");
    if (idx !== -1) {
      const key = rawLine.slice(0, idx).trim();
      let value = rawLine.slice(idx + 2).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      fields[key] = value;
      currentListKey = null;
      continue;
    }

    errors.push(
      `${fileLabel}: unparsable frontmatter line: ${JSON.stringify(rawLine)}`,
    );
    currentListKey = null;
  }

  return fields;
}

function splitFrontmatter(raw) {
  if (!raw.startsWith("---")) return null;
  const rest = raw.slice(3);
  const closeIdx = rest.indexOf("\n---");
  if (closeIdx === -1) return null;
  const frontmatter = rest.slice(rest.startsWith("\n") ? 1 : 0, closeIdx);
  const afterMarker = rest.indexOf("\n", closeIdx + 4);
  const body = afterMarker === -1 ? "" : rest.slice(afterMarker + 1);
  return { frontmatter, body };
}

function extractBody(rawBody) {
  return rawBody.replace(/^\n+/, "").replace(/\s+$/, "");
}

function findMissingPaths(body, repoRoot) {
  const missing = [];
  const backtickRe = /`([^`]+)`/g;
  let match;
  while ((match = backtickRe.exec(body)) !== null) {
    const token = match[1];
    if (!PATH_PREFIXES.some((prefix) => token.startsWith(prefix))) continue;
    if (/[*<>[{$]/.test(token)) continue;
    const abs = path.join(repoRoot, token);
    if (!fs.existsSync(abs)) missing.push(token);
  }
  return missing;
}

function toTomlString(value) {
  return JSON.stringify(value);
}

function generateAgentToml(name, description, body) {
  return (
    `# Generated from .claude/agents/${name}.md by \`pnpm agent-config:sync\`. Do not edit.\n` +
    `name = ${toTomlString(name)}\n` +
    `description = ${toTomlString(description)}\n` +
    `developer_instructions = '''\n${body}\n'''\n`
  );
}

function planAgents(repoRoot, errors) {
  const agentsDir = path.join(repoRoot, ".claude", "agents");
  const codexAgentsDir = path.join(repoRoot, ".codex", "agents");

  const generated = new Map(); // name -> toml content

  if (fs.existsSync(agentsDir)) {
    for (const entry of fs.readdirSync(agentsDir)) {
      if (isDotEntry(entry) || !entry.endsWith(".md")) continue;
      const stem = entry.slice(0, -3);
      const fileLabel = `.claude/agents/${entry}`;
      const raw = fs.readFileSync(path.join(agentsDir, entry), "utf8");
      const split = splitFrontmatter(raw);
      if (!split) {
        errors.push(`${fileLabel}: missing frontmatter`);
        continue;
      }
      const fields = parseFrontmatter(split.frontmatter, errors, fileLabel);
      const { name, description } = fields;
      if (!name) {
        errors.push(`${fileLabel}: missing \`name\` in frontmatter`);
        continue;
      }
      if (name !== stem) {
        errors.push(
          `${fileLabel}: \`name: ${name}\` must equal the file stem \`${stem}\``,
        );
        continue;
      }
      if (!description) {
        errors.push(`${fileLabel}: missing \`description\` in frontmatter`);
        continue;
      }

      const body = extractBody(split.body);
      if (body.includes("'''")) {
        errors.push(
          `${fileLabel}: body contains \`'''\`, which cannot be embedded in a TOML basic string`,
        );
        continue;
      }

      const missingPaths = findMissingPaths(body, repoRoot);
      for (const p of missingPaths) {
        errors.push(`${fileLabel} references missing path \`${p}\``);
      }
      if (missingPaths.length > 0) continue;

      generated.set(stem, generateAgentToml(stem, description, body));
    }
  }

  const actions = [];
  for (const [stem, content] of generated) {
    const tomlPath = path.join(codexAgentsDir, `${stem}.toml`);
    const existing = fs.existsSync(tomlPath)
      ? fs.readFileSync(tomlPath, "utf8")
      : null;
    if (existing !== content) {
      actions.push({
        kind: "agent-write",
        stem,
        path: tomlPath,
        content,
        stale: existing !== null,
      });
    }
  }

  if (fs.existsSync(codexAgentsDir)) {
    for (const entry of fs.readdirSync(codexAgentsDir)) {
      if (isDotEntry(entry) || !entry.endsWith(".toml")) continue;
      const stem = entry.slice(0, -5);
      if (!generated.has(stem)) {
        actions.push({
          kind: "agent-orphan",
          stem,
          path: path.join(codexAgentsDir, entry),
        });
      }
    }
  }

  return actions;
}

const HOOK_COMMAND_RE =
  /^"?\$CLAUDE_PROJECT_DIR"?\/(\.claude\/hooks\/[\w.-]+)(.*)$/;

function planHooks(repoRoot, errors) {
  const settingsPath = path.join(repoRoot, ".claude", "settings.json");
  const hooksJsonPath = path.join(repoRoot, ".codex", "hooks.json");

  if (!fs.existsSync(settingsPath)) {
    errors.push(".claude/settings.json is missing");
    return { actions: [], hookCount: 0 };
  }

  let settings;
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
  } catch (e) {
    errors.push(`.claude/settings.json: invalid JSON (${e.message})`);
    return { actions: [], hookCount: 0 };
  }

  const claudeHooks = settings.hooks ?? {};
  const codexHooks = {};
  let hookCount = 0;

  for (const event of CODEX_EVENTS) {
    const groups = claudeHooks[event];
    if (!Array.isArray(groups)) continue;

    const outGroups = [];
    for (const group of groups) {
      const handlers = Array.isArray(group.hooks) ? group.hooks : [];
      const outHandlers = [];

      for (const handler of handlers) {
        const command = handler.command ?? "";
        const match = HOOK_COMMAND_RE.exec(command);
        if (!match) {
          errors.push(
            `.claude/settings.json: hook command for ${event} is not repo-relative via $CLAUDE_PROJECT_DIR/.claude/hooks/…: ${JSON.stringify(command)}`,
          );
          continue;
        }
        const [, relPath, rest] = match;
        const scriptName = path.basename(relPath);
        if (
          Object.prototype.hasOwnProperty.call(CLAUDE_ONLY_HOOKS, scriptName)
        ) {
          continue;
        }

        const absPath = path.join(repoRoot, relPath);
        if (!fs.existsSync(absPath)) {
          errors.push(`.claude/settings.json: hook script missing: ${relPath}`);
          continue;
        }
        try {
          fs.accessSync(absPath, fs.constants.X_OK);
        } catch {
          errors.push(
            `.claude/settings.json: hook script not executable: ${relPath}`,
          );
          continue;
        }

        const outHandler = {
          type: handler.type,
          command: `"$(git rev-parse --show-toplevel)"/${relPath}${rest}`,
        };
        if (handler.statusMessage !== undefined)
          outHandler.statusMessage = handler.statusMessage;
        if (handler.timeout !== undefined) outHandler.timeout = handler.timeout;
        outHandlers.push(outHandler);
        hookCount += 1;
      }

      if (outHandlers.length > 0) {
        const outGroup = {};
        if (group.matcher !== undefined) outGroup.matcher = group.matcher;
        outGroup.hooks = outHandlers;
        outGroups.push(outGroup);
      }
    }

    if (outGroups.length > 0) {
      codexHooks[event] = outGroups;
    }
  }

  const expected =
    JSON.stringify(
      {
        description:
          "Generated from the hooks in .claude/settings.json by `pnpm agent-config:sync`. Do not edit.",
        hooks: codexHooks,
      },
      null,
      2,
    ) + "\n";

  const existing = fs.existsSync(hooksJsonPath)
    ? fs.readFileSync(hooksJsonPath, "utf8")
    : null;
  const actions = [];
  if (existing !== expected) {
    actions.push({
      kind: "hooks-write",
      path: hooksJsonPath,
      content: expected,
      stale: existing !== null,
    });
  }

  return { actions, hookCount };
}

function planCodexHygiene(repoRoot, errors) {
  const codexDir = path.join(repoRoot, ".codex");
  if (!fs.existsSync(codexDir)) return;

  function walk(dir, relDir) {
    for (const entry of fs.readdirSync(dir)) {
      if (isDotEntry(entry)) continue;
      const abs = path.join(dir, entry);
      const rel = relDir ? `${relDir}/${entry}` : entry;
      const st = fs.statSync(abs);
      if (st.isDirectory()) {
        if (rel === "agents" || rel === "rules") {
          for (const inner of fs.readdirSync(abs)) {
            if (isDotEntry(inner)) continue;
            const innerAbs = path.join(abs, inner);
            const innerRel = `${rel}/${inner}`;
            const ext = rel === "agents" ? ".toml" : ".rules";
            if (fs.statSync(innerAbs).isFile() && inner.endsWith(ext)) {
              checkAbsolutePaths(innerAbs, innerRel);
              continue;
            }
            errors.push(`.codex/${innerRel}: unexpected file`);
          }
          continue;
        }
        errors.push(`.codex/${rel}: unexpected directory`);
        continue;
      }
      if (rel === "config.toml" || rel === "hooks.json") {
        checkAbsolutePaths(abs, rel);
        continue;
      }
      errors.push(`.codex/${rel}: unexpected file`);
    }
  }

  function checkAbsolutePaths(abs, rel) {
    const content = fs.readFileSync(abs, "utf8");
    if (ABSOLUTE_PATH_RE.test(content)) {
      errors.push(`.codex/${rel}: contains an absolute path`);
    }
  }

  walk(codexDir, "");
}

export function syncAgentConfig({ repoRoot, check }) {
  const errors = [];

  const agentActions = planAgents(repoRoot, errors);
  const { actions: hookActions, hookCount } = planHooks(repoRoot, errors);
  if (check) {
    planCodexHygiene(repoRoot, errors);
  }

  const agentCount = countAgentFiles(repoRoot);

  if (errors.length > 0) {
    return { actions: [], errors, agentCount, hookCount };
  }

  const allActions = [...agentActions, ...hookActions];

  if (check) {
    const messages = allActions.map(describeAction);
    return { actions: messages, errors: [], agentCount, hookCount };
  }

  const applied = [];
  for (const action of allActions) {
    if (action.kind === "agent-orphan") {
      fs.rmSync(action.path);
      applied.push(`delete orphan .codex/agents/${action.stem}.toml`);
      continue;
    }
    fs.mkdirSync(path.dirname(action.path), { recursive: true });
    fs.writeFileSync(action.path, action.content);
    applied.push(describeApplied(action));
  }

  return { actions: applied, errors: [], agentCount, hookCount };
}

function describeAction(action) {
  if (action.kind === "agent-write") {
    return action.stale
      ? `stale .codex/agents/${action.stem}.toml`
      : `missing .codex/agents/${action.stem}.toml`;
  }
  if (action.kind === "agent-orphan") {
    return `orphan .codex/agents/${action.stem}.toml`;
  }
  if (action.kind === "hooks-write") {
    return action.stale
      ? "stale .codex/hooks.json"
      : "missing .codex/hooks.json";
  }
  return "unknown action";
}

function describeApplied(action) {
  if (action.kind === "agent-write") {
    return `write .codex/agents/${action.stem}.toml`;
  }
  if (action.kind === "hooks-write") {
    return "write .codex/hooks.json";
  }
  return "unknown action";
}

function countAgentFiles(repoRoot) {
  const agentsDir = path.join(repoRoot, ".claude", "agents");
  if (!fs.existsSync(agentsDir)) return 0;
  return fs
    .readdirSync(agentsDir)
    .filter((n) => !isDotEntry(n) && n.endsWith(".md")).length;
}

function runCli() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  let repoRoot = path.resolve(import.meta.dirname, "..");
  const rootIdx = args.indexOf("--root");
  if (rootIdx !== -1 && args[rootIdx + 1]) {
    repoRoot = path.resolve(args[rootIdx + 1]);
  }

  const { actions, errors, agentCount, hookCount } = syncAgentConfig({
    repoRoot,
    check,
  });

  if (errors.length > 0) {
    for (const err of errors) console.error(err);
    process.exit(1);
  }

  if (check) {
    if (actions.length > 0) {
      for (const line of actions) console.log(line);
      console.log(
        "Agent config out of sync. Run `pnpm agent-config:sync` and commit the result.",
      );
      process.exit(1);
    }
    console.log(
      `Agent config in sync (${agentCount} agents, ${hookCount} hooks).`,
    );
    process.exit(0);
  }

  for (const line of actions) console.log(line);
  process.exit(0);
}

const isMain = (() => {
  try {
    const thisFile = fs.realpathSync(import.meta.filename);
    const argv1 = process.argv[1] ? fs.realpathSync(process.argv[1]) : null;
    return argv1 !== null && thisFile === argv1;
  } catch {
    return false;
  }
})();

if (isMain) {
  runCli();
}
