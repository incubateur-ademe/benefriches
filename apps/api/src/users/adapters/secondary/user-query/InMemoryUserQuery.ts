import { UserQuery } from "src/users/core/gateways/UserQuery";

import { UserViewModel } from "./SqlUserQuery";

export class InMemoryUserQuery implements UserQuery {
  users: UserViewModel[] = [];

  _setUsers(users: UserViewModel[]) {
    this.users = users;
  }

  getById(userId: string): Promise<UserViewModel | undefined> {
    return Promise.resolve(this.users.find(({ id }) => id === userId));
  }
}
