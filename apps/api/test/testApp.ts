import { ConfigModule } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";

import { AppModule } from "src/app.module";
import { configureServer } from "src/httpServer";
import { GeoApiGouvService } from "src/reconversion-projects/adapters/secondary/services/city-service/GeoApiGouvService";
import { MockCityDataService } from "src/reconversion-projects/adapters/secondary/services/city-service/MockCityDataService";

export async function createTestApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideModule(ConfigModule)
    .useModule(ConfigModule.forRoot({ envFilePath: ".env.test" }))
    .overrideProvider(GeoApiGouvService)
    .useClass(MockCityDataService)
    .compile();

  const testApp = moduleRef.createNestApplication<NestExpressApplication>();
  configureServer(testApp);
  return testApp;
}
