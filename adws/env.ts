// Isolated e2e environment per port slot: `env up <slot>` / `env down` for a worktree.
// A slot (0-99) derives every host port and the compose project name, so stacks of
// different slots run side by side. Env up writes `.e2e-stack` at the worktree root:
// a KEY=value file read by Playwright, the e2e skills, and compose itself (--env-file).
import { execFile } from "node:child_process";
import { appendFile, readFile, rm, writeFile } from "node:fs/promises";
import { connect, createServer } from "node:net";
import { join, resolve } from "node:path";
import process from "node:process";

export const ENV_FILE = ".e2e-stack";
export const LOG_FILE = ".e2e-stack.log";
const COMPOSE_FILE = "docker-compose.e2e.yml";
const DEFAULTS_FILE = ".env.e2e";

export type StepFailure = { command: string; output: string };
export type EnvUpResult =
  | { outcome: "ready"; envFile: string; vars: Record<string, string> }
  | ({ outcome: "env-failed"; step: string } & StepFailure);

type Ports = {
  web: number;
  api: number;
  database: number;
  mailcatcherUi: number;
  smtp: number;
};

export function portsForSlot(slot: number): Ports {
  if (!Number.isInteger(slot) || slot < 0 || slot > 99) {
    throw new Error(`port slot must be an integer between 0 and 99, got ${slot}`);
  }
  // Slot 0 keeps the historical ports of .env.e2e; each slot adds 10 to all of them.
  const offset = slot * 10;
  return {
    web: 3001 + offset,
    api: 4001 + offset,
    database: 5433 + offset,
    mailcatcherUi: 1081 + offset,
    smtp: 1026 + offset,
  };
}

function parseDotenv(text: string): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line);
    if (match) vars[match[1]] = match[2];
  }
  return vars;
}

/** Everything the slot changes: compose variables (host ports, URLs) plus the consumer-facing URLs. */
export function stackVars(slot: number, defaults: Record<string, string>): Record<string, string> {
  const p = portsForSlot(slot);
  const web = `http://localhost:${p.web}`;
  const api = `http://localhost:${p.api}`;
  const { DATABASE_USER: user, DATABASE_PASSWORD: password, DATABASE_DB_NAME: db } = defaults;
  return {
    E2E_SLOT: String(slot),
    COMPOSE_PROJECT_NAME: `benefriches-e2e-${slot}`,
    WEBAPP_PORT: String(p.web),
    API_PORT: String(p.api),
    DATABASE_PORT: String(p.database),
    MAILCATCHER_UI_PORT: String(p.mailcatcherUi),
    SMTP_PORT: String(p.smtp),
    API_HOST_URL: `http://api:${p.api}`,
    WEBAPP_URL: web,
    AUTH_CREATE_USER_ACCOUNT_URL: `${web}/premiers-pas/identite`,
    AUTH_LOGOUT_CALLBACK_URL: `${api}/api/auth/logout-callback`,
    PRO_CONNECT_LOGIN_CALLBACK_URL: `${api}/api/auth/login-callback/pro-connect`,
    BASE_URL: web,
    API_URL: `${api}/api`,
    MAILCATCHER_URL: `http://localhost:${p.mailcatcherUi}`,
    DATABASE_URL: `postgresql://${user}:${password}@localhost:${p.database}/${db}`,
  };
}

/** Runs a command, appending its combined output to the log; rejects with a StepFailure. */
function run(cwd: string, cmd: string, args: string[], env: Record<string, string> = {}) {
  const command = [cmd, ...args].join(" ");
  return new Promise<string>((done, fail) => {
    execFile(
      cmd,
      args,
      { cwd, env: { ...process.env, ...env }, maxBuffer: 64 * 1024 * 1024 },
      (error, stdout, stderr) => {
        const output = `${stdout}${stderr}`.trim();
        appendFile(join(cwd, LOG_FILE), `$ ${command}\n${output}\n\n`)
          .catch(() => {})
          .finally(() =>
            error ? fail({ command, output: output || error.message }) : done(output),
          );
      },
    );
  });
}

function compose(cwd: string, projectName: string, args: string[]) {
  const base = ["compose", "-p", projectName, "--env-file", DEFAULTS_FILE, "-f", COMPOSE_FILE];
  // The .e2e-stack overrides must win over .env.e2e: shell env beats --env-file in compose.
  return (vars: Record<string, string>) => run(cwd, "docker", [...base, ...args], vars);
}

