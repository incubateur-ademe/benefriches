export interface AppLogger {
  info(message: string): void;
  warn(message: string, error?: unknown): void;
  error(message: string, error?: unknown): void;
}
