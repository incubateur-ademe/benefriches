#!/usr/bin/env node
// Checks that every key of an app's .env.example is also set in the root
// .env.e2e and passed to the app's service in docker-compose.e2e.yml.
// Reads committed files only (.env.example, .env.e2e, docker-compose.e2e.yml).
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const E2E_ENV_FILE = ".env.e2e";
const COMPOSE_FILE = "docker-compose.e2e.yml";

// Each app with a .env.example and the docker-compose.e2e.yml service that runs it.
const APPS = [
  { dir: "apps/api", service: "api" },
  { dir: "apps/web", service: "web" },
];

// Keys that legitimately don't follow the rule. `skip` lists the checks the key is exempt
// from: "e2e-env" (.env.e2e) and/or "compose" (the service's environment: block).
const EXCEPTIONS = [
  {
    app: "apps/api",
    key: "PORT",
    skip: ["e2e-env"],
    reason: ".env.e2e sets API_PORT, which the compose file maps to PORT and to the published port",
  },
  ...["DATABASE_PORT", "DATABASE_USER", "DATABASE_PASSWORD", "DATABASE_DB_NAME"].map((key) => ({
    app: "apps/api",
    key,
    skip: ["compose"],
    reason:
      "the compose file passes DATABASE_URL built from it (knexConfig reads DATABASE_URL first)",
  })),
  {
    app: "apps/api",
    key: "MAILCATCHER_HTTP_PORT",
    skip: ["e2e-env", "compose"],
    reason: "read by docker-compose.dev.yml only (make dev-up), not by the API",
  },
  {
    app: "apps/web",
    key: "API_HOST",
    skip: ["e2e-env", "compose"],
    reason: "Vite dev-server proxy target only; the e2e web container's nginx uses API_HOST_URL",
  },
  {
    app: "apps/web",
    key: "VITE_GOOGLE_SITE_VERIFICATION",
    skip: ["e2e-env", "compose"],
    reason:
      "build-time Vite var, set only by build-and-upload-web-artifact.yml for deployed builds",
  },
];

/** Keys assigned in a dotenv file (comments and blank lines ignored). */
export function parseEnvKeys(text) {
  const keys = new Set();
  for (const line of text.split(/\r?\n/)) {
    const match = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/.exec(line);
    if (match) keys.add(match[1]);
  }
  return keys;
}

function indentOf(line) {
  return line.length - line.trimStart().length;
}

function isBlankOrComment(line) {
  const trimmed = line.trim();
  return trimmed === "" || trimmed.startsWith("#");
}

/**
 * Keys of each service's `environment:` block in a compose file, as a Map
 * service -> Set<key>. Line-based on purpose (no YAML dependency at the repo root):
 * it supports the map form (`KEY: value`) and the list form (`- KEY=value`).
 */
