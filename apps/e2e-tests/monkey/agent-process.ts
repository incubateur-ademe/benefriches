import type { ChildProcess } from "node:child_process";

/** How long the agent gets to exit after SIGTERM before SIGKILL, and its output to close after it exits. */
export const AGENT_STOP_GRACE_MS = 10_000;

/**
 * Signals the process group of a process spawned with `detached: true` (claude, its Playwright
 * MCP server and Chrome), else only the process: a SIGKILLed claude cannot pass the signal on.
 */
function signalTree(child: ChildProcess, signal: NodeJS.Signals): void {
  if (child.pid === undefined) return;
  try {
    process.kill(-child.pid, signal);
  } catch {
    // The group is gone (ESRCH) or the process was not spawned detached: signal the process.
    try {
      child.kill(signal);
    } catch {
      // Already gone.
    }
  }
}

/**
 * Sends SIGTERM, then SIGKILL when the process has not exited after `graceMs`: an agent that
 * ignores or stalls on SIGTERM cannot keep the run past its budget. Both go to the whole
 * process group.
 */
export function stopProcess(child: ChildProcess, graceMs: number): void {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const killTimer = setTimeout(() => {
    signalTree(child, "SIGKILL");
  }, graceMs);
  // Once claude has exited, kill what it left in the group (MCP server, Chrome) right away.
  child.once("exit", () => {
    clearTimeout(killTimer);
    signalTree(child, "SIGKILL");
  });
  signalTree(child, "SIGTERM");
}

/**
 * Resolves with the exit code once the process has exited and its output is closed. A
 * grandchild that inherited stdout or stderr can keep them open after the process exits: they
 * are destroyed `graceMs` after the exit, so the run still ends.
 */
export function waitForClose(child: ChildProcess, graceMs: number): Promise<number | null> {
  return new Promise((resolvePromise, reject) => {
    let closeTimer: NodeJS.Timeout | undefined;
    child.on("error", reject);
    child.once("exit", () => {
      closeTimer = setTimeout(() => {
        child.stdout?.destroy();
        child.stderr?.destroy();
      }, graceMs);
    });
    child.once("close", (code) => {
      clearTimeout(closeTimer);
      resolvePromise(code);
    });
  });
}
