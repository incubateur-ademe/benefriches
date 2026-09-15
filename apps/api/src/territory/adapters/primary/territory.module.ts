import { Module } from "@nestjs/common";
import type { Knex } from "knex";

import {
  SqlConnection,
  SqlConnectionModule,
} from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { GetCityRuralityUseCase } from "src/territory/core/usecases/getCityRurality.usecase";

import { SqlCityImpactsQuery } from "../secondary/city-impacts-query/SqlCityImpactsQuery";
import { SqlCityRuralityQuery } from "../secondary/city-rurality-query/SqlCityRuralityQuery";
import { TerritoryController } from "./territory.controller";

@Module({
  imports: [SqlConnectionModule],
  controllers: [TerritoryController],
  providers: [
    {
      provide: GetCityRuralityUseCase,
      useFactory: (cityRuralityQuery: SqlCityRuralityQuery) =>
        new GetCityRuralityUseCase(cityRuralityQuery),
      inject: [SqlCityRuralityQuery],
    },
    SqlCityRuralityQuery,
    {
      provide: SqlCityImpactsQuery,
      useFactory: (sqlConnection: Knex) => new SqlCityImpactsQuery(sqlConnection),
      inject: [SqlConnection],
    },
  ],
  exports: [GetCityRuralityUseCase, SqlCityImpactsQuery, SqlCityRuralityQuery],
})
export class TerritoryModule {}
