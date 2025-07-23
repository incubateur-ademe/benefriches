import { TokenGenerator } from "src/auth/core/sendAuthLink.usecase";

export class DeterministicTokenGenerator implements TokenGenerator {
  private callCount = 0;

  constructor(private readonly token: string) {}

  generate(): string {
    this.callCount++;
    return this.callCount > 1 ? `${this.token}-${this.callCount}` : this.token;
  }
}
