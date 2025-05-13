export const AUTH_USER_REPOSITORY_TOKEN = Symbol("AuthUserRepository");

export interface AuthUserRepository {
  existsWithEmail(email: string): Promise<boolean>;
}
