import type { AppLogger } from "src/shared-kernel/logger";

export class SilentLogger implements AppLogger {
  // oxlint-disable-next-line no-empty-function
  warn(): void {}
  // oxlint-disable-next-line no-empty-function
  error(): void {}
}
