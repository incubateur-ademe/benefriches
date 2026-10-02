import { HttpModule, HttpService } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { Knex } from "knex";

import {
  SqlConnection,
  SqlConnectionModule,
} from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { MunicipalityCapitalExpendituresProvider } from "src/territory/core/gateways/MunicipalityCapitalExpendituresProvider";
import { GetCityRuralityUseCase } from "src/territory/core/usecases/getCityRurality.usecase";

import { SqlCityImpactsQuery } from "../secondary/city-impacts-query/SqlCityImpactsQuery";
import { SqlCityRuralityQuery } from "../secondary/city-rurality-query/SqlCityRuralityQuery";
import { OFGLApi } from "../secondary/municipality-capital-expenditures-query/ApiMunicipalCapitalExpendituresQuery";
import { FakeMunicipalityCapitalExpendituresProvider } from "../secondary/municipality-capital-expenditures-query/FakeMunicipalityCapitalExpendituresProvider";
import { TerritoryController } from "./territory.controller";

@Module({
  imports: [SqlConnectionModule, ConfigModule, HttpModule],
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
    {
      provide: OFGLApi,
      useFactory: (
        httpService: HttpService,
        configService: ConfigService,
      ): MunicipalityCapitalExpendituresProvider =>
        configService.get("MOCK_OFGL_API") === "true"
          ? new FakeMunicipalityCapitalExpendituresProvider()
          : new OFGLApi(httpService),
      inject: [HttpService, ConfigService],
    },
  ],
  exports: [GetCityRuralityUseCase, SqlCityImpactsQuery, SqlCityRuralityQuery, OFGLApi],
})
export class TerritoryModule {}
