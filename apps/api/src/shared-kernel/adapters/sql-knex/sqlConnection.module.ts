import { Global, Inject, Module, OnModuleDestroy } from "@nestjs/common";
import knex, { Knex } from "knex";

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
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async onModuleDestroy(): Promise<void> {
    await this.sqlConnection.destroy();
  }
}
