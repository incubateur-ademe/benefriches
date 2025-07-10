import { HttpService } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";

import { AppModule } from "src/app.module";
import { configureServer } from "src/httpServer";
import { DV3FApiGouvService } from "src/location-features/adapters/secondary/city-dv3f-provider/DV3FApiService";
import { MockDV3FApiService } from "src/location-features/adapters/secondary/city-dv3f-provider/DV3FApiService.mock";
import { PhotovoltaicGeoInfoSystemApi } from "src/location-features/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi";
import { MockPhotovoltaicGeoInfoSystemApi } from "src/location-features/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi.mock";
import { GeoApiGouvService } from "src/reconversion-projects/adapters/secondary/services/city-service/GeoApiGouvService";
import { MockCityDataService } from "src/reconversion-projects/adapters/secondary/services/city-service/MockCityDataService";

const ERROR_HTTP_SERVICE = {
  get: () => {
    throw new Error("HTTP requests are not allowed in tests");
  },
  post: () => {
    throw new Error("HTTP requests are not allowed in tests");
  },
  put: () => {
    throw new Error("HTTP requests are not allowed in tests");
  },
  delete: () => {
    throw new Error("HTTP requests are not allowed in tests");
  },
  patch: () => {
    throw new Error("HTTP requests are not allowed in tests");
  },
  request: () => {
    throw new Error("HTTP requests are not allowed in tests");
  },
};

export async function createTestApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideModule(ConfigModule)
    .useModule(ConfigModule.forRoot({ envFilePath: ".env.test" }))
    .overrideProvider(HttpService)
    .useValue(ERROR_HTTP_SERVICE)
    .overrideProvider(GeoApiGouvService)
    .useClass(MockCityDataService)
    .overrideProvider(DV3FApiGouvService)
    .useClass(MockDV3FApiService)
    .overrideProvider(PhotovoltaicGeoInfoSystemApi)
    .useClass(MockPhotovoltaicGeoInfoSystemApi)
    .compile();

  const testApp = moduleRef.createNestApplication<NestExpressApplication>();
  configureServer(testApp);
  return testApp;
}
