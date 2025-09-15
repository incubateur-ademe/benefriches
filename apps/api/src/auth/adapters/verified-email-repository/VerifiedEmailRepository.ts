export const VERIFIED_EMAIL_REPOSITORY_INJECTION_TOKEN = "VerifiedEmailRepositoryToken";

export interface VerifiedEmailRepository {
  isVerified(email: string): Promise<boolean>;
  save(email: string, date: Date): Promise<void>;
}
