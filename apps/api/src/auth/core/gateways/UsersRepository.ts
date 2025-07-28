import { User } from "../user";

export const AUTH_USER_REPOSITORY_TOKEN = Symbol("AuthUserRepository");

export interface UserRepository {
  save(user: User): Promise<void>;

  existsWithEmail(email: string): Promise<boolean>;

  getWithEmail(email: string): Promise<User | undefined>;

  getWithId(id: string): Promise<User | undefined>;
}
