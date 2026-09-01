export type TokenAuthenticationAttempt = {
  userId: string;
  token: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  completedAt: Date | null;
  revokedAt: Date | null;
};

export const isTokenAuthenticationAttemptUsable = (attempt: TokenAuthenticationAttempt): boolean =>
  attempt.completedAt === null && attempt.revokedAt === null;
