import { Module } from "@nestjs/common";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "src/carbon-storage/domain/usecases/getCityCarbonStoragePerSoilsCategory";
import { SqlCarbonStorageRepository } from "../secondary/carbonStorageRepository/SqlCarbonStorageRepository";
import { CarbonStorageController } from "./carbonStorage.controller";

@Module({
  controllers: [CarbonStorageController],
  providers: [
    {
      provide: GetCityCarbonStoragePerSoilsCategoryUseCase,
      useFactory: (dataProvider: SqlCarbonStorageRepository) =>
        new GetCityCarbonStoragePerSoilsCategoryUseCase(dataProvider),
      inject: [SqlCarbonStorageRepository],
    },
    SqlCarbonStorageRepository,
  ],
  exports: [GetCityCarbonStoragePerSoilsCategoryUseCase],
})
export class CarbonStorageModule {}
