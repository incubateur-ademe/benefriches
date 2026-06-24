import { HttpModule, HttpService } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import type { PhotovoltaicDataProvider } from "src/photovoltaic-performance/core/gateways/PhotovoltaicDataProvider";
import { GetPhotovoltaicExpectedPerformanceUseCase } from "src/photovoltaic-performance/core/usecases/getPhotovoltaicExpectedPerformanceUseCase";

import { FakePhotovoltaicDataProvider } from "../secondary/photovoltaic-data-provider/FakePhotovoltaicDataProvider";
import { PhotovoltaicGeoInfoSystemApi } from "../secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi";
import { PhotovoltaicPerformanceController } from "./photovoltaicPerformance.controller";

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [PhotovoltaicPerformanceController],
  providers: [
    {
      provide: GetPhotovoltaicExpectedPerformanceUseCase,
      useFactory: (photovoltaicDataProvider: PhotovoltaicDataProvider) =>
        new GetPhotovoltaicExpectedPerformanceUseCase(photovoltaicDataProvider),
      inject: [PhotovoltaicGeoInfoSystemApi],
    },
    {
      provide: PhotovoltaicGeoInfoSystemApi,
      useFactory: (
        httpService: HttpService,
        configService: ConfigService,
      ): PhotovoltaicDataProvider =>
        configService.get("MOCK_PHOTOVOLTAIC_PERFORMANCE_API") === "true"
          ? new FakePhotovoltaicDataProvider()
          : new PhotovoltaicGeoInfoSystemApi(httpService),
      inject: [HttpService, ConfigService],
    },
  ],
})
export class PhotovoltaicPerformanceModule {}
