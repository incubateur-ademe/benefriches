import { UserRepository } from "src/auth/core/createUser.usecase";
import { User } from "src/auth/core/user";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async save(user: User) {
    this.users.push(user);
    await Promise.resolve();
  }

  _getUsers() {
    return this.users;
  }

  _setUsers(users: User[]) {
    this.users = users;
  }

  existsWithEmail(email: string): Promise<boolean> {
    const user = this.users.find((user) => user.email === email);
    return Promise.resolve(!!user);
  }
}
