import { Module } from "@nestjs/common";
import type { Knex } from "knex";

import {
  SqlConnection,
  SqlConnectionModule,
} from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { GetCityRuralityUseCase } from "src/territory/core/usecases/getCityRurality.usecase";

import { SqlCityRuralityQuery } from "../secondary/city-rurality-query/SqlCityRuralityQuery";
import { SqlCityStatsQuery } from "../secondary/city-stats-query/SqlCityStatsQuery";
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
      provide: SqlCityStatsQuery,
      useFactory: (sqlConnection: Knex) => new SqlCityStatsQuery(sqlConnection),
      inject: [SqlConnection],
    },
  ],
  exports: [GetCityRuralityUseCase, SqlCityStatsQuery, SqlCityRuralityQuery],
})
export class TerritoryModule {}
