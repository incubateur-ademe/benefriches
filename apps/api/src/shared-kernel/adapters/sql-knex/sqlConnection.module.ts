import { Global, Module } from "@nestjs/common";
import knex from "knex";

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
export class SqlConnectionModule {}
