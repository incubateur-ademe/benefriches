import { User } from "src/auth/core/user";

import { UserRepository } from "../../core/gateways/UsersRepository";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  save(user: User) {
    this.users.push(user);
    return Promise.resolve();
  }

  getWithEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.email === email));
  }

  getWithId(id: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.id === id));
  }

  existsWithEmail(email: string): Promise<boolean> {
    const user = this.users.find((user) => user.email === email);
    return Promise.resolve(!!user);
  }

  _setUsers(users: User[]): void {
    this.users = users;
  }

  _getUsers(): User[] {
    return [...this.users];
  }

  _clear(): void {
    this.users = [];
  }
}
