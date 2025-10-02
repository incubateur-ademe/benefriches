import { TokenAuthenticationAttempt } from "../tokenAuthenticationAttempt";

export interface TokenAuthenticationAttemptRepository {
  markAsComplete(tokenHash: string, completedDate: Date): Promise<void>;
  save(authByTokenRequest: TokenAuthenticationAttempt): Promise<void>;
  hasRecentUnusedTokenForUser(userId: string, createdAfter: Date): Promise<boolean>;
  findByToken(tokenHash: string): Promise<TokenAuthenticationAttempt | null>;
}
