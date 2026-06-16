import { Module } from "@nestjs/common";

import { GetCityRuralityUseCase } from "src/territory/core/usecases/getCityRurality.usecase";

import { SqlCityRuralityQuery } from "../secondary/city-rurality-query/SqlCityRuralityQuery";
import { TerritoryController } from "./territory.controller";

@Module({
  controllers: [TerritoryController],
  providers: [
    {
      provide: GetCityRuralityUseCase,
      useFactory: (cityRuralityQuery: SqlCityRuralityQuery) =>
        new GetCityRuralityUseCase(cityRuralityQuery),
      inject: [SqlCityRuralityQuery],
    },
    SqlCityRuralityQuery,
  ],
  exports: [GetCityRuralityUseCase],
})
export class TerritoryModule {}
