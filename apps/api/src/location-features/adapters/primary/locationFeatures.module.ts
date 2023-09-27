import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CarbonStocksPerSoilsCategoryDataProvider } from "src/location-features/domain/gateways/CarbonStocksPerSoilCategoryDataProvider";
import { TownDataProvider } from "src/location-features/domain/gateways/TownDataProvider";
import { GetTownCarbonStocksPerSoilsCategoryUseCase } from "src/location-features/domain/usecases/getTownCarbonStocksPerSoilsCategory";
import { GetTownPopulationDensityUseCase } from "src/location-features/domain/usecases/getTownPopulationDensity.usecase";
import { CarbonStocksPerSoilsCategoryService } from "../secondary/town-data-provider/CarbonStocksPerSoilsCategoryService";
import { LocalDataInseeService } from "../secondary/town-data-provider/LocalDataInseeService";
import { LocationFeaturesController } from "./locationFeatures.controller";

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [LocationFeaturesController],
  providers: [
    { provide: "TownDataProvider", useClass: LocalDataInseeService },
    {
      provide: GetTownPopulationDensityUseCase,
      useFactory: (townDataProvider: TownDataProvider) =>
        new GetTownPopulationDensityUseCase(townDataProvider),
      inject: ["TownDataProvider"],
    },
    {
      provide: "CarbonStocksPerSoilsCategoryDataProvider",
      useClass: CarbonStocksPerSoilsCategoryService,
    },
    {
      provide: GetTownCarbonStocksPerSoilsCategoryUseCase,
      useFactory: (dataProvider: CarbonStocksPerSoilsCategoryDataProvider) =>
        new GetTownCarbonStocksPerSoilsCategoryUseCase(dataProvider),
      inject: ["CarbonStocksPerSoilsCategoryDataProvider"],
    },
  ],
})
export class LocationFeaturesModule {}
