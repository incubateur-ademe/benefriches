import { Knex } from "knex";
import { UserRepository } from "src/users/domain/gateways/UserRepository";
import { User } from "src/users/domain/models/user";

export class SqlUserRepository implements UserRepository {
  constructor(private readonly sqlConnection: Knex) {}

  async save(user: User): Promise<void> {
    await this.sqlConnection<User>("users").insert({
      id: user.id,
      email: user.email,
      password: user.password,
    });
  }

  async existsWithEmail(email: string): Promise<boolean> {
    const exists = await this.sqlConnection<User>("users")
      .select("id")
      .where({ email })
      .first();
    return !!exists;
  }

  async getWithEmail(email: string): Promise<User | undefined> {
    const result = await this.sqlConnection<User>("users")
      .select("id", "email", "password")
      .where({ email })
      .first();
    return result;
  }
}
