import { Global, Inject, Module, OnModuleDestroy } from "@nestjs/common";
import knex, { type Knex } from "knex";

import knexConfig from "./knexConfig";

export const SqlConnection = "SqlConnection";

@Global()
@Module({
  exports: [SqlConnection],
  providers: [
    {
      provide: SqlConnection,
      useValue: knex(knexConfig),
    },
  ],
})
export class SqlConnectionModule implements OnModuleDestroy {
  private readonly sqlConnection: Knex;
  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async onModuleDestroy(): Promise<void> {
    await this.sqlConnection.destroy();
  }
}
