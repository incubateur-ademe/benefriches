import { TokenAuthenticationAttempt } from "./tokenAuthenticationAttempt";

export interface TokenAuthenticationAttemptRepository {
  markAsComplete(token: string, completedDate: Date): Promise<void>;
  save(authByTokenRequest: TokenAuthenticationAttempt): Promise<void>;
  hasRecentUnusedTokenForUser(userId: string, createdAfter: Date): Promise<boolean>;
  findByToken(token: string): Promise<TokenAuthenticationAttempt | null>;
}
