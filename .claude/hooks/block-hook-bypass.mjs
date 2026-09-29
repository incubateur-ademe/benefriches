#!/usr/bin/env node
// PreToolUse(Bash): block every form of `git commit` that skips the
// pre-commit hook (Talisman, lint, format checks). The old Claude deny rule
// only matched the exact string "git commit --no-verify", so
// `git commit -m x --no-verify`, `-n`, `-c core.hooksPath=...` and `HUSKY=0`
// all slipped through. This one script is shared by Claude (this file) and
// Codex (wired through .codex/hooks.json by `pnpm agent-config:sync`).
//
// Known limitation: a `$( … )` or backtick span is kept as an opaque word
// and not inspected, so a bypass hidden behind command substitution is not
// caught. That matches how Claude and Codex actually invoke git.

import fs from "node:fs";
import process from "node:process";

const COMMIT_VALUE_OPTS = new Set([
  "--message",
  "--file",
  "--author",
  "--date",
  "--template",
  "--reuse-message",
  "--reedit-message",
  "--fixup",
  "--squash",
  "--cleanup",
  "--trailer",
  "--pathspec-from-file",
]);

const SHORT_VALUE_FLAGS = new Set(["m", "F", "C", "c", "t"]);
const SHORT_OPTIONAL_VALUE_FLAGS = new Set(["S", "u"]);

// Commands that run another command given as later arguments. Their own
// options (`sudo -u bob`, `timeout 10`, `env -u X`) vary, so after one of
// these we jump to the next word that is `git`, a shell or `eval`.
const SHELL_WRAPPERS = new Set([
  "env",
  "command",
  "rtk",
  "nohup",
  "time",
  "sudo",
  "doas",
  "nice",
  "timeout",
  "xargs",
  "exec",
  "stdbuf",
]);
const SHELL_INTERPRETERS = new Set(["bash", "sh", "zsh"]);
// Shell keywords that can precede a command in the same simple command.
const SHELL_KEYWORDS = new Set([
  "{",
  "}",
  "!",
  "if",
  "then",
  "else",
  "elif",
  "do",
  "while",
  "until",
]);

const HEREDOC_RE =
  /(?<!<)<<(?!<)(-?)[ \t]*(?:'([^'\n]+)'|"([^"\n]+)"|\\?([^\s'"<>;&|()]+))/;

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Env assignment effects: HUSKY=0, or any GIT_CONFIG_* naming core.hooksPath. */
function assignmentFlags(name, value) {
  return {
    huskyZero: name === "HUSKY" && value === "0",
    hooksPathSet: name.startsWith("GIT_CONFIG") && /core\.hookspath/i.test(value),
  };
}

function parseAssignment(word) {
  const eq = word.indexOf("=");
  if (eq > 0 && /^[A-Za-z_][A-Za-z0-9_]*$/.test(word.slice(0, eq))) {
    return { name: word.slice(0, eq), value: word.slice(eq + 1) };
  }
  return null;
}

/**
 * Strips heredoc bodies (`<<EOF ... EOF`, `<<-'EOF' ... EOF`) from a shell
 * command string, so that message text inside them (which may contain
 * `-n`, `--no-verify`, quotes, etc.) is never tokenized as arguments.
 */
function stripHeredocs(command) {
  let result = "";
  let i = 0;
  while (i < command.length) {
    const rest = command.slice(i);
    const match = HEREDOC_RE.exec(rest);
    if (!match) {
      result += rest;
      break;
    }
    result += rest.slice(0, match.index + match[0].length);
    i += match.index + match[0].length;
    const isDash = match[1] === "-";
    const delimiter = escapeRegExp(match[2] ?? match[3] ?? match[4]);
    const nl = command.indexOf("\n", i);
    if (nl === -1) {
      result += command.slice(i);
      break;
    }
    // Keep the rest of the heredoc's own line (e.g. `)" --no-verify`).
    result += command.slice(i, nl);
    const cursor = nl + 1;
    const lineRe = isDash
      ? new RegExp(`^\\t*${delimiter}$`)
      : new RegExp(`^${delimiter}$`);
    let bodyEnd = command.length;
    let searchFrom = cursor;
    while (searchFrom <= command.length) {
      const nextNl = command.indexOf("\n", searchFrom);
      const line = command.slice(
        searchFrom,
        nextNl === -1 ? command.length : nextNl,
      );
      if (lineRe.test(line)) {
        bodyEnd = nextNl === -1 ? command.length : nextNl;
        break;
      }
      if (nextNl === -1) {
        bodyEnd = command.length;
        break;
      }
      searchFrom = nextNl + 1;
    }
    i = bodyEnd;
  }
  return result;
}

