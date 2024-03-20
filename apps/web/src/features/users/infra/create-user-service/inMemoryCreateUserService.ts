import { CreateUserGateway } from "../../application/createUser.action";
import { User } from "../../domain/user";

export class InMemoryCreateUserService implements CreateUserGateway {
  _users: User[] = [];

  constructor(private readonly shouldFail: boolean = false) {}

  async save(newUser: User) {
    if (this.shouldFail) throw new Error("Intended error");

    await Promise.resolve(this._users.push(newUser));
  }
}
