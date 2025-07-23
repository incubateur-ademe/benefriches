import { randomBytes } from "node:crypto";

import { TokenGenerator } from "src/auth/core/sendAuthLink.usecase";

export class RandomTokenGenerator implements TokenGenerator {
  generate(): string {
    return randomBytes(32).toString("hex");
  }
}
