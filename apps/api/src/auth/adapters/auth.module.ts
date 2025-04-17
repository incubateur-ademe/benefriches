import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { ACCESS_TOKEN_SERVICE } from "./AccessTokenService";
import {
  getProConnectOidcConfig,
  PRO_CONNECT_CLIENT_CONFIG as PRO_CONNECT_OIDC_CONFIG,
} from "./ProConnectOidcConfig";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.getOrThrow<string>("AUTH_JWT_SECRET"),
          signOptions: {
            expiresIn: configService.getOrThrow<string>("AUTH_JWT_EXPIRES_IN"),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: PRO_CONNECT_OIDC_CONFIG,
      useFactory: async (configService: ConfigService) => {
        const proConnectOidcConfig = await getProConnectOidcConfig({
          providerDomain: configService.getOrThrow<string>("PRO_CONNECT_PROVIDER_DOMAIN"),
          clientId: configService.getOrThrow<string>("PRO_CONNECT_CLIENT_ID"),
          clientSecret: configService.getOrThrow<string>("PRO_CONNECT_CLIENT_SECRET"),
        });

        return proConnectOidcConfig;
      },
      inject: [ConfigService],
    },
    {
      provide: ACCESS_TOKEN_SERVICE,
      useExisting: JwtService,
    },
  ],
  exports: [
    // Guards are not providers and cannot be exported as is, they need all their dependencies to be exported to be used in other modules
    // see https://github.com/nestjs/nest/issues/3856
    ACCESS_TOKEN_SERVICE,
  ],
})
export class AuthModule {}
