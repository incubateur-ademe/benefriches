import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { CreateUserUseCase } from "src/auth/core/createUser.usecase";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { RealEventPublisher } from "src/shared-kernel/adapters/events/publisher/RealEventPublisher";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import {
  UidGenerator,
  UUID_GENERATOR_INJECTION_TOKEN,
} from "src/shared-kernel/adapters/id-generator/UidGenerator";
import {
  DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN,
  DomainEventPublisher,
} from "src/shared-kernel/domainEventPublisher";
import { SqlUserFeatureAlertRepository } from "src/users/adapters/secondary/user-feature-alert-repository/SqlUserFeatureAlertRepository";

import { AuthenticateWithTokenUseCase } from "../core/authenticateWithToken.usecase";
import { TokenAuthenticationAttemptRepository } from "../core/gateways/TokenAuthenticationAttemptRepository";
import {
  AUTH_USER_REPOSITORY_INJECTION_TOKEN,
  UserRepository,
} from "../core/gateways/UsersRepository";
import { SendAuthLinkUseCase, TokenGenerator, AuthLinkMailer } from "../core/sendAuthLink.usecase";
import { ACCESS_TOKEN_SERVICE_INJECTION_TOKEN } from "./access-token/AccessTokenService";
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
import { VERIFIED_EMAIL_REPOSITORY_INJECTION_TOKEN } from "./verified-email-repository/VerifiedEmailRepository";

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
      provide: ACCESS_TOKEN_SERVICE_INJECTION_TOKEN,
      useExisting: JwtService,
    },
    {
      provide: AUTH_USER_REPOSITORY_INJECTION_TOKEN,
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
      provide: VERIFIED_EMAIL_REPOSITORY_INJECTION_TOKEN,
      useClass: SqlVerifiedEmailRepository,
    },
    {
      provide: RealEventPublisher,
      useFactory: (eventEmitter: EventEmitter2) => new RealEventPublisher(eventEmitter),
      inject: [EventEmitter2],
    },
    {
      provide: UUID_GENERATOR_INJECTION_TOKEN,
      useClass: RandomUuidGenerator,
    },
    {
      provide: DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN,
      useClass: RealEventPublisher,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        dateProvider: DateProvider,
        uidGenerator: UidGenerator,
        eventPublisher: DomainEventPublisher,
      ) => new CreateUserUseCase(userRepository, dateProvider, uidGenerator, eventPublisher),
      inject: [SqlUserRepository, RealDateProvider, RandomUuidGenerator, RealEventPublisher],
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
        uidGenerator: UidGenerator,
        eventPublisher: DomainEventPublisher,
      ) =>
        new SendAuthLinkUseCase(
          userRepository,
          tokenGenerator,
          tokenAuthAttemptRepository,
          authLinkMailer,
          dateProvider,
          configService,
          uidGenerator,
          eventPublisher,
        ),
      inject: [
        SqlUserRepository,
        RandomTokenGenerator,
        SqlTokenAuthenticationAttemptRepository,
        SmtpAuthLinkMailer,
        RealDateProvider,
        ConfigService,
        RandomUuidGenerator,
        RealEventPublisher,
      ],
    },
    {
      provide: AuthenticateWithTokenUseCase,
      useFactory: (
        tokenAuthAttemptRepository: TokenAuthenticationAttemptRepository,
        userRepository: UserRepository,
        dateProvider: DateProvider,
        tokenGenerator: TokenGenerator,
      ) =>
        new AuthenticateWithTokenUseCase(
          tokenAuthAttemptRepository,
          userRepository,
          dateProvider,
          tokenGenerator,
        ),
      inject: [
        SqlTokenAuthenticationAttemptRepository,
        SqlUserRepository,
        RealDateProvider,
        RandomTokenGenerator,
      ],
    },
    SqlUserRepository,
    SqlUserRepository,
    SqlTokenAuthenticationAttemptRepository,
    SqlUserFeatureAlertRepository,
    ConfigService,
    SmtpAuthLinkMailer,
    RealDateProvider,
    RandomTokenGenerator,
    RandomUuidGenerator,
  ],
  // Guards are not providers and cannot be exported as is, they need all their dependencies to be exported to be used in other modules
  // see https://github.com/nestjs/nest/issues/3856
  exports: [ACCESS_TOKEN_SERVICE_INJECTION_TOKEN],
})
export class AuthModule {}
