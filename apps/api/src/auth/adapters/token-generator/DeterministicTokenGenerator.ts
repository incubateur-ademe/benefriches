import { TokenGenerator } from "src/auth/core/sendAuthLink.usecase";

export class DeterministicTokenGenerator implements TokenGenerator {
  private callCount = 0;

  private readonly token: string;
  constructor(token: string) {
    this.token = token;
  }

  generatePair(): { raw: string; hashed: string } {
    this.callCount++;
    const rawToken = this.callCount > 1 ? `${this.token}-${this.callCount}` : this.token;
    const hashedToken = this.hash(rawToken);
    return { raw: rawToken, hashed: hashedToken };
  }

  hash(token: string): string {
    return `${token}-hashed`;
  }
}
