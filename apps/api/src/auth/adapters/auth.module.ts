import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { ACCESS_TOKEN_SERVICE } from "./access-token/AccessTokenService";
import { AUTH_USER_REPOSITORY_TOKEN } from "./auth-user-repository/AuthUsersRepository";
import { SqlAuthUserRepository } from "./auth-user-repository/SqlAuthUsersRepository";
import { AuthController } from "./auth.controller";
import { HttpProConnectClient } from "./pro-connect/HttpProConnectClient";
import { PRO_CONNECT_CLIENT_INJECTION_TOKEN } from "./pro-connect/ProConnectClient";

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
      provide: ACCESS_TOKEN_SERVICE,
      useExisting: JwtService,
    },
    {
      provide: AUTH_USER_REPOSITORY_TOKEN,
      useClass: SqlAuthUserRepository,
    },
    {
      provide: PRO_CONNECT_CLIENT_INJECTION_TOKEN,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return new HttpProConnectClient(
          configService.getOrThrow<string>("PRO_CONNECT_CLIENT_ID"),
          configService.getOrThrow<string>("PRO_CONNECT_CLIENT_SECRET"),
          configService.getOrThrow<string>("PRO_CONNECT_PROVIDER_DOMAIN"),
        );
      },
    },
  ],
  exports: [
    // Guards are not providers and cannot be exported as is, they need all their dependencies to be exported to be used in other modules
    // see https://github.com/nestjs/nest/issues/3856
    ACCESS_TOKEN_SERVICE,
  ],
})
export class AuthModule {}
