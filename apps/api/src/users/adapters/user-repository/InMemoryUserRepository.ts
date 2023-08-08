import { UserRepository } from "../../domain/gateways/UserRepository";
import { User } from "../../domain/models/user";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async getWithEmail(email: string) {
    return Promise.resolve(this.users.find((user) => user.email === email));
  }

  async existsWithEmail(email: string) {
    const user = await this.getWithEmail(email);
    return !!user;
  }

  async save(user: User) {
    await Promise.resolve(this.users.push(user));
  }

  _getUsers() {
    return this.users;
  }

  _setUsers(users: User[]) {
    this.users = users;
  }
}
