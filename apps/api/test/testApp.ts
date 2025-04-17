import { HttpService } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";

import { AppModule } from "src/app.module";
import { configureServer } from "src/httpServer";
import { PhotovoltaicGeoInfoSystemApi } from "src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi";
import { MockPhotovoltaicGeoInfoSystemApi } from "src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi.mock";

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

type ProviderOverride =
  | {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      token: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useValue: any;
    }
  | {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      token: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useClass: any;
    };

type CreateTestAppInput = {
  providerOverrides?: ProviderOverride[];
};

export async function createTestApp({ providerOverrides }: CreateTestAppInput = {}) {
  const testingModule = Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideModule(ConfigModule)
    .useModule(ConfigModule.forRoot({ envFilePath: ".env.test" }))
    .overrideProvider(HttpService)
    .useValue(ERROR_HTTP_SERVICE)
    .overrideProvider(PhotovoltaicGeoInfoSystemApi)
    .useClass(MockPhotovoltaicGeoInfoSystemApi);

  if (providerOverrides) {
    providerOverrides.forEach((override) => {
      if ("useValue" in override) {
        testingModule.overrideProvider(override.token).useValue(override.useValue);
      } else {
        testingModule.overrideProvider(override.token).useClass(override.useClass);
      }
    });
  }

  const moduleRef = await testingModule.compile();

  const testApp = moduleRef.createNestApplication<NestExpressApplication>();
  configureServer(testApp);
  return testApp;
}
