import { HttpService } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";

import { AppModule } from "src/app.module";
import {
  AUTH_USER_REPOSITORY_INJECTION_TOKEN,
  UserRepository,
} from "src/auth/core/gateways/UsersRepository";
import { User } from "src/auth/core/user";
import { configureServer } from "src/httpServer";
import { ConnectCrm } from "src/marketing/adapters/secondary/ConnectCrm";
import { FakeCrm } from "src/marketing/adapters/secondary/FakeCrm";
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
      // oxlint-disable-next-line typescript/no-explicit-any
      token: any;
      // oxlint-disable-next-line typescript/no-explicit-any
      useValue: any;
    }
  | {
      // oxlint-disable-next-line typescript/no-explicit-any
      token: any;
      // oxlint-disable-next-line typescript/no-explicit-any
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
    .useClass(MockPhotovoltaicGeoInfoSystemApi)
    .overrideProvider(ConnectCrm)
    .useClass(FakeCrm);

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

export function saveUser(app: NestExpressApplication) {
  return async (user: User) => {
    const userRepository = app.get<UserRepository>(AUTH_USER_REPOSITORY_INJECTION_TOKEN);
    await userRepository.save(user);
  };
}

export function authenticateUser(app: NestExpressApplication) {
  return async (user: User) => {
    const accessTokenService = app.get(JwtService);
    const accessToken = await accessTokenService.signAsync({
      sub: user.id,
      email: user.email,
      authProvider: "benefriches",
    });
    return { accessToken };
  };
}
