import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

import { checkEnvFiles } from "./check-env-files.mjs";

const scriptPath = path.join(import.meta.dirname, "check-env-files.mjs");
const repoRoot = path.resolve(import.meta.dirname, "..");

const APPS = [
  { dir: "apps/api", service: "api" },
  { dir: "apps/web", service: "web" },
];

const CONSISTENT_COMPOSE = `services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: \${DATABASE_USER}
  web:
    environment:
      WEBAPP_FOO_URL: \${WEBAPP_FOO_URL}
  api:
    environment:
      NODE_ENV: \${NODE_ENV}
      # a comment
      MOCK_FOO_API: \${MOCK_FOO_API}
    healthcheck:
      test: ['CMD', 'true']
volumes:
  data:
`;

function consistentFiles() {
  return {
    "apps/api/.env.example": "# Node mode\nNODE_ENV=development\nMOCK_FOO_API=\n",
    "apps/web/.env.example": "WEBAPP_FOO_URL=\n",
    ".env.e2e": "NODE_ENV=test\nMOCK_FOO_API=true\nWEBAPP_FOO_URL=http://foo\n",
    "docker-compose.e2e.yml": CONSISTENT_COMPOSE,
  };
}

function mkRepo(t, files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "env-files-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const [relPath, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, relPath)), { recursive: true });
    fs.writeFileSync(path.join(root, relPath), content);
  }
  return root;
}

test("consistent files pass", (t) => {
  // Arrange
  const root = mkRepo(t, consistentFiles());

  // Act
  const { errors } = checkEnvFiles({ repoRoot: root, apps: APPS, exceptions: [] });

  // Assert
  assert.deepStrictEqual(errors, []);
});

test("a key missing from .env.e2e is reported with the file to update", (t) => {
  // Arrange
  const files = consistentFiles();
  files[".env.e2e"] = "NODE_ENV=test\nWEBAPP_FOO_URL=http://foo\n";
  const root = mkRepo(t, files);

  // Act
  const { errors } = checkEnvFiles({ repoRoot: root, apps: APPS, exceptions: [] });

  // Assert
  assert.deepStrictEqual(errors, [
    "MOCK_FOO_API (from apps/api/.env.example) is missing from .env.e2e: add it with the value the e2e stack needs",
  ]);
});

test("a key missing from its service's environment block is reported with the file to update", (t) => {
  // Arrange
  const files = consistentFiles();
  files["apps/web/.env.example"] = "WEBAPP_FOO_URL=\nWEBAPP_BAR=\n";
  files[".env.e2e"] += "WEBAPP_BAR=1\n";
  const root = mkRepo(t, files);

  // Act
  const { errors } = checkEnvFiles({ repoRoot: root, apps: APPS, exceptions: [] });

  // Assert
  assert.deepStrictEqual(errors, [
    'WEBAPP_BAR (from apps/web/.env.example) is missing from docker-compose.e2e.yml: add `WEBAPP_BAR: ${WEBAPP_BAR}` to the environment: block of the "web" service',
  ]);
});

test("a key passed to another service does not count", (t) => {
  // Arrange
  const files = consistentFiles();
  files["apps/api/.env.example"] += "WEBAPP_FOO_URL=\n";
  const root = mkRepo(t, files);

  // Act
  const { errors } = checkEnvFiles({ repoRoot: root, apps: APPS, exceptions: [] });

  // Assert
  assert.deepStrictEqual(errors, [
    'WEBAPP_FOO_URL (from apps/api/.env.example) is missing from docker-compose.e2e.yml: add `WEBAPP_FOO_URL: ${WEBAPP_FOO_URL}` to the environment: block of the "api" service',
  ]);
});

test("list-form environment entries are recognised", (t) => {
  // Arrange
  const files = consistentFiles();
  files["docker-compose.e2e.yml"] = CONSISTENT_COMPOSE.replace(
    "      WEBAPP_FOO_URL: ${WEBAPP_FOO_URL}",
    "      - WEBAPP_FOO_URL=${WEBAPP_FOO_URL}",
  );
  const root = mkRepo(t, files);

  // Act
  const { errors } = checkEnvFiles({ repoRoot: root, apps: APPS, exceptions: [] });

  // Assert
  assert.deepStrictEqual(errors, []);
});

test("an exception exempts its key, and one that is no longer needed is reported", (t) => {
  // Arrange
  const files = consistentFiles();
  files["apps/api/.env.example"] += "DEV_ONLY_PORT=1080\n";
  const root = mkRepo(t, files);
  const exceptions = [
    { app: "apps/api", key: "DEV_ONLY_PORT", skip: ["e2e-env", "compose"], reason: "dev only" },
    { app: "apps/api", key: "NODE_ENV", skip: ["compose"], reason: "stale" },
  ];

  // Act
  const { errors } = checkEnvFiles({ repoRoot: root, apps: APPS, exceptions });

  // Assert
  assert.deepStrictEqual(errors, [
    "scripts/check-env-files.mjs: exception for NODE_ENV (apps/api) is no longer needed: remove it",
  ]);
});

test("an app whose .env.example is not mapped to a service is reported", (t) => {
  // Arrange
  const files = consistentFiles();
  files["apps/worker/.env.example"] = "FOO=\n";
  const root = mkRepo(t, files);

  // Act
  const { errors } = checkEnvFiles({ repoRoot: root, apps: APPS, exceptions: [] });

  // Assert
  assert.deepStrictEqual(errors, [
    "apps/worker/.env.example is not checked: map apps/worker to its docker-compose.e2e.yml service in APPS (scripts/check-env-files.mjs)",
  ]);
});

test("the CLI passes on the repository", () => {
  // Act
  const result = spawnSync(process.execPath, [scriptPath], { encoding: "utf8" });

  // Assert
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^Env files consistent/);
});

test("the CLI exits non-zero and names both files when a new key is only in .env.example", (t) => {
  // Arrange: a copy of the repository's files, plus one key added to the api's .env.example only
  const files = Object.fromEntries(
    ["apps/api/.env.example", "apps/web/.env.example", ".env.e2e", "docker-compose.e2e.yml"].map(
      (relPath) => [relPath, fs.readFileSync(path.join(repoRoot, relPath), "utf8")],
    ),
  );
  files["apps/api/.env.example"] += "MOCK_NEW_API=\n";
  const root = mkRepo(t, files);

  // Act
  const result = spawnSync(process.execPath, [scriptPath, "--root", root], { encoding: "utf8" });

  // Assert
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /MOCK_NEW_API \(from apps\/api\/\.env\.example\) is missing from \.env\.e2e/,
  );
  assert.match(
    result.stderr,
    /MOCK_NEW_API \(from apps\/api\/\.env\.example\) is missing from docker-compose\.e2e\.yml/,
  );
});