/**
 * Tokenizes a shell command string into a list of "simple commands" (each a
 * list of word tokens), splitting on unquoted &&, ||, ;, |, &, newline, (, ).
 * `$( … )` / backtick spans are kept as an opaque part of the current word.
 * Returns null if quoting is unbalanced (caller then allows the command).
 */
function tokenize(command) {
  const commands = [];
  let current = [];
  let word = null;
  let i = 0;
  const n = command.length;

  function endWord() {
    if (word !== null) {
      current.push(word);
      word = null;
    }
  }
  function endCommand() {
    endWord();
    if (current.length > 0) {
      commands.push(current);
      current = [];
    }
  }

  while (i < n) {
    const c = command[i];

    if (c === "'") {
      const end = command.indexOf("'", i + 1);
      if (end === -1) return null;
      word = (word ?? "") + command.slice(i + 1, end);
      i = end + 1;
      continue;
    }

    if (c === '"') {
      let j = i + 1;
      let buf = "";
      let closed = false;
      while (j < n) {
        if (command[j] === "\\" && j + 1 < n) {
          buf += command[j + 1];
          j += 2;
          continue;
        }
        if (command[j] === '"') {
          closed = true;
          j += 1;
          break;
        }
        buf += command[j];
        j += 1;
      }
      if (!closed) return null;
      word = (word ?? "") + buf;
      i = j;
      continue;
    }

    // ANSI-C quoting `$'…'`: drop the `$`, the quote is handled next.
    if (c === "$" && command[i + 1] === "'") {
      i += 1;
      continue;
    }

    if (c === "\\" && i + 1 < n) {
      // Backslash-newline is a line continuation: it vanishes.
      if (command[i + 1] !== "\n") word = (word ?? "") + command[i + 1];
      i += 2;
      continue;
    }

    if (c === "$" && command[i + 1] === "(") {
      let depth = 1;
      let j = i + 2;
      while (j < n && depth > 0) {
        if (command[j] === "(") depth += 1;
        else if (command[j] === ")") depth -= 1;
        else if (command[j] === "'") {
          const end = command.indexOf("'", j + 1);
          if (end === -1) return null;
          j = end;
        } else if (command[j] === '"') {
          const end = command.indexOf('"', j + 1);
          if (end === -1) return null;
          j = end;
        }
        j += 1;
      }
      word = (word ?? "") + command.slice(i, j);
      i = j;
      continue;
    }

    if (c === "`") {
      const end = command.indexOf("`", i + 1);
      if (end === -1) return null;
      word = (word ?? "") + command.slice(i, end + 1);
      i = end + 1;
      continue;
    }

    if (c === "&" && command[i + 1] === "&") {
      endCommand();
      i += 2;
      continue;
    }
    if (c === "|" && command[i + 1] === "|") {
      endCommand();
      i += 2;
      continue;
    }
    if (
      c === ";" ||
      c === "|" ||
      c === "&" ||
      c === "\n" ||
      c === "(" ||
      c === ")"
    ) {
      endCommand();
      i += 1;
      continue;
    }

    if (c === " " || c === "\t") {
      endWord();
      i += 1;
      continue;
    }

    word = (word ?? "") + c;
    i += 1;
  }

  endCommand();
  return commands;
}

function basename(p) {
  const idx = Math.max(p.lastIndexOf("/"), p.lastIndexOf("\\"));
  return idx === -1 ? p : p.slice(idx + 1);
}

/**
 * Given a simple command's word list, resolve past shell keywords, env-var
 * prefixes and wrapper commands (env, sudo, xargs, rtk, …), and recurse into
 * `bash -c "..."` / `sh -lc "..."` / `eval "..."` shells. `env` carries
 * `export HUSKY=0`-style flags across the commands of one script. Returns
 * { argv0, args, huskyZero, hooksPathSet }, a reason string from a nested
 * shell, or null if nothing to inspect.
 */
