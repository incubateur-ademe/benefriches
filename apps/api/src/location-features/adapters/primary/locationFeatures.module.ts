import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GetTownPopulationDensityUseCase } from "src/location-features/domain/usecases/getTownPopulationDensity.usecase";
import { LocalDataInseeService } from "../secondary/town-data-provider/LocalDataInseeService";
import { LocationFeaturesController } from "./locationFeatures.controller";

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [LocationFeaturesController],
  providers: [
    { provide: "LocalDataInseeService", useClass: LocalDataInseeService },
    {
      provide: GetTownPopulationDensityUseCase,
      useFactory: (townDataProvider: LocalDataInseeService) =>
        new GetTownPopulationDensityUseCase(townDataProvider),
      inject: ["LocalDataInseeService"],
    },
  ],
})
export class LocationFeaturesModule {}
