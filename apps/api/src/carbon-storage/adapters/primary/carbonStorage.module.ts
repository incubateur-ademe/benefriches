import { Module } from "@nestjs/common";
import { Knex } from "knex";
import { CarbonStorageRepository } from "src/carbon-storage/domain/gateways/CarbonStorageRepository";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "src/carbon-storage/domain/usecases/getCityCarbonStoragePerSoilsCategory";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SqlCarbonStorageRepository } from "../secondary/carbonStorageRepository/SqlCarbonStorageRepository";
import { CarbonStorageController } from "./carbonStorage.controller";

@Module({
  controllers: [CarbonStorageController],
  providers: [
    {
      provide: SqlCarbonStorageRepository,
      useFactory: (sqlConnection: Knex) =>
        new SqlCarbonStorageRepository(sqlConnection),
      inject: [SqlConnection],
    },
    {
      provide: GetCityCarbonStoragePerSoilsCategoryUseCase,
      useFactory: (dataProvider: CarbonStorageRepository) =>
        new GetCityCarbonStoragePerSoilsCategoryUseCase(dataProvider),
      inject: [SqlCarbonStorageRepository],
    },
  ],
})
export class CarbonStorageModule {}
