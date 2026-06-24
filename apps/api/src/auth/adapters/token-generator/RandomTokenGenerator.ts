import { createHash, randomBytes } from "node:crypto";

import { TokenGenerator } from "src/auth/core/sendAuthLink.usecase";

export class RandomTokenGenerator implements TokenGenerator {
  generatePair(): { raw: string; hashed: string } {
    const raw = randomBytes(32).toString("hex");
    const hashed = this.hash(raw);
    return { raw, hashed };
  }

  hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