export function parseComposeEnvironments(text) {
  const lines = text.split(/\r?\n/);
  const services = new Map();
  let servicesIndent = null;
  let serviceIndent = null;
  let currentService = null;
  let envIndent = null;

  for (const line of lines) {
    if (isBlankOrComment(line)) continue;
    const indent = indentOf(line);
    const trimmed = line.trim();

    if (servicesIndent === null) {
      if (trimmed === "services:") servicesIndent = indent;
      continue;
    }
    if (indent <= servicesIndent) break; // left the services: block

    if (serviceIndent === null) serviceIndent = indent;
    if (indent === serviceIndent) {
      currentService = trimmed.replace(/:$/, "");
      services.set(currentService, services.get(currentService) ?? new Set());
      envIndent = null;
      continue;
    }

    if (envIndent !== null && indent > envIndent) {
      const match = /^(?:-\s*)?["']?([A-Za-z_][A-Za-z0-9_]*)["']?\s*[:=]?/.exec(trimmed);
      if (match) services.get(currentService).add(match[1]);
      continue;
    }
    envIndent = null;
    if (trimmed === "environment:") envIndent = indent;
  }
  return services;
}

function readFile(repoRoot, relPath, errors) {
  const absPath = path.join(repoRoot, relPath);
  if (!fs.existsSync(absPath)) {
    errors.push(`${relPath} not found`);
    return null;
  }
  return fs.readFileSync(absPath, "utf8");
}

/** Returns { errors, summary } without printing anything. */
export function checkEnvFiles({ repoRoot, apps = APPS, exceptions = EXCEPTIONS }) {
  const errors = [];
  const e2eEnvText = readFile(repoRoot, E2E_ENV_FILE, errors);
  const composeText = readFile(repoRoot, COMPOSE_FILE, errors);
  if (e2eEnvText === null || composeText === null) return { errors, summary: [] };

  const e2eKeys = parseEnvKeys(e2eEnvText);
  const composeEnvs = parseComposeEnvironments(composeText);
  const summary = [];

  for (const exception of exceptions) {
    if (!apps.some((app) => app.dir === exception.app)) {
      errors.push(`scripts/check-env-files.mjs: exception for unknown app ${exception.app}`);
    }
  }

  for (const app of apps) {
    const examplePath = `${app.dir}/.env.example`;
    const exampleText = readFile(repoRoot, examplePath, errors);
    if (exampleText === null) continue;
    const exampleKeys = parseEnvKeys(exampleText);
    const serviceKeys = composeEnvs.get(app.service);
    if (!serviceKeys) {
      errors.push(`${COMPOSE_FILE}: service "${app.service}" (for ${app.dir}) not found`);
      continue;
    }
    const appExceptions = exceptions.filter((e) => e.app === app.dir);
    const isExempt = (key, check) =>
      appExceptions.some((e) => e.key === key && e.skip.includes(check));

    for (const key of exampleKeys) {
      if (!e2eKeys.has(key) && !isExempt(key, "e2e-env")) {
        errors.push(
          `${key} (from ${examplePath}) is missing from ${E2E_ENV_FILE}: add it with the value the e2e stack needs`,
        );
      }
      if (!serviceKeys.has(key) && !isExempt(key, "compose")) {
        errors.push(
          `${key} (from ${examplePath}) is missing from ${COMPOSE_FILE}: add \`${key}: \${${key}}\` to the environment: block of the "${app.service}" service`,
        );
      }
    }

    for (const exception of appExceptions) {
      const stillNeeded =
        exampleKeys.has(exception.key) &&
        exception.skip.some((check) =>
          check === "e2e-env" ? !e2eKeys.has(exception.key) : !serviceKeys.has(exception.key),
        );
      if (!stillNeeded) {
        errors.push(
          `scripts/check-env-files.mjs: exception for ${exception.key} (${exception.app}) is no longer needed: remove it`,
        );
      }
    }
    summary.push(`${app.dir}: ${exampleKeys.size} keys`);
  }

  // Any other .env.example must be mapped to a service.
  for (const parent of ["apps", "packages"]) {
    const parentDir = path.join(repoRoot, parent);
    if (!fs.existsSync(parentDir)) continue;
    for (const name of fs.readdirSync(parentDir)) {
      const dir = `${parent}/${name}`;
      if (apps.some((app) => app.dir === dir)) continue;
      if (fs.existsSync(path.join(repoRoot, dir, ".env.example"))) {
        errors.push(
          `${dir}/.env.example is not checked: map ${dir} to its docker-compose.e2e.yml service in APPS (scripts/check-env-files.mjs)`,
        );
      }
    }
  }

  return { errors, summary };
}

function runCli() {
  const args = process.argv.slice(2);
  let repoRoot = path.resolve(import.meta.dirname, "..");
  const rootIdx = args.indexOf("--root");
  if (rootIdx !== -1 && args[rootIdx + 1]) repoRoot = path.resolve(args[rootIdx + 1]);

  const { errors, summary } = checkEnvFiles({ repoRoot });
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    console.error(
      "\nEvery key of an app's .env.example must also be in .env.e2e and in its service's environment: block in docker-compose.e2e.yml. For a legitimate exception, add an entry with a reason to EXCEPTIONS in scripts/check-env-files.mjs.",
    );
    process.exit(1);
  }
  console.log(`Env files consistent (${summary.join(", ")}).`);
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

if (isMain) runCli();
