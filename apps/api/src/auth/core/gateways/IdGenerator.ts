export const UUID_GENERATOR_INJECTION_TOKEN = "UuidGenerator";

export interface UuidGenerator {
  generate(): string;
}
