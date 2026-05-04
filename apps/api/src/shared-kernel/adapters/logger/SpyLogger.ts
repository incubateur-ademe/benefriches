import type { AppLogger } from "src/shared-kernel/logger";

export type WarnLog = {
  message: string;
  error?: unknown;
};

export type ErrorLog = {
  message: string;
  error?: unknown;
};

export class SpyLogger implements AppLogger {
  readonly _info: string[] = [];
  readonly _warn: WarnLog[] = [];
  readonly _error: ErrorLog[] = [];

  info(message: string): void {
    this._info.push(message);
  }

  warn(message: string, error?: unknown): void {
    this._warn.push({ message, error });
  }

  error(message: string, error?: unknown): void {
    this._error.push({ message, error });
  }
}
