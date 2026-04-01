export interface AppLogger {
  warn(message: string, error?: unknown): void;
  error(message: string, error?: unknown): void;
}
