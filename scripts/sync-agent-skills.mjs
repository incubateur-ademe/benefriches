#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function isDotEntry(name) {
  return name.startsWith(".");
}

function linkTarget(name) {
  return `../../.agents/skills/${name}`;
}

function describeAction(action) {
  if (action.type === "move") {
    return `real dir .claude/skills/${action.name} should move to .agents/skills/${action.name}`;
  }
  if (action.type === "link") {
    return `missing link .claude/skills/${action.name}`;
  }
  return `wrong target .claude/skills/${action.name} -> ${action.target}`;
}

function describeApplied(action) {
  if (action.type === "move") {
    return `move .claude/skills/${action.name} -> .agents/skills/${action.name}`;
  }
  return `${action.type} .claude/skills/${action.name} -> ${linkTarget(action.name)}`;
}

function lexists(p) {
  try {
    fs.lstatSync(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Plans the actions/errors needed to keep .claude/skills in sync with
 * .agents/skills, without touching disk.
 */
function plan(repoRoot) {
  const canon = path.join(repoRoot, ".agents", "skills");
  const links = path.join(repoRoot, ".claude", "skills");

  const errors = [];
  const moveQueue = new Set();

  // Pass 1: scan LINKS
  if (fs.existsSync(links)) {
    for (const name of fs.readdirSync(links)) {
      if (isDotEntry(name)) continue;
      const linkPath = path.join(links, name);
      const st = fs.lstatSync(linkPath);
      const canonPath = path.join(canon, name);

      if (st.isSymbolicLink()) {
        const canonIsDir = fs.existsSync(canonPath) && fs.statSync(canonPath).isDirectory();
        if (!canonIsDir) {
          errors.push(`\`.claude/skills/${name}\` links to a missing skill`);
        }
        continue; // valid symlinks are handled in pass 2
      }

      if (st.isDirectory()) {
        if (fs.existsSync(canonPath)) {
          errors.push(
            `\`${name}\` exists as a real directory in both .claude/skills and .agents/skills; merge them manually`,
          );
          continue;
        }
        if (!fs.existsSync(path.join(linkPath, "SKILL.md"))) {
          errors.push(`\`.claude/skills/${name}\` has no SKILL.md`);
          continue;
        }
        moveQueue.add(name);
        continue;
      }

      errors.push(`unexpected file \`.claude/skills/${name}\``);
    }
  }

  // Pass 2: scan CANON, plus names queued for move (canonical from here on)
  const canonNames = new Set(moveQueue);
  if (fs.existsSync(canon)) {
    for (const name of fs.readdirSync(canon)) {
      if (!isDotEntry(name)) canonNames.add(name);
    }
  }

  const actions = [];

  for (const name of canonNames) {
    const linkPath = path.join(links, name);

    if (moveQueue.has(name)) {
      actions.push({ type: "move", name });
      actions.push({ type: "link", name });
      continue;
    }

    const canonPath = path.join(canon, name);
    const st = fs.lstatSync(canonPath);
    if (!st.isDirectory()) {
      errors.push(`\`.agents/skills/${name}\` must be a real directory`);
      continue;
    }
    if (!fs.existsSync(path.join(canonPath, "SKILL.md"))) {
      errors.push(`\`.agents/skills/${name}\` has no SKILL.md`);
      continue;
    }

    if (!lexists(linkPath)) {
      actions.push({ type: "link", name });
      continue;
    }

    const linkSt = fs.lstatSync(linkPath);
    if (linkSt.isSymbolicLink()) {
      const target = fs.readlinkSync(linkPath);
      if (target !== linkTarget(name)) {
        actions.push({ type: "relink", name, target: linkTarget(name) });
      }
      continue;
    }

    if (linkSt.isFile()) {
      errors.push(`real file where a link should be: \`.claude/skills/${name}\``);
      continue;
    }

    // linkSt.isDirectory() -> already reported in pass 1
  }

  return { canon, links, actions, errors };
}

export function syncAgentSkills({ repoRoot, check }) {
  const { canon, links, actions, errors } = plan(repoRoot);

  if (errors.length > 0) {
    return { actions: [], errors };
  }

  if (check) {
    return { actions: actions.map(describeAction), errors: [] };
  }

  if (actions.length > 0) {
    fs.mkdirSync(canon, { recursive: true });
    fs.mkdirSync(links, { recursive: true });
  }

  const applied = [];
  for (const action of actions) {
    const linkPath = path.join(links, action.name);
    if (action.type === "move") {
      fs.renameSync(path.join(links, action.name), path.join(canon, action.name));
    } else if (action.type === "link") {
      fs.symlinkSync(linkTarget(action.name), linkPath);
    } else if (action.type === "relink") {
      fs.unlinkSync(linkPath);
      fs.symlinkSync(linkTarget(action.name), linkPath);
    }
    applied.push(describeApplied(action));
  }

  return { actions: applied, errors: [] };
}

function countSkills(canonDir) {
  if (!fs.existsSync(canonDir)) return 0;
  return fs.readdirSync(canonDir).filter((n) => !isDotEntry(n)).length;
}

function runCli() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  let repoRoot = path.resolve(import.meta.dirname, "..");
  const rootIdx = args.indexOf("--root");
  if (rootIdx !== -1 && args[rootIdx + 1]) {
    repoRoot = path.resolve(args[rootIdx + 1]);
  }

  const { actions, errors } = syncAgentSkills({ repoRoot, check });

  if (errors.length > 0) {
    for (const err of errors) console.error(err);
    process.exit(1);
  }

  if (check) {
    if (actions.length > 0) {
      for (const line of actions) console.log(line);
      console.log("Agent skills out of sync. Run `pnpm agent-skills:sync` and commit the result.");
      process.exit(1);
    }
    const canon = path.join(repoRoot, ".agents", "skills");
    console.log(`Agent skills in sync (${countSkills(canon)} skills).`);
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