function resolveCommand(words, seen, env) {
  let idx = 0;
  const flags = { ...env };
  const apply = (target, assignment) => {
    const f = assignmentFlags(assignment.name, assignment.value);
    if (f.huskyZero) target.huskyZero = true;
    if (f.hooksPathSet) target.hooksPathSet = true;
  };

  while (idx < words.length) {
    const w = words[idx];
    if (SHELL_KEYWORDS.has(w)) {
      idx += 1;
      continue;
    }
    const assignment = parseAssignment(w);
    if (assignment) {
      apply(flags, assignment);
      idx += 1;
      continue;
    }
    break;
  }

  if (idx >= words.length) {
    // Bare `HUSKY=0` / `GIT_CONFIG_…=…` lines: keep them for later commands.
    Object.assign(env, flags);
    return null;
  }

  let argv0 = basename(words[idx]);
  idx += 1;

  if (argv0 === "export") {
    for (const w of words.slice(idx)) {
      const assignment = parseAssignment(w);
      if (assignment) apply(env, assignment);
    }
    return null;
  }

  if (SHELL_WRAPPERS.has(argv0)) {
    let found = -1;
    for (let j = idx; j < words.length; j += 1) {
      const assignment = parseAssignment(words[j]);
      if (assignment) apply(flags, assignment);
      const b = basename(words[j]);
      if (b === "git" || b === "eval" || SHELL_INTERPRETERS.has(b)) {
        found = j;
        break;
      }
    }
    if (found === -1) return null;
    argv0 = basename(words[found]);
    idx = found + 1;
  }

  if (
    (SHELL_INTERPRETERS.has(argv0) || argv0 === "eval") &&
    idx < words.length
  ) {
    // Find a script argument: for bash/sh/zsh, after a -c/-lc/-ic flag; for eval, the next word.
    if (argv0 === "eval") {
      const script = words.slice(idx).join(" ");
      const scriptKey = `eval:${script}`;
      if (seen.has(scriptKey)) return null;
      seen.add(scriptKey);
      return findBypassInCommand(script, seen, flags);
    }
    for (let j = idx; j < words.length; j += 1) {
      const flag = words[j];
      if (/^-[a-z]*c[a-z]*$/.test(flag)) {
        const scriptArg = words[j + 1];
        if (scriptArg !== undefined) {
          const scriptKey = `sh:${scriptArg}`;
          if (seen.has(scriptKey)) return null;
          seen.add(scriptKey);
          return findBypassInCommand(scriptArg, seen, flags);
        }
      }
    }
    return null;
  }

  return { argv0, args: words.slice(idx), ...flags };
}

/**
 * Parses `git`'s global options ahead of the subcommand, and returns
 * { subcommand, rest, hooksPathSet, aliasBypass }. `-c alias.x=…` values are
 * checked as git commands so `git -c alias.ci='commit -n' ci` is caught.
 */
function parseGitGlobals(args, seen) {
  let i = 0;
  let hooksPathSet = false;
  let aliasBypass = null;
  const GLOBAL_VALUE_OPTS = new Set([
    "-C",
    "--git-dir",
    "--work-tree",
    "--namespace",
  ]);
  const checkConfig = (kv) => {
    const eq = kv.indexOf("=");
    const key = (eq === -1 ? kv : kv.slice(0, eq)).toLowerCase();
    if (key === "core.hookspath") hooksPathSet = true;
    if (key.startsWith("alias.") && eq !== -1 && !aliasBypass) {
      const value = kv.slice(eq + 1);
      aliasBypass = value.startsWith("!")
        ? findBypassInCommand(value.slice(1), seen)
        : findBypassInCommand(`git ${value}`, seen);
    }
  };
  while (i < args.length) {
    const a = args[i];
    if (a === "-c" || a === "--config-env") {
      checkConfig(args[i + 1] ?? "");
      i += 2;
      continue;
    }
    if (a.startsWith("--config-env=")) {
      checkConfig(a.slice("--config-env=".length));
      i += 1;
      continue;
    }
    if (a.startsWith("--") && a.includes("=")) {
      i += 1;
      continue;
    }
    if (GLOBAL_VALUE_OPTS.has(a)) {
      i += 2;
      continue;
    }
    if (a.startsWith("-")) {
      i += 1;
      continue;
    }
    break;
  }
  return {
    subcommand: args[i],
    rest: args.slice(i + 1),
    hooksPathSet,
    aliasBypass,
  };
}

