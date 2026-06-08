import { Logger } from "@nestjs/common";

import type { AppLogger } from "src/shared-kernel/logger";

function formatMessage(message: string, error?: unknown): string {
  if (error === undefined) {
    return message;
  }
  if (error instanceof Error) {
    return `${message}: ${error.message}`;
  }
  if (typeof error === "string") {
    return `${message}: ${error}`;
  }
  return `${message}: ${JSON.stringify(error)}`;
}

export class NestJsAppLogger implements AppLogger {
  private readonly logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  info(message: string): void {
    this.logger.log(message);
  }

  warn(message: string, error?: unknown): void {
    this.logger.warn(formatMessage(message, error));
  }

  error(message: string, error?: unknown): void {
    this.logger.error(formatMessage(message, error));
  }
}
