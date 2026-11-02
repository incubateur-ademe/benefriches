import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { describe, it } from "node:test";

import { stopProcess, waitForClose } from "./agent-process";

const GRACE_MS = 200;

function spawnNode(script: string) {
  return spawn(process.execPath, ["-e", script], { stdio: ["ignore", "pipe", "pipe"] });
}

async function waitForOutput(child: ReturnType<typeof spawnNode>): Promise<void> {
  await new Promise((resolvePromise) => child.stdout.once("data", resolvePromise));
}

describe("stopProcess", () => {
  it("stops a process that exits on SIGTERM with SIGTERM", async () => {
    const child = spawnNode("console.log('ready'); setInterval(() => {}, 1000);");
    await waitForOutput(child);
    const closed = waitForClose(child, GRACE_MS);

    stopProcess(child, GRACE_MS);

    assert.equal(await closed, null);
    assert.equal(child.signalCode, "SIGTERM");
  });

  it("kills a process that ignores SIGTERM with SIGKILL after the grace period", async () => {
    const child = spawnNode(
      "process.on('SIGTERM', () => {}); console.log('ready'); setInterval(() => {}, 1000);",
    );
    await waitForOutput(child);
    const closed = waitForClose(child, GRACE_MS);
    const start = Date.now();

    stopProcess(child, GRACE_MS);

    assert.equal(await closed, null);
    assert.equal(child.signalCode, "SIGKILL");
    assert.ok(Date.now() - start >= GRACE_MS);
  });

  it("does nothing on a process that has already exited", async () => {
    const child = spawnNode("");
    assert.equal(await waitForClose(child, GRACE_MS), 0);

    stopProcess(child, GRACE_MS);

    assert.equal(child.signalCode, null);
  });
});

describe("waitForClose", () => {
  it("resolves with the exit code", async () => {
    assert.equal(await waitForClose(spawnNode("process.exit(3);"), GRACE_MS), 3);
  });

  it("resolves after the grace period when a grandchild keeps the output open", async () => {
    // The grandchild inherits stdout and stderr and outlives its parent by 5 s.
    const child = spawnNode(
      "require('node:child_process').spawn(process.execPath, ['-e', 'setTimeout(() => {}, 5000)'], { stdio: 'inherit' }).unref();",
    );
    const start = Date.now();

    assert.equal(await waitForClose(child, GRACE_MS), 0);
    assert.ok(Date.now() - start < 4_000);
  });
});
