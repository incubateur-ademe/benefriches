export type TokenAuthenticationAttempt = {
  userId: string;
  token: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  completedAt: Date | null;
};
