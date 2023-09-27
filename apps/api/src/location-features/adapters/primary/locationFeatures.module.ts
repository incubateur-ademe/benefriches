import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TownDataProvider } from "src/location-features/domain/gateways/TownDataProvider";
import { GetTownPopulationDensityUseCase } from "src/location-features/domain/usecases/getTownPopulationDensity.usecase";
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
  ],
})
export class LocationFeaturesModule {}
