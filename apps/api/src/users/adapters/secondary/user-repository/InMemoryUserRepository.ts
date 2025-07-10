import { UserRepository } from "src/users/core/gateways/UserRepository";
import { User } from "src/users/core/model/user";

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
}
