import { AuthenticatedUser, AuthUserRepository } from "./AuthUsersRepository";

export class InMemoryAuthUserRepository implements AuthUserRepository {
  private users: AuthenticatedUser[] = [];

  async getWithEmail(email: string): Promise<AuthenticatedUser | undefined> {
    return Promise.resolve(this.users.find((user) => user.email === email));
  }

  async getWithId(id: string): Promise<AuthenticatedUser | undefined> {
    return Promise.resolve(this.users.find((user) => user.id === id));
  }

  // Test helper methods
  _setUsers(users: AuthenticatedUser[]): void {
    this.users = users;
  }

  _getUsers(): AuthenticatedUser[] {
    return [...this.users];
  }

  _clear(): void {
    this.users = [];
  }
}