function isNoVerifyAbbrev(opt) {
  // git accepts unambiguous long-option abbreviations. "--no-verify" is
  // ambiguous with "--no-verbose" below length 9 ("--no-ver" is length 8
  // and ambiguous; "--no-veri" (9) is not).
  if (!opt.startsWith("--")) return false;
  const target = "--no-verify";
  if (opt.length < 9 || opt.length > target.length) return false;
  return target.startsWith(opt);
}

function commitArgsBlocked(args) {
  let i = 0;
  while (i < args.length) {
    const a = args[i];
    if (a === "--") break;

    if (isNoVerifyAbbrev(a)) return true;

    if (a.startsWith("--")) {
      const optName = a.includes("=") ? a.slice(0, a.indexOf("=")) : a;
      if (COMMIT_VALUE_OPTS.has(optName) && !a.includes("=")) {
        i += 2;
        continue;
      }
      i += 1;
      continue;
    }

    if (a.startsWith("-") && a.length > 1) {
      const cluster = a.slice(1);
      for (let k = 0; k < cluster.length; k += 1) {
        const flag = cluster[k];
        if (flag === "n") return true;
        if (SHORT_VALUE_FLAGS.has(flag)) {
          // rest of cluster (if any) is the value, else next token; either
          // way, this word's cluster reading stops here.
          if (k === cluster.length - 1) i += 1; // next token consumed as value
          break;
        }
        if (SHORT_OPTIONAL_VALUE_FLAGS.has(flag)) {
          break;
        }
      }
      i += 1;
      continue;
    }

    i += 1;
  }
  return false;
}

/** `git config` that sets or unsets core.hooksPath (reads are fine). */
function configChangesHooksPath(args) {
  const k = args.findIndex((a) => a.toLowerCase() === "core.hookspath");
  if (k === -1) return false;
  if (args.some((a) => ["--get", "--get-all", "get"].includes(a))) return false;
  if (args.some((a) => ["--unset", "--unset-all", "unset"].includes(a)))
    return true;
  return args[k + 1] !== undefined;
}

function findBypassInSimpleCommand(words, seen, env) {
  const resolved = resolveCommand(words, seen, env);
  if (!resolved) return null;
  if (typeof resolved === "string") return resolved; // from a nested shell
  const { argv0, args, huskyZero } = resolved;
  if (argv0 !== "git") return null;

  const { subcommand, rest, hooksPathSet, aliasBypass } = parseGitGlobals(
    args,
    seen,
  );
  if (aliasBypass) return aliasBypass;
  if (subcommand === "config" && configChangesHooksPath(rest))
    return "changing core.hooksPath disables the pre-commit hook";
  if (subcommand !== "commit") return null;

  if (huskyZero) return "HUSKY=0 disables the pre-commit hook";
  if (hooksPathSet || resolved.hooksPathSet)
    return "core.hooksPath was overridden to skip the pre-commit hook";
  if (commitArgsBlocked(rest))
    return "git commit --no-verify (or an equivalent) bypasses the pre-commit hook";
  return null;
}

function findBypassInCommand(
  command,
  seen = new Set(),
  env = { huskyZero: false, hooksPathSet: false },
) {
  const stripped = stripHeredocs(command);
  const commands = tokenize(stripped);
  if (commands === null) return null; // unbalanced quotes: allow
  for (const words of commands) {
    const result = findBypassInSimpleCommand(words, seen, env);
    if (result) return result;
  }
  return null;
}

export function findHookBypass(command) {
  // Some Codex shells pass argv (`["bash", "-lc", "…"]`) instead of a string.
  if (Array.isArray(command) && command.every((w) => typeof w === "string")) {
    return findBypassInSimpleCommand(command, new Set(), {
      huskyZero: false,
      hooksPathSet: false,
    });
  }
  if (!command || typeof command !== "string") return null;
  return findBypassInCommand(command);
}

function runCli() {
  let raw = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    raw += chunk;
  });
  process.stdin.on("end", () => {
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      process.exit(0);
    }
    const command = payload?.tool_input?.command;
    const reason = findHookBypass(command);
    if (reason) {
      process.stderr.write(
        `Blocked: ${reason}. The pre-commit hook must run: commit without it and fix what it reports.\n`,
      );
      process.exit(2);
    }
    process.exit(0);
  });
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
