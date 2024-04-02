import { User } from "src/users/domain/model/user";
import { UserRepository } from "src/users/domain/usecases/createUser.usecase";

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
