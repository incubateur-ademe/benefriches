import { Injectable } from "@nestjs/common";

import { TokenAuthenticationAttemptRepository } from "src/auth/core/gateways/TokenAuthenticationAttemptRepository";
import { TokenAuthenticationAttempt } from "src/auth/core/tokenAuthenticationAttempt";

@Injectable()
export class InMemoryTokenAuthenticationAttemptRepository
  implements TokenAuthenticationAttemptRepository
{
  tokens: TokenAuthenticationAttempt[] = [];

  save(authToken: TokenAuthenticationAttempt): Promise<void> {
    this.tokens.push(authToken);

    return Promise.resolve();
  }

  hasRecentUnusedTokenForUser(userId: string, createdAfter: Date): Promise<boolean> {
    const hasToken = this.tokens.some(
      (token) =>
        token.userId === userId && token.completedAt === null && token.createdAt > createdAfter,
    );

    return Promise.resolve(hasToken);
  }

  findByToken(token: string): Promise<TokenAuthenticationAttempt | null> {
    const existingToken = this.tokens.find((t) => t.token === token);

    if (!existingToken) return Promise.resolve(null);

    return Promise.resolve(existingToken);
  }

  markAsComplete(token: string, completedDate: Date): Promise<void> {
    const attemptToUpdateIndex = this.tokens.findIndex((attempt) => attempt.token === token);
    const attemptToUpdate = this.tokens[attemptToUpdateIndex];
    if (!attemptToUpdate) return Promise.resolve();

    this.tokens[attemptToUpdateIndex] = { ...attemptToUpdate, completedAt: completedDate };

    return Promise.resolve();
  }
}
