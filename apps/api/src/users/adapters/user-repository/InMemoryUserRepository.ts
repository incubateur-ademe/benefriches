import { UserRepository } from "../../core/gateways/UserRepository";
import { User } from "../../core/models/user";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async existsWithEmail(email: string) {
    return !!this.users.find((user) => user.email === email);
  }

  async save(user: User) {
    this.users.push(user);
  }

  _getUsers() {
    return this.users;
  }

  _setUsers(users: User[]) {
    this.users = users;
  }
}
