import knex from "knex";
import knexConfig from "./knexfile";
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
