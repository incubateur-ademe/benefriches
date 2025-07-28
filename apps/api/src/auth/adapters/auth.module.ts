import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { CreateUserUseCase } from "src/auth/core/createUser.usecase";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { SqlUserFeatureAlertRepository } from "src/users/adapters/secondary/user-feature-alert-repository/SqlUserFeatureAlertRepository";

import { AuthenticateWithTokenUseCase } from "../core/authenticateWithToken.usecase";
import { TokenAuthenticationAttemptRepository } from "../core/gateways/TokenAuthenticationAttemptRepository";
import { AUTH_USER_REPOSITORY_TOKEN, UserRepository } from "../core/gateways/UsersRepository";
import { SendAuthLinkUseCase, TokenGenerator, AuthLinkMailer } from "../core/sendAuthLink.usecase";
import { ACCESS_TOKEN_SERVICE } from "./access-token/AccessTokenService";
import { SmtpAuthLinkMailer } from "./auth-link-mailer/SmtpAuthLinkMailer";
import { SqlTokenAuthenticationAttemptRepository } from "./auth-token-repository/SqlTokenAuthenticationAttemptRepository";
import { AuthController } from "./auth.controller";
import { EXTERNAL_USER_IDENTITIES_REPOSITORY_INJECTION_TOKEN } from "./external-user-identities-repository/ExternalUserIdentitiesRepository";
import { SqlExternalUserIdentitiesRepository } from "./external-user-identities-repository/SqlExternalUserIdentitiesRepository";
import { HttpProConnectClient } from "./pro-connect/HttpProConnectClient";
import { PRO_CONNECT_CLIENT_INJECTION_TOKEN } from "./pro-connect/ProConnectClient";
import { RandomTokenGenerator } from "./token-generator/RandomTokenGenerator";
import { SqlUserRepository } from "./user-repository/SqlUsersRepository";
import { SqlVerifiedEmailRepository } from "./verified-email-repository/SqlVerifiedEmailRepository";
import { VERIFIED_EMAIL_REPOSITORY_TOKEN } from "./verified-email-repository/VerifiedEmailRepository";

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
      useClass: SqlUserRepository,
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
    {
      provide: EXTERNAL_USER_IDENTITIES_REPOSITORY_INJECTION_TOKEN,
      useClass: SqlExternalUserIdentitiesRepository,
    },
    {
      provide: VERIFIED_EMAIL_REPOSITORY_TOKEN,
      useClass: SqlVerifiedEmailRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: UserRepository, dateProvider: DateProvider) =>
        new CreateUserUseCase(userRepository, dateProvider),
      inject: [SqlUserRepository, RealDateProvider],
    },
    {
      provide: SendAuthLinkUseCase,
      useFactory: (
        userRepository: UserRepository,
        tokenGenerator: TokenGenerator,
        tokenAuthAttemptRepository: TokenAuthenticationAttemptRepository,
        authLinkMailer: AuthLinkMailer,
        dateProvider: DateProvider,
        configService: ConfigService,
      ) =>
        new SendAuthLinkUseCase(
          userRepository,
          tokenGenerator,
          tokenAuthAttemptRepository,
          authLinkMailer,
          dateProvider,
          configService,
        ),
      inject: [
        SqlUserRepository,
        RandomTokenGenerator,
        SqlTokenAuthenticationAttemptRepository,
        SmtpAuthLinkMailer,
        RealDateProvider,
        ConfigService,
      ],
    },
    {
      provide: AuthenticateWithTokenUseCase,
      useFactory: (
        tokenAuthAttemptRepository: TokenAuthenticationAttemptRepository,
        userRepository: UserRepository,
        dateProvider: DateProvider,
      ) =>
        new AuthenticateWithTokenUseCase(tokenAuthAttemptRepository, userRepository, dateProvider),
      inject: [SqlTokenAuthenticationAttemptRepository, SqlUserRepository, RealDateProvider],
    },
    SqlUserRepository,
    SqlUserRepository,
    SqlTokenAuthenticationAttemptRepository,
    SqlUserFeatureAlertRepository,
    ConfigService,
    SmtpAuthLinkMailer,
    RealDateProvider,
    RandomTokenGenerator,
  ],
  // Guards are not providers and cannot be exported as is, they need all their dependencies to be exported to be used in other modules
  // see https://github.com/nestjs/nest/issues/3856
  exports: [ACCESS_TOKEN_SERVICE],
})
export class AuthModule {}