async function retry(check: () => Promise<void>, attempts = 20, delayMs = 1500) {
  for (let i = 1; ; i++) {
    try {
      return await check();
    } catch (error) {
      if (i >= attempts) throw error;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

async function httpOk(url: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
}

function tcpOpen(port: number) {
  return new Promise<void>((done, fail) => {
    const socket = connect({ host: "localhost", port }, () => (socket.end(), done()));
    socket.setTimeout(5000, () => (socket.destroy(), fail(new Error(`timeout on port ${port}`))));
    socket.on("error", fail);
  });
}

async function healthCheck(vars: Record<string, string>) {
  const checks: [string, () => Promise<void>][] = [
    [`web ${vars.BASE_URL}`, () => httpOk(vars.BASE_URL)],
    [`api ${vars.API_URL}/healthcheck`, () => httpOk(`${vars.API_URL}/healthcheck`)],
    [`database localhost:${vars.DATABASE_PORT}`, () => tcpOpen(Number(vars.DATABASE_PORT))],
    [`mail catcher ${vars.MAILCATCHER_URL}`, () => httpOk(vars.MAILCATCHER_URL)],
  ];
  for (const [name, check] of checks) {
    try {
      await retry(check);
    } catch (error) {
      throw { command: `health check: ${name}`, output: String(error) } satisfies StepFailure;
    }
  }
}

export async function envUp(worktree: string, slot: number): Promise<EnvUpResult> {
  const cwd = resolve(worktree);
  await rm(join(cwd, LOG_FILE), { force: true });
  let step = "configure";
  try {
    const vars = stackVars(slot, parseDotenv(await readFile(join(cwd, DEFAULTS_FILE), "utf8")));
    step = "install";
    await run(cwd, "pnpm", ["install", "--frozen-lockfile"]);
    step = "shared build";
    await run(cwd, "pnpm", ["--filter", "shared", "build"]);
    step = "compose up";
    const up = ["--progress", "quiet", "up", "-d", "--build", "--wait", "--renew-anon-volumes"];
    try {
      await compose(cwd, vars.COMPOSE_PROJECT_NAME, up)(vars);
      step = "health check";
      await healthCheck(vars);
    } catch (error) {
      // Keep the services' last logs in the failure, then remove the half-started stack.
      const logs = await compose(cwd, vars.COMPOSE_PROJECT_NAME, ["logs", "--tail", "30"])(
        vars,
      ).catch(() => "");
      await compose(cwd, vars.COMPOSE_PROJECT_NAME, ["down", "--volumes", "--remove-orphans"])(
        vars,
      ).catch(() => {});
      const failure = error as StepFailure;
      throw {
        command: failure.command,
        output: `${failure.output}\n\n--- service logs ---\n${logs}`,
      };
    }
    const envFile = join(cwd, ENV_FILE);
    const lines = Object.entries(vars).map(([k, v]) => `${k}=${v}`);
    await writeFile(
      envFile,
      `# e2e stack of port slot ${slot}, written by adws/env.ts\n${lines.join("\n")}\n`,
    );
    return { outcome: "ready", envFile, vars };
  } catch (error) {
    const failure: StepFailure =
      error && typeof error === "object" && "command" in error
        ? (error as StepFailure)
        : { command: step, output: String(error) };
    return { outcome: "env-failed", step, ...failure };
  }
}

const portFree = (port: number) =>
  new Promise<boolean>((done) => {
    const server = createServer()
      .once("error", () => done(false))
      .listen(port, () => server.close(() => done(true)));
  });

/** The first slot whose compose project isn't running and whose host ports are all free. */
export async function freeSlot(cwd: string): Promise<number> {
  const format = '{{.Label "com.docker.compose.project"}}';
  const ps = await run(cwd, "docker", ["ps", "--format", format]).catch((f: StepFailure) => {
    throw new Error(`${f.command} failed:\n${f.output}`);
  });
  // Slot 0 is left to `make e2e-up`; other stacks may hold a slot's ports under another name.
  for (let slot = 1; slot < 100; slot++) {
    if (ps.split("\n").includes(`benefriches-e2e-${slot}`)) continue;
    const free = await Promise.all(Object.values(portsForSlot(slot)).map(portFree));
    if (free.every(Boolean)) return slot;
  }
  throw new Error("no free port slot");
}

/** Removes the stack's containers and database volume. The worktree is kept. */
export async function envDown(worktree: string, slot?: number): Promise<void> {
  const cwd = resolve(worktree);
  const defaults = parseDotenv(await readFile(join(cwd, DEFAULTS_FILE), "utf8"));
  const written = await readFile(join(cwd, ENV_FILE), "utf8").then(parseDotenv, () => undefined);
  const resolvedSlot = slot ?? (written ? Number(written.E2E_SLOT) : undefined);
  if (resolvedSlot === undefined) throw new Error(`no slot given and no ${ENV_FILE} in ${cwd}`);
  const vars = stackVars(resolvedSlot, defaults);
  await compose(cwd, vars.COMPOSE_PROJECT_NAME, ["down", "--volumes", "--remove-orphans"])(vars);
  await rm(join(cwd, ENV_FILE), { force: true });
}

async function main(argv: string[]) {
  const worktreeFlag = argv.indexOf("--worktree");
  const worktree = worktreeFlag >= 0 ? argv[worktreeFlag + 1] : process.cwd();
  const [command, slotArg] = worktreeFlag >= 0 ? argv.toSpliced(worktreeFlag, 2) : argv;
  const slot = slotArg === undefined ? undefined : Number(slotArg);
  if (command === "up" && slot !== undefined) {
    const result = await envUp(worktree, slot);
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.outcome === "ready" ? 0 : 1;
  } else if (command === "down") {
    await envDown(worktree, slot);
    console.log("e2e stack removed");
  } else {
    console.error("usage: node adws/env.ts up <slot> | down [slot] [--worktree <dir>]");
    process.exitCode = 2;
  }
}

if (import.meta.main) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error?.output ?? error);
    process.exitCode = 1;
  });
}
