import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

import { VerifiedEmailRepository } from "./VerifiedEmailRepository";

@Injectable()
export class SqlVerifiedEmailRepository implements VerifiedEmailRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async isVerified(email: string): Promise<boolean> {
    const verifiedEmail = await this.sqlConnection("verified_emails").where({ email }).first();
    return !!verifiedEmail;
  }

  async save(email: string, date: Date): Promise<void> {
    await this.sqlConnection("verified_emails").insert({ email, verified_at: date });
  }
}
