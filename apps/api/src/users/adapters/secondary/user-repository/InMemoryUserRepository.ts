import { User } from "src/users/core/model/user";
import { UserRepository } from "src/users/core/usecases/createUser.usecase";

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
