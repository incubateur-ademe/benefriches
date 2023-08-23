import knex from "knex";
import knexConfig from "./knexConfig";
import { Global, Module } from "@nestjs/common";

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
