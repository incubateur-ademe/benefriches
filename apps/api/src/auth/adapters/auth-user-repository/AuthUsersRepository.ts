export const AUTH_USER_REPOSITORY_TOKEN = Symbol("AuthUserRepository");

export type AuthenticatedUser = {
  id: string;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string;
  structureType?: string;
  structureActivity?: string;
  structureName?: string;
};

export interface AuthUserRepository {
  getWithEmail(email: string): Promise<AuthenticatedUser | undefined>;

  getWithId(id: string): Promise<AuthenticatedUser | undefined>;
}
