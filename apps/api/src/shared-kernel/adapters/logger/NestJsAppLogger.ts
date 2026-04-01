import { Logger } from "@nestjs/common";

import type { AppLogger } from "src/shared-kernel/logger";

export class NestJsAppLogger implements AppLogger {
  private readonly logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  warn(message: string, error?: unknown): void {
    this.logger.warn(error instanceof Error ? `${message}: ${error.message}` : message);
  }

  error(message: string, error?: unknown): void {
    this.logger.error(error instanceof Error ? `${message}: ${error.message}` : message);
  }
}
